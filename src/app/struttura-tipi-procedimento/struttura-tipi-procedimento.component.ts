import {Component, Input, OnInit, ViewChild} from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { Router } from "@angular/router";
import { SharedData } from '@bds/nt-angular-context/shared-data';
import { OdataContextDefinition } from '@bds/nt-angular-context/odata-context-definition';
import {OdataContextFactory} from '@bds/nt-angular-context/odata-context-factory';
import ODataStore from "devextreme/data/odata/store";
import { Struttura } from '../classi/server-objects/entities/struttura';
import { FunctionsImport, Entities } from '../../environments/app.constants';
import { OdataContextEntitiesDefinition } from '@bds/nt-angular-context/odata-context-entities-definition';
import { AziendaTipoProcedimento } from 'app/classi/server-objects/entities/azienda-tipo-procedimento';
import { Procedimento } from 'app/classi/server-objects/entities/procedimento';
import { Entity } from '@bds/nt-angular-context/entity';
import notify from 'devextreme/ui/notify';
import { CustomLoadingFilterParams } from '@bds/nt-angular-context/custom-loading-filter-params';
import {forEach} from "@angular/router/src/utils/collection";


@Component({
  selector: "app-struttura-tipi-procedimento",
  templateUrl: "./struttura-tipi-procedimento.component.html",
  styleUrls: ["./struttura-tipi-procedimento.component.css"]
})
export class StrutturaTipiProcedimentoComponent implements OnInit {

  public datasource: DataSource;
  public strutture: Struttura = new Struttura();
  private odataContextDefinition;
  public contextMenuItems;
  private nodeSelectedFromContextMenu: any;
  @ViewChild('treeView') treeView: any;
  private initialState: any;


  private dataSourceProcedimento: DataSource;
  private dataSourceUtente: DataSource;
  private strutturaSelezionata: Struttura;
  public procedimento: Procedimento = new Procedimento();
  public initialProcedimento: Procedimento;
  private dataFromAziendaTipiProcedimentoComponent;

  public abilitaSalva: boolean = false;
  public campiEditabiliDisabilitati: boolean = true;
  public testoBottone: string = "Modifica";

  private idAziendaProcedimentoProva: number = 55;
  public headerTipoProcedimento;
  public headerAzienda;


