import { Component, Input, OnInit, ViewChild, SimpleChange, OnChanges, SimpleChanges } from "@angular/core";
import { Location } from "@angular/common";
import DataSource from "devextreme/data/data_source";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { 
    OdataContextDefinition, OdataContextFactory, OdataContextEntitiesDefinition, 
    Entity, CustomLoadingFilterParams, GlobalContextService } from "@bds/nt-context";
import {
    Struttura, AziendaTipoProcedimento, Procedimento, Utente,
    GetStruttureByTipoProcedimento, UtenteStruttura
} from "@bds/nt-entities";
import notify from "devextreme/ui/notify";
import { NodeOperations } from "../reusable-component/strutture-tree/strutture-tree.component";

@Component({
  selector: "app-struttura-tipi-procedimento",
  templateUrl: "./struttura-tipi-procedimento.component.html",
  styleUrls: ["./struttura-tipi-procedimento.component.scss"]
})
export class StrutturaTipiProcedimentoComponent implements OnInit {
  private odataContextDefinition;
  private odataContextDefinitionAzienda;
  private nodeSelectedFromContextMenu: any;
  private initialState: any;
  private dataSourceProcedimento: DataSource;
  private datasourceAziendaTipiProcedimento: DataSource;
  private strutturaSelezionata: Struttura;
  private odataContextDefinitionTitolare;
  private odataContextDefinitionResponsabile;

  @ViewChild("treeView") treeView: any;

  public datasource: DataSource;
  public strutture: Struttura = new Struttura();
  public contextMenuItems;

  public nodeInvolved: Object = {};

  public dataSourceResponsabile: DataSource;        // Datasource Utente per il Responsabile dell’adozione dell’atto finale  
  public dataSourceTitolare: DataSource;            // Datasource Utente per il Titolare Postere Sostitutivo

  public procedimento: Procedimento = new Procedimento();
  public initialProcedimento: Procedimento;

  public abilitaSalva = false;
  public campiEditabiliDisabilitati = true;
  public testoBottone = "Modifica";

  public headerTipoProcedimento: string;
  public headerStruttura;

  /* Variabili passate all'albero */
  public idAziendaFront: number;
  public idAziendaTipoProcedimentoFront: number;
  public aziendaTipiProcedimentoData: any;

  public defaultResponsabile: UtenteStruttura;
  public defaultTitolare: UtenteStruttura;

  public formVisible = false;
  public popupVisible = false;
  public colCountByScreen = {
    md: 2,
    sm: 1
  };
  public testoTooltipResponsabile: String;
  public testoTooltipTitolare: String;
  public dataFromAziendaTipiProcedimentoComponent: AziendaTipoProcedimento = new AziendaTipoProcedimento();
  
