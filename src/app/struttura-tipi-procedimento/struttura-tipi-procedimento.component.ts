import { Component, Input, OnInit, ViewChild, SimpleChange, OnChanges, SimpleChanges } from "@angular/core";
import { Location } from "@angular/common";
import DataSource from "devextreme/data/data_source";
import { Router, ActivatedRoute, Params } from "@angular/router";
import {
  OdataContextDefinition, OdataContextFactory, OdataContextEntitiesDefinition,
  Entity, CustomLoadingFilterParams, GlobalContextService, ServerObject
} from "@bds/nt-context";
import {
  Struttura, AziendaTipoProcedimento, Procedimento, Utente,
  GetStruttureByTipoProcedimento, UtenteStruttura
} from "@bds/nt-entities";
import notify from "devextreme/ui/notify";
import { NodeOperations } from "../reusable-component/strutture-tree/strutture-tree.component";
import { confirm } from "devextreme/ui/dialog";

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

  public possoAgire = false;

  /*   public abilitaSalva = false;
    public campiEditabiliDisabilitati = true;
    public testoBottone = "Modifica"; */

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

  public descrizioneDataFields: any =
    {
      "idResponsabileAdozioneAttoFinale": "Responsabile dell\'adozione dell\'atto finale", 
      "idTitolarePotereSostitutivo": "Titolare potere sostitutivo",
      "ufficio": "Ufficio",
      "strumenti": "Strumenti di tutela amministrativa e giurisdizionale riconosciuti dalla Legge",
      "modalitaInfo": "'Modalità informativa stato iter",
      "descrizioneAtti": "Descrizione atti e documenti da allegare all\'istanza",
      "dataInizio": "Data Inizio",
      "dataFine": "Data Fine",
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


  private caricaDettaglioProcedimento() {
    const odataContextDefinitionProcedimento: OdataContextEntitiesDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    const aziendaTipoProcedimento: AziendaTipoProcedimento = this.dataFromAziendaTipiProcedimentoComponent["aziendaTipoProcedimento"];

    this.defaultResponsabile = new UtenteStruttura();
    this.defaultTitolare = new UtenteStruttura();

/*     this.defaultResponsabile = undefined;
    this.defaultTitolare = undefined; */
    if (!this.dataSourceProcedimento) {
      this.dataSourceProcedimento = new DataSource({
        store: odataContextDefinitionProcedimento.getContext()[new Procedimento().getName()],
        requireTotalCount: true,
        expand: ["idAziendaTipoProcedimento", "idTitolarePotereSostitutivo", "idAziendaTipoProcedimento.idTipoProcedimento", "idAziendaTipoProcedimento.idTitolo",
          "idStrutturaTitolarePotereSostitutivo", "idStrutturaResponsabileAdozioneAttoFinale", "idResponsabileAdozioneAttoFinale"],
        filter: [["idAziendaTipoProcedimento.id", "=", this.idAziendaTipoProcedimentoFront], "and", ["idStruttura.id", "=", this.strutturaSelezionata.id]],
        map: (item) => {
          item.idAziendaTipoProcedimento.idTitolo.nome = "[" + item.idAziendaTipoProcedimento.idTitolo.classificazione + "] " + item.idAziendaTipoProcedimento.idTitolo.nome;
          return item;
        }
      });
    } else {
      this.dataSourceProcedimento.filter([["idAziendaTipoProcedimento.id", "=", this.idAziendaTipoProcedimentoFront], "and", ["idStruttura.id", "=", this.strutturaSelezionata.id]]);
    }
    this.dataSourceProcedimento.load().then(res => {
      res.length ? this.formVisible = true : this.formVisible = false;  /* Se non ho risultato nascondo il form */
      this.procedimento.build(res[0]);
      this.setInitialValues();

      

      let idUtente = res[0].idResponsabileAdozioneAttoFinale ? res[0].idResponsabileAdozioneAttoFinale.id : null;
      let idStruttura = res[0].idStrutturaResponsabileAdozioneAttoFinale ? res[0].idStrutturaResponsabileAdozioneAttoFinale.id : null;



      if (!this.dataSourceResponsabile) {
        this.dataSourceResponsabile = this.creaDataSourceUtente(this.odataContextDefinitionResponsabile, idUtente, idStruttura, "responsabile");
      } else if (idUtente && idStruttura) {
        this.dataSourceResponsabile.filter([["idUtente.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.id", "=", idUtente], "and",
        ["idStruttura.id", "=", idStruttura]]);
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
        this.dataSourceTitolare.filter([["idStruttura.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.id", "=", idUtente], "and",
        ["idStruttura.id", "=", idStruttura]]);
        this.dataSourceTitolare.load().then(result => {
          console.log("SUCCESSO_CARICAMENTO_TITOLARE");
          // console.log("RESULT = ", result);
          this.defaultTitolare = result[0];
          this.testoTooltipTitolare = result[0].nomeVisualizzato;
        }).catch(err => console.log("ERRORE_CARICAMENTO_TITOLARE", err));
      } else {
        this.defaultTitolare = undefined;
        this.testoTooltipResponsabile = null;
      }
    });
  }
  setInitialValues() {
    this.initialProcedimento = ServerObject.cloneObject(this.procedimento);

    console.log("PROCEDIMENTO", this.procedimento);
    console.log("INITIAL_PROCEDIMENTO", this.initialProcedimento);
  }

  public bottoneModificaProcedimento() {
    this.possoAgire = true;

  }


  public bottoneSalvaProcedimento() {

    let differenze: string[] = ServerObject.compareObjs(this.descrizioneDataFields, this.initialProcedimento, this.procedimento);
    let differenzeStr: string = "";
    if (differenze.length > 0) {
      differenze.forEach(element => differenzeStr += element + ", ");
    }

    if (differenzeStr === "") {
      return;
    }

    differenzeStr = differenzeStr.substring(0, differenzeStr.length - 2);

    confirm("Hai modificato i seguenti campi: " + differenzeStr + ". Sei sicuro di voler procedere?", "Conferma").then(dialogResult => {
      if (dialogResult) {
        if (!(this.procedimento.dataFine < this.procedimento.dataInizio) || this.procedimento.dataFine === null) {
          this.dataSourceProcedimento.store()
            .update(this.procedimento.id, this.procedimento)
            .done(res => (this.caricaDettaglioProcedimento()));
          notify({
            message: "Salvataggio effettuato con successo",
            type: "success",
            displayTime: 1200
          });
          this.possoAgire = false;
        } else {
          notify({
            message: "Correggere l'intervallo di validità",
            type: "error",
            displayTime: 1200
          });
        }
      }
    });
  }

  public bottoneAnnulla() {

    let differenze: string[] = ServerObject.compareObjs(this.descrizioneDataFields, this.initialProcedimento, this.procedimento);
    console.log("DIFFERENZE", differenze);
    // c'è qualche differenza, ricaricare i dati tramite chiamata http per tornare alla situazione di partenza
    // potrebbe bastare che mi riassegni il valore iniziale del procedimento ma non funziona coi dati delle lookup
    if (differenze.length !== 0) {
      this.caricaDettaglioProcedimento();
    }
    this.possoAgire = false;
  }



  selezionaStruttura(obj) {
    this.headerStruttura = obj.nome;
    this.strutturaSelezionata.id = obj.id;
    this.caricaDettaglioProcedimento();
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
      filter: [["idStruttura.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.id", "=", idUtente], "and",
      ["idStruttura.id", "=", idStruttura]],
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
      searchExpr: function (dataItem) {
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
    this.dataSourceResponsabile.filter([["idStruttura.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.idAzienda.id", "=", this.idAziendaFront]]);
    this.dataSourceResponsabile.load();
  }

  reloadTitolare() {
    this.dataSourceTitolare.filter([["idStruttura.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.idAzienda.id", "=", this.idAziendaFront]]);
    this.dataSourceTitolare.load();
  }

  goBack() {
    this._location.back();
  }

}