  constructor(private odataContextFactory: OdataContextFactory, private sharedData: SharedData, private router: Router) {

    this.setDataFromDettaglioProcedimentoComponent();
    this.strutturaSelezionata = new Struttura();
    this.strutturaSelezionata.id = 10;
    // COSTRUZIONE MENU CONTESTUALE SULL'ALBERO
    this.contextMenuItems = [{ text: 'Espandi a strutture figlie' }];

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
    store: odataContextDefinitionUtente.getContext()[Entities.Utente.name].on('loading', (loadOptions) => {
      loadOptions.userData['customLoadingFilterParams'] = customLoadingFilterParams;
      odataContextDefinitionUtente.customLoading(loadOptions);
    }),
    filter: [['idAzienda.id', '=', this.sharedData.getSharedObject()["AziendeTipiProcedimentoComponent"]["aziendaTipoProcedimento"]["idAzienda"]["id"]]]
  });
  console.log("SENSAZIONI", this.sharedData.getSharedObject()["AziendeTipiProcedimentoComponent"]["aziendaTipoProcedimento"]["idAzienda"]["id"]);
  this.datasource = new DataSource({
    store: this.odataContextDefinition.getContext()[FunctionsImport.GetStruttureByTipoProcedimento.name],
    customQueryParams: {
      idAziendaTipoProcedimento: 33,
      idAzienda: 5
    }
  });
  this.setInitialValues();
  this.caricaDettaglioProcedimento();
 }

     /** aziendaTipoProcedimento.id
     * Legge i dati passatti dall'interfaccia precedente AziendeTipiProcedimentoComponent
     */
  private setDataFromDettaglioProcedimentoComponent() {
    this.dataFromAziendaTipiProcedimentoComponent = this.sharedData.getSharedObject()["AziendeTipiProcedimentoComponent"];
    this.headerAzienda = this.dataFromAziendaTipiProcedimentoComponent.descrizione;
    console.log("CIAO", this.dataFromAziendaTipiProcedimentoComponent);
  }

  private caricaDettaglioProcedimento() {
    const odataContextDefinitionProcedimento: OdataContextEntitiesDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    const aziendaTipoProcedimento: AziendaTipoProcedimento = this.dataFromAziendaTipiProcedimentoComponent["aziendaTipoProcedimento"];
    console.log("Azienda", aziendaTipoProcedimento);
    if (!this.dataSourceProcedimento) {
      this.dataSourceProcedimento = new DataSource({
        store: odataContextDefinitionProcedimento.getContext()[Entities.Procedimento.name],
        expand: ["idAziendaTipoProcedimento", "idTitolarePotereSostitutivo", "idAziendaTipoProcedimento.idTipoProcedimento", "idAziendaTipoProcedimento.idTitolo"],
        filter: [["idAziendaTipoProcedimento.id", "=", this.idAziendaProcedimentoProva]/* , "and", ["idStruttura.id", "=", this.strutturaSelezionata.id] */]
      })
    } else {
      console.log("ELSE");
      // this.dataSourceProcedimento.filter([["idAziendaTipoProcedimento.id", "=", aziendaTipoProcedimento.id], "and", ["idStruttura.id", "=", this.strutturaSelezionata.id]]);
      this.dataSourceProcedimento.filter(["idAziendaTipoProcedimento.id", "=", this.idAziendaProcedimentoProva]);
    }
    this.dataSourceProcedimento.load().then(res => {
        this.procedimento.build(res[0], Procedimento);
        console.log("Procedimento", this.procedimento);
     });
  }

  public sbloccaCampiEditabili() {
    this.abilitaSalva = false;
    this.campiEditabiliDisabilitati = false;
  }

  public bottoneSalvaProcedimento(flagSalva: boolean) {
    // !this.abilitaSalva ? this.testoBottone = "Salva" : this.testoBottone = "Modifica";
    if (!this.abilitaSalva) {
      this.testoBottone = "Salva";
    } else {
      this.testoBottone = "Modifica";
      if (flagSalva) {
        this.dataSourceProcedimento.store()
          .update(this.procedimento.idProcedimento, this.procedimento)
          .done(res => (this.caricaDettaglioProcedimento()));
        notify( {
          message: "salvataggio effettuato con successo",
          type: "success",
          displayTime: 1200,
          position: {
              my: "bottom",
              at: "top",
              of: "#responsive-box-buttons"
          }
        });
      }
    }
    this.abilitaSalva = !this.abilitaSalva;
    this.campiEditabiliDisabilitati = !this.campiEditabiliDisabilitati;
  }

  public bottoneAnnulla() {
    if (!Entity.isEquals(this.procedimento, this.initialProcedimento)) {
      this.caricaDettaglioProcedimento();
      this.bottoneSalvaProcedimento(false);
    }
    // this.router.navigate(["/aziende-tipi-procedimento"]);
  }

  setInitialValues() {
    console.log("onInitialized");
    this.initialProcedimento = Object.assign({}, this.procedimento);
  }

  public formFieldDataChanged(event) {
    console.log("dataChanged: ", Entity.isEquals(this.procedimento, this.initialProcedimento));
    console.log('Event object: ', event)
    this.abilitaSalva = !Entity.isEquals(this.procedimento, this.initialProcedimento);
    if (this.abilitaSalva) {
        this.testoBottone = "Salva";
        this.setInitialValues();
    } else {
        this.testoBottone = "Modifica";
    }
  }

  ngOnInit() {
    this.headerTipoProcedimento = this.sharedData.getSharedObject()["HeaderTipoProcedimento"]["headerTipoProcedimento"];
    this.headerAzienda = this.sharedData.getSharedObject()["HeaderAzienda"]["headerAzienda"];
  }


  // caricamentoAlbero(e) {
  //   const value = e.node;
  // }

  /*Questo evento scatta quando clicchiamo sul nodo dell'albero per far aprire il menu contestuale
     in questo momento ci salviamo il nodo cliccato */
  // openContextMenu(e) {
  //   this.nodeSelectedFromContextMenu = e.itemData;
  //   // this.abilitaRicorsione = true;
  // }


   // this.treeView.selectNodesRecursive = true;
  //Questo scatta quando clicchiamo sulla voce del menu contestuale "Espandi..."
  // contextualItemClick(e) {

  //   //FUNZIONE CHE SELEZIONA TUTTI I FIGLI
  //   console.log(this.datasource);


  //   this.treeView.selectNodesRecursive = true;
  //   this.treeView.instance.selectItem(this.nodeSelectedFromContextMenu.id);
  //  // this.treeView.selectNodesRecursive = false;

  //   this.nodeSelectedFromContextMenu.selected = true;

  //   // console.log('VAL: ' + this.nodeSelectedFromContextMenu.id);
  // }

  screen(width) {
    return (width < 700) ? "sm" : "lg";
  }

  // handleEvent(eventName: string, e: Event) {
  //   switch (eventName) {
  //     // case 'treeItemSelectionChanged':
  //     //   this.treeItemSelectionChanged(e);
  //     //   break;
  //   }
  // }

  // private treeItemSelectionChanged(e) {
  //   this.emitTreeNodeSelected.emit(e.node);
  // }

  // private setSelectedNodeRecursively(node: any): void {
  //   // this.node.item
  //     console.log("item: " + node);
  //     const res = this.getNestedChildren(this.datasource.items(), node.id);

  //     console.log("TREE");
  //     res.forEach(function (element) {
  //         element.selected = true;
  //         console.log(element.nome);
  //     });
  // }

  //   private getNestedChildren(inputArray, selectedNode) {
  //   const result = []
  //   for (const i in inputArray) {
  //       if (inputArray[i].idStrutturaPadre === selectedNode) {
  //            this.getNestedChildren(inputArray, inputArray[i].id);
  //           this.treeView.instance.selectItem(inputArray[i].id);
  //           result.push(inputArray[i]);
  //       }
  //   }
  //   return result;
  //   }

  //   private esegui() {
  //     const res = this.datasource.items();
  //       res.forEach(function (element) {
  //           if (element.selected === true) {
  //               console.log(element.nome);
  //           }
  //       });
  //   }

    // private setInitialState() {
    //      this.initialState = this.datasource.items();
    // }
}


