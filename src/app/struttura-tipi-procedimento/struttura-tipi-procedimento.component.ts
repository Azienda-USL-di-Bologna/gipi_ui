import { Component, Input, OnInit, ViewChild, SimpleChange, OnChanges, SimpleChanges } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { Router } from "@angular/router";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import { OdataContextFactory } from "@bds/nt-angular-context/odata-context-factory";
import ODataStore from "devextreme/data/odata/store";
import { Struttura } from "../classi/server-objects/entities/struttura";
import { FunctionsImport, Entities } from "../../environments/app.constants";
import { OdataContextEntitiesDefinition } from "@bds/nt-angular-context/odata-context-entities-definition";
import { AziendaTipoProcedimento } from "app/classi/server-objects/entities/azienda-tipo-procedimento";
import { Procedimento } from "app/classi/server-objects/entities/procedimento";
import { Entity } from "@bds/nt-angular-context/entity";
import notify from "devextreme/ui/notify";
import { CustomLoadingFilterParams } from "@bds/nt-angular-context/custom-loading-filter-params";
import { forEach } from "@angular/router/src/utils/collection";
import { NodeOperations } from "../reusable-component/strutture-tree/strutture-tree.component";
import {GlobalContextService} from "@bds/nt-angular-context/global-context.service";
import { UtenteStruttura } from "../classi/server-objects/entities/utente-struttura";

@Component({
  selector: "app-struttura-tipi-procedimento",
  templateUrl: "./struttura-tipi-procedimento.component.html",
  styleUrls: ["./struttura-tipi-procedimento.component.scss"]
})
export class StrutturaTipiProcedimentoComponent implements OnInit {
  private odataContextDefinition;
  private nodeSelectedFromContextMenu: any;
  private initialState: any;
  private dataSourceProcedimento: DataSource;
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

  public headerTipoProcedimento;
  public headerAzienda;
  public headerStruttura;

  /* Variabili passate all'albero */
  public idAziendaFront;
  public idAziendaTipoProcedimentoFront;

  public defaultResponsabile: UtenteStruttura;
  public defaultTitolare: UtenteStruttura;

  public formVisible = false;
  public popupVisible = false;
  public colCountByScreen = {
    md: 2,
    sm: 1
};
  public dataFromAziendaTipiProcedimentoComponent;
  

  constructor(private odataContextFactory: OdataContextFactory,
              private globalContextService: GlobalContextService,
              private router: Router) {

    this.setDataFromDettaglioProcedimentoComponent();
    this.strutturaSelezionata = new Struttura();
    // COSTRUZIONE MENU CONTESTUALE SULL'ALBERO
    this.contextMenuItems = [{ text: "Espandi a struttureAfferenzaDiretta figlie" }];

    this.odataContextDefinition = odataContextFactory.buildOdataFunctionsImportDefinition();
    this.odataContextDefinitionTitolare = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.odataContextDefinitionResponsabile = this.odataContextFactory.buildOdataContextEntitiesDefinition();
   
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("descrizione");
    customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);