  constructor(private odataContextFactory: OdataContextFactory,
              private globalContextService: GlobalContextService,
              private router: Router, private activatedRoute: ActivatedRoute,
              private _location: Location) {

    this.activatedRoute.queryParams.subscribe((queryParams: Params) => {
      this.idAziendaFront = +queryParams["azienda"];
      this.idAziendaTipoProcedimentoFront = +queryParams["aziendaTipoProcedimento"];
      this.headerTipoProcedimento = queryParams["tipoProcedimento"];
    });

    this.strutturaSelezionata = new Struttura();
    // COSTRUZIONE MENU CONTESTUALE SULL'ALBERO
    this.contextMenuItems = [{ text: "Espandi a struttureAfferenzaDiretta figlie" }];

    this.odataContextDefinition = odataContextFactory.buildOdataFunctionsImportDefinition();
    this.odataContextDefinitionTitolare = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.odataContextDefinitionResponsabile = this.odataContextFactory.buildOdataContextEntitiesDefinition();
   
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("descrizione");
    customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);

  }

  private cambiaStatoForm() {
    this.abilitaSalva = !this.abilitaSalva;
    this.campiEditabiliDisabilitati = !this.campiEditabiliDisabilitati;
  }

  private caricaDettaglioProcedimento(setInitialValue: boolean) {
    const odataContextDefinitionProcedimento: OdataContextEntitiesDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    const aziendaTipoProcedimento: AziendaTipoProcedimento = this.dataFromAziendaTipiProcedimentoComponent["aziendaTipoProcedimento"];
    this.defaultResponsabile = undefined;
    this.defaultTitolare = undefined;
    if (!this.dataSourceProcedimento) {
      this.dataSourceProcedimento = new DataSource({
        store: odataContextDefinitionProcedimento.getContext()[new Procedimento().getName()],
        requireTotalCount: true,
        expand: ["idAziendaTipoProcedimento", "idTitolarePotereSostitutivo", "idAziendaTipoProcedimento.idTipoProcedimento", "idAziendaTipoProcedimento.idTitolo", 
                "idStrutturaTitolarePotereSostitutivo", "idStrutturaResponsabileAdozioneAttoFinale", "idResponsabileAdozioneAttoFinale"],
        filter: [["idAziendaTipoProcedimento.id", "=", this.idAziendaTipoProcedimentoFront], "and", ["idStruttura.id", "=", this.strutturaSelezionata.id]]
      });
    } else {
      this.dataSourceProcedimento.filter([["idAziendaTipoProcedimento.id", "=", this.idAziendaTipoProcedimentoFront], "and", ["idStruttura.id", "=", this.strutturaSelezionata.id]]);
    }
    this.dataSourceProcedimento.load().then(res => {
      res.length ? this.formVisible = true : this.formVisible = false;  /* Se non ho risultato nascondo il form */
      this.procedimento.build(res[0]);

      let idUtente = res[0].idResponsabileAdozioneAttoFinale ? res[0].idResponsabileAdozioneAttoFinale.id : null;
      let idStruttura = res[0].idStrutturaResponsabileAdozioneAttoFinale ? res[0].idStrutturaResponsabileAdozioneAttoFinale.id : null;

      if (!this.dataSourceResponsabile) {
        this.dataSourceResponsabile = this.creaDataSourceUtente(this.odataContextDefinitionResponsabile, idUtente, idStruttura, "responsabile");
      } else if (idUtente && idStruttura) {
        this.dataSourceResponsabile.filter( [["idUtente.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.id", "=", idUtente], "and", 
        ["idStruttura.id", "=", idStruttura] ]);
        this.dataSourceResponsabile.load().then(result => {
          // console.log("RESULT = ", result);
            this.defaultResponsabile = result[0];
            this.testoTooltipResponsabile = result[0].nomeVisualizzato;
        });
        // this.dato =  this.dataSourceResponsabile.items().filter(x => x.idUtente.id === idResp && x.idStruttura.id === idStruttResp)[0];
      } else {
        this.defaultResponsabile = undefined;
        this.testoTooltipResponsabile = null;
      }

      idUtente = res[0].idTitolarePotereSostitutivo ? res[0].idTitolarePotereSostitutivo.id : null;
      idStruttura = res[0].idStrutturaTitolarePotereSostitutivo ? res[0].idStrutturaTitolarePotereSostitutivo.id : null;

      if (!this.dataSourceTitolare) {
        this.dataSourceTitolare = this.creaDataSourceUtente(this.odataContextDefinitionTitolare, idUtente, idStruttura, "titolare");
      } else if (idUtente && idStruttura) {
        this.dataSourceTitolare.filter( [["idUtente.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.id", "=", idUtente], "and", 
        ["idStruttura.id", "=", idStruttura] ]);
        this.dataSourceTitolare.load().then(result => {
          // console.log("RESULT = ", result);
            this.defaultTitolare = result[0];
            this.testoTooltipTitolare = result[0].nomeVisualizzato;
        });
      } else  {
        this.defaultTitolare = undefined;
        this.testoTooltipResponsabile = null;
      }    

      if (setInitialValue) {
        this.setInitialValues();
      }
    });
  }

  public bottoneSalvaProcedimento(flagSalva: boolean) {
    if (!this.abilitaSalva) {
      this.testoBottone = "Salva";
      this.cambiaStatoForm();
    } else {
      if (flagSalva) {   
        if (!(this.procedimento.dataFine < this.procedimento.dataInizio) || this.procedimento.dataFine === null) {
          this.dataSourceProcedimento.store()
            .update(this.procedimento.id, this.procedimento)
            .done(res => (this.caricaDettaglioProcedimento(true)));
          notify({
            message: "Salvataggio effettuato con successo",
            type: "success",
            displayTime: 1200
          });
          this.testoBottone = "Modifica";
          this.cambiaStatoForm();
        } else {
          notify({
            message: "Correggere l'intervallo di validità",
            type: "error",
            displayTime: 1200
          });
        }
      }
    }
  }

  public bottoneAnnulla() {
    if (!Entity.isEquals(this.procedimento, this.initialProcedimento)) {
      this.caricaDettaglioProcedimento(false);
      this.bottoneSalvaProcedimento(false);
    } else {
      if (!this.campiEditabiliDisabilitati) {
        this.testoBottone = "Modifica";
        this.cambiaStatoForm();
      }
    }
    // this.router.navigate(["/aziende-tipi-procedimento"]);
  }

  setInitialValues() {
    this.initialProcedimento = Object.assign({}, this.procedimento);
  }

  selezionaStruttura(obj) {
    this.headerStruttura = obj.nome;
    this.strutturaSelezionata.id = obj.id;
    this.caricaDettaglioProcedimento(true);
    if (!this.campiEditabiliDisabilitati) {
      this.testoBottone = "Modifica";
      this.cambiaStatoForm();
    }
  }

  /* Setto qui i dati che verranno passati al componente dell'albero e alla popup */
  ngOnInit() {
    this.aziendaTipiProcedimentoData = {
      idAzienda: this.idAziendaFront,
      idAziendaTipoProcedimento: this.idAziendaTipoProcedimentoFront,
      headerTipoProcedimento: this.headerTipoProcedimento
    };
    this.headerStruttura = "Seleziona una struttura...";
  }

  showPopup() {
    this.popupVisible = true;
  }

  // QUESTO EVENTO VIENE EMESSO DALLA POPUP E INDICA ALLA PAGINA SOTTOSTANTE CHE DEVE RICARICARE L'ALBERO PER FAR VEDERE LE MODIFICHE EFFETTUATE
  // qui al posto di fare questa load, vado a ciclare sugli elementi dell'albero in modo da modificare il check direttamente 
  // sui nodi dell'albero. Non posso fare il .load() sul datasource perchè poi ogni volta mi richiude l'albero
  //  console.log(this.treeView.datasource);
  refreshTreeView(nodesInvolved) {

    if (nodesInvolved !== new Object() && nodesInvolved !== {}) {
      let keys = Object.keys(nodesInvolved);
      console.log(nodesInvolved);
      
      if (this.treeView.treeViewChild.items != null) {
        const nodes = this.treeView.treeViewChild.items;

        for (let key of keys) {

          console.log("Operation", nodesInvolved[key]);
          const node = nodes.find(item =>
            item.id === parseInt(key)
          );
          
           if (nodesInvolved[key] === NodeOperations.INSERT) {
             this.treeView.treeViewChild.instance.selectItem(node.id);
           }
           else {
              this.treeView.treeViewChild.instance.unselectItem(node.id);      
           }
        }
      }
    }

    this.popupVisible = false;
  }

  screen(width) {
    return (width <= 1200) ? "sm" : "md";
  }
  
  creaDataSourceUtente(context: OdataContextDefinition, idUtente: number, idStruttura: number, chiamante: string): DataSource {
    const dataSource = new DataSource({
      store: context.getContext()[new UtenteStruttura().getName()],
      expand: [
        "idUtente", "idStruttura", "idAfferenzaStruttura", "idUtente.idPersona", "idUtente.idAzienda"
      ],
      filter: [["idUtente.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.id", "=", idUtente], "and", 
                ["idStruttura.id", "=", idStruttura] ],
      map: (item) => {
        if (item) {
          if (item.idStruttura && item.idAfferenzaStruttura) {
            item.nomeVisualizzato = item.idUtente.idPersona.descrizione + " (" + item.idStruttura.nome + " - " + 
            item.idAfferenzaStruttura.descrizione + ")";
          }
          return item;
        }
      },
      sort: ["idUtente.idPersona.descrizione"],
      searchExpr: function(dataItem) {
        return dataItem.idUtente.idPersona.descrizione;
    }
    });
    dataSource.load().then(res => {
      if (chiamante === "responsabile") {
        this.defaultResponsabile = res[0];
        this.testoTooltipResponsabile = res[0].nomeVisualizzato;
      } else {
        this.defaultTitolare = res[0];
        this.testoTooltipTitolare = res[0].nomeVisualizzato;
      }  
    });
    return dataSource;
  }

  setResponsabilePlusStruttura(event: any) {
    // console.log("EVENT SETRESP = ", event);
    this.procedimento.idResponsabileAdozioneAttoFinale = event.itemData.idUtente;
    this.procedimento.idStrutturaResponsabileAdozioneAttoFinale = event.itemData.idStruttura;
    this.testoTooltipResponsabile = event.itemData.nomeVisualizzato;
    // console.log("PROCEDIMENTO RESP = ", event);
  }

  setTitolarePlusStruttura(event: any) {
    // console.log("EVENT SETTITO = ", event);
    this.procedimento.idTitolarePotereSostitutivo = event.itemData.idUtente;
    this.procedimento.idStrutturaTitolarePotereSostitutivo = event.itemData.idStruttura;
    this.testoTooltipTitolare = event.itemData.nomeVisualizzato;
    // console.log("PROCEDIMENTO TITO = ", this.procedimento);
  }

  reloadResponsabile() {
    this.dataSourceResponsabile.filter(null);
    this.dataSourceResponsabile.load();
  }

  reloadTitolare() {
    this.dataSourceTitolare.filter(null);
    this.dataSourceTitolare.load();
  }

  goBack() {
    this._location.back();
  }

}
