import { Component, Input, OnInit, ViewChild } from "@angular/core";
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

@Component({
  selector: "app-struttura-tipi-procedimento",
  templateUrl: "./struttura-tipi-procedimento.component.html",
  styleUrls: ["./struttura-tipi-procedimento.component.scss"]
})
export class StrutturaTipiProcedimentoComponent implements OnInit {
  @ViewChild("treeView") treeView: any;


  public datasource: DataSource;
  public strutture: Struttura = new Struttura();
  public contextMenuItems;

  public nodeInvolved: Object = {};

  public dataSourceUtente: DataSource;
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

  public formVisible = false;

  public popupVisible = false;

  private odataContextDefinition;
  private nodeSelectedFromContextMenu: any;
  private initialState: any;
  private dataSourceProcedimento: DataSource;
  private strutturaSelezionata: Struttura;
  private dataFromAziendaTipiProcedimentoComponent;


  constructor(private odataContextFactory: OdataContextFactory,
              private globalContextService: GlobalContextService,
              private router: Router) {

    this.setDataFromDettaglioProcedimentoComponent();
    this.strutturaSelezionata = new Struttura();
    // COSTRUZIONE MENU CONTESTUALE SULL'ALBERO
    this.contextMenuItems = [{ text: "Espandi a strutture figlie" }];

    //   this.datasource = new DataSource({
    //     store: this.odataContextDefinition.getContext()[Entities.Struttura],
    //     filter: ['FK_id_azienda', '=', 5], //Il valore numerico è l'id dell'azienda, aperto RM per renderlo parametrizzabile
    //   });
    //  }

    this.odataContextDefinition = odataContextFactory.buildOdataFunctionsImportDefinition();

    const odataContextDefinitionUtente: OdataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams("descrizione");
    customLoadingFilterParams.addFilter(["tolower(${target})", "contains", "${value.tolower}"]);

    this.dataSourceUtente = new DataSource({
      store: odataContextDefinitionUtente.getContext()[Entities.Utente.name].on("loading", (loadOptions) => {
        loadOptions.userData["customLoadingFilterParams"] = customLoadingFilterParams;
        odataContextDefinitionUtente.customLoading(loadOptions);
      }),
      filter: [["idAzienda.id", "=", this.idAziendaFront]]
    });

    this.datasource = new DataSource({
      store: this.odataContextDefinition.getContext()[FunctionsImport.GetStruttureByTipoProcedimento.name],
      customQueryParams: {
        idAziendaTipoProcedimento: this.dataFromAziendaTipiProcedimentoComponent.aziendaTipoProcedimento.idTipoProcedimento.idTipoProcedimento,
        idAzienda: this.dataFromAziendaTipiProcedimentoComponent.aziendaTipoProcedimento.idAzienda.id
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
            .update(this.procedimento.idProcedimento, this.procedimento)
            .done(res => (this.caricaDettaglioProcedimento(true)));
          notify({
            message: "Salvataggio effettuato con successo",
            type: "success",
            displayTime: 1200,
            position: {
              my: "bottom",
              at: "top",
              of: "#responsive-box-buttons"
            }
          });
          this.testoBottone = "Modifica";
          this.cambiaStatoForm();
        } else {
          notify({
            message: "Correggere l'intervallo di validità",
            type: "error",
            displayTime: 1200,
            position: {
              my: "bottom",
              at: "top",
              of: "#responsive-box-buttons"
            }
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
  }

  screen(width) {
    return (width < 700) ? "sm" : "lg";
  }

  private cambiaStatoForm() {
    this.abilitaSalva = !this.abilitaSalva;
    this.campiEditabiliDisabilitati = !this.campiEditabiliDisabilitati;
  }

  /* Legge i dati passatti dall'interfaccia precedente AziendeTipiProcedimentoComponent e setto le variabili */
  private setDataFromDettaglioProcedimentoComponent() {
    this.dataFromAziendaTipiProcedimentoComponent = this.globalContextService.getInnerSharedObject("AziendeTipiProcedimentoComponent");
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
        expand: ["idAziendaTipoProcedimento", "idTitolarePotereSostitutivo", "idAziendaTipoProcedimento.idTipoProcedimento", "idAziendaTipoProcedimento.idTitolo"],
        filter: [["idAziendaTipoProcedimento.id", "=", aziendaTipoProcedimento.id], "and", ["idStruttura.id", "=", this.strutturaSelezionata.id]]
      });
    } else {
      this.dataSourceProcedimento.filter([["idAziendaTipoProcedimento.id", "=", aziendaTipoProcedimento.id], "and", ["idStruttura.id", "=", this.strutturaSelezionata.id]]);
    }
    this.dataSourceProcedimento.load().then(res => {
      res.length ? this.formVisible = true : this.formVisible = false;  /* Se non ho risultato nascondo il form */
      this.procedimento.build(res[0], Procedimento);
      if (setInitialValue) {
        this.setInitialValues();
      }
    });
  }

}