    this.datasource = new DataSource({
      store: this.odataContextDefinition.getContext()[FunctionsImport.GetStruttureByTipoProcedimento.name],
      customQueryParams: {
        idAziendaTipoProcedimento: this.dataFromAziendaTipiProcedimentoComponent.aziendaTipoProcedimento.idTipoProcedimento.id,
        idAzienda: this.dataFromAziendaTipiProcedimentoComponent.aziendaTipoProcedimento.idAzienda.id
      }
    });
  }

  private cambiaStatoForm() {
    this.abilitaSalva = !this.abilitaSalva;
    this.campiEditabiliDisabilitati = !this.campiEditabiliDisabilitati;
  }

  /* Legge i dati passatti dall'interfaccia precedente AziendeTipiProcedimentoComponent e setto le variabili */
  private setDataFromDettaglioProcedimentoComponent() {
    this.dataFromAziendaTipiProcedimentoComponent = this.globalContextService.getInnerSharedObject("GestioneAssociazioneAziendaComponent");
    const aziendaTipoProcedimento: AziendaTipoProcedimento = this.dataFromAziendaTipiProcedimentoComponent["aziendaTipoProcedimento"];
    this.idAziendaFront = aziendaTipoProcedimento.idAzienda.id;
    this.idAziendaTipoProcedimentoFront = aziendaTipoProcedimento.id;
  }

  private caricaDettaglioProcedimento(setInitialValue: boolean) {
    const odataContextDefinitionProcedimento: OdataContextEntitiesDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    const aziendaTipoProcedimento: AziendaTipoProcedimento = this.dataFromAziendaTipiProcedimentoComponent["aziendaTipoProcedimento"];
    if (!this.dataSourceProcedimento) {
      this.dataSourceProcedimento = new DataSource({
        store: odataContextDefinitionProcedimento.getContext()[Entities.Procedimento.name],
        requireTotalCount: true,
        expand: ["idAziendaTipoProcedimento", "idTitolarePotereSostitutivo", "idAziendaTipoProcedimento.idTipoProcedimento", "idAziendaTipoProcedimento.idTitolo", 
                "idStrutturaTitolarePotereSostitutivo", "idStrutturaResponsabileAdozioneAttoFinale", "idResponsabileAdozioneAttoFinale"],
        filter: [["idAziendaTipoProcedimento.id", "=", aziendaTipoProcedimento.id], "and", ["idStruttura.id", "=", this.strutturaSelezionata.id]]
      });
    } else {
      this.dataSourceProcedimento.filter([["idAziendaTipoProcedimento.id", "=", aziendaTipoProcedimento.id], "and", ["idStruttura.id", "=", this.strutturaSelezionata.id]]);
    }
    this.dataSourceProcedimento.load().then(res => {
      res.length ? this.formVisible = true : this.formVisible = false;  /* Se non ho risultato nascondo il form */
      this.procedimento.build(res[0], Procedimento);

      let idUtente = res[0].idResponsabileAdozioneAttoFinale ? res[0].idResponsabileAdozioneAttoFinale.id : null;
      let idStruttura = res[0].idStrutturaResponsabileAdozioneAttoFinale ? res[0].idStrutturaResponsabileAdozioneAttoFinale.id : null;

      if (!this.dataSourceResponsabile) {
        this.dataSourceResponsabile = this.creaDataSourceUtente(this.odataContextDefinitionResponsabile, idUtente, idStruttura, "responsabile");
      } else if (idUtente && idStruttura) {
        this.dataSourceResponsabile.filter( [["idUtente.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.id", "=", idUtente], "and", 
        ["idStruttura.id", "=", idStruttura] ]);
        this.dataSourceResponsabile.load().then(result => {
          console.log("RESULT = ", result);
            this.defaultResponsabile = result[0];
        });
        // this.dato =  this.dataSourceResponsabile.items().filter(x => x.idUtente.id === idResp && x.idStruttura.id === idStruttResp)[0];
      } else {
        this.defaultResponsabile = undefined;
      }

      idUtente = res[0].idTitolarePotereSostitutivo ? res[0].idTitolarePotereSostitutivo.id : null;
      idStruttura = res[0].idStrutturaTitolarePotereSostitutivo ? res[0].idStrutturaTitolarePotereSostitutivo.id : null;

      if (!this.dataSourceTitolare) {
        this.dataSourceTitolare = this.creaDataSourceUtente(this.odataContextDefinitionTitolare, idUtente, idStruttura, "titolare");
      } else if (idUtente && idStruttura) {
        this.dataSourceTitolare.filter( [["idUtente.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.id", "=", idUtente], "and", 
        ["idStruttura.id", "=", idStruttura] ]);
        this.dataSourceTitolare.load().then(result => {
          console.log("RESULT = ", result);
            this.defaultTitolare = result[0];
        });
      } else  {
        this.defaultTitolare = undefined;
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

  /* Leggo qui dallo SharedData gli header perché vengono caricati prima del constructor */
  ngOnInit() {
    this.headerTipoProcedimento = this.dataFromAziendaTipiProcedimentoComponent.headerTipoProcedimento;
    this.headerAzienda = this.dataFromAziendaTipiProcedimentoComponent.headerAzienda;
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
            item.id === key
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
      store: context.getContext()[Entities.UtenteStruttura.name],
      expand: [
        "idUtente", "idStruttura", "idAfferenzaStruttura", "idUtente.idPersona", "idUtente.idAzienda"
      ],
      filter: [["idUtente.idAzienda.id", "=", this.idAziendaFront], "and", ["idUtente.id", "=", idUtente], "and", 
                ["idStruttura.id", "=", idStruttura] ],
      map: (item) => {
        if (item) {
          if (item.idStruttura && item.idAfferenzaStruttura) {
            item.nomeVisualizzato = item.idUtente.idPersona.descrizione + " (" + item.idStruttura.nome + ")";
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
      chiamante === "responsabile" ? this.defaultResponsabile = res[0] : this.defaultTitolare = res[0];
    });
    return dataSource;
  }

  setResponsabilePlusStruttura(event: any) {
    console.log("EVENT SETRESP = ", event);
    this.procedimento.idResponsabileAdozioneAttoFinale = event.itemData.idUtente;
    this.procedimento.idStrutturaResponsabileAdozioneAttoFinale = event.itemData.idStruttura;
    console.log("PROCEDIMENTO RESP = ", event);
  }

  setTitolarePlusStruttura(event: any) {
    console.log("EVENT SETTITO = ", event);
    this.procedimento.idTitolarePotereSostitutivo = event.itemData.idUtente;
    this.procedimento.idStrutturaTitolarePotereSostitutivo = event.itemData.idStruttura;
    console.log("PROCEDIMENTO TITO = ", this.procedimento);
  }

  reloadResponsabile() {
    this.dataSourceResponsabile.filter(null);
    this.dataSourceResponsabile.load();
  }

  reloadTitolare() {
    this.dataSourceTitolare.filter(null);
    this.dataSourceTitolare.load();
  }

}
