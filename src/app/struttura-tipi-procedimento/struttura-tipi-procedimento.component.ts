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
  public dataSourceUtente: DataSource;
  private strutturaSelezionata: Struttura;
  public procedimento: Procedimento = new Procedimento();
  public initialProcedimento: Procedimento;
  private dataFromAziendaTipiProcedimentoComponent;

  public abilitaSalva: boolean = false;
  public campiEditabiliDisabilitati: boolean = true;
  public testoBottone: string = "Modifica";

  public headerTipoProcedimento;
  public headerAzienda;
  public headerStruttura;

  public formVisible: boolean = false;

  public popupVisible: boolean = false;

  constructor(private odataContextFactory: OdataContextFactory, private sharedData: SharedData, private router: Router) {

    this.setDataFromDettaglioProcedimentoComponent();
    this.strutturaSelezionata = new Struttura();
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
  this.datasource = new DataSource({
    store: this.odataContextDefinition.getContext()[FunctionsImport.GetStruttureByTipoProcedimento.name],
    customQueryParams: {
      idAziendaTipoProcedimento: this.sharedData.getSharedObject()["AziendeTipiProcedimentoComponent"]["aziendaTipoProcedimento"]["idTipoProcedimento"]["idTipoProcedimento"],
      idAzienda: this.sharedData.getSharedObject()["AziendeTipiProcedimentoComponent"]["aziendaTipoProcedimento"]["idAzienda"]["id"]
    }
  });
 }

   /** aziendaTipoProcedimento.id
   * Legge i dati passatti dall'interfaccia precedente AziendeTipiProcedimentoComponent
   */
  private setDataFromDettaglioProcedimentoComponent() {
    this.dataFromAziendaTipiProcedimentoComponent = this.sharedData.getSharedObject()["AziendeTipiProcedimentoComponent"];
    this.headerAzienda = this.dataFromAziendaTipiProcedimentoComponent.descrizione;
  }

  private caricaDettaglioProcedimento(setInitialValue: boolean) {
    const odataContextDefinitionProcedimento: OdataContextEntitiesDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    const aziendaTipoProcedimento: AziendaTipoProcedimento = this.dataFromAziendaTipiProcedimentoComponent["aziendaTipoProcedimento"];
    if (!this.dataSourceProcedimento) {
      this.dataSourceProcedimento = new DataSource({
        store: odataContextDefinitionProcedimento.getContext()[Entities.Procedimento.name],
        requireTotalCount: true,
        expand: ["idAziendaTipoProcedimento", "idTitolarePotereSostitutivo", "idAziendaTipoProcedimento.idTipoProcedimento", "idAziendaTipoProcedimento.idTitolo"],
        filter: [["idAziendaTipoProcedimento.id", "=", aziendaTipoProcedimento.id], "and", ["idStruttura.id", "=", this.strutturaSelezionata.id] ]
      })
    } else {
      this.dataSourceProcedimento.filter([["idAziendaTipoProcedimento.id", "=", aziendaTipoProcedimento.id], "and", ["idStruttura.id", "=", this.strutturaSelezionata.id]]);
    }
    this.dataSourceProcedimento.load().then(res => {
      res.length ? this.formVisible = true : this.formVisible = false;
      this.procedimento.build(res[0], Procedimento);
      if (setInitialValue) {
          this.setInitialValues();
      }
    });
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
          .done(res => (this.caricaDettaglioProcedimento(true)));
        notify( {
          message: "Salvataggio effettuato con successo",
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
    this.cambiaStatoForm();
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

  private cambiaStatoForm() {
    this.abilitaSalva = !this.abilitaSalva;
    this.campiEditabiliDisabilitati = !this.campiEditabiliDisabilitati;
  }

  setInitialValues() {
    this.initialProcedimento = Object.assign({}, this.procedimento);
  }

  selezionaStruttura(obj) {
    this.headerStruttura = obj.nome;
    this.strutturaSelezionata.id = obj.id;
    this.caricaDettaglioProcedimento(true);
  }

  ngOnInit() {
    this.headerTipoProcedimento = this.sharedData.getSharedObject()["headerTipoProcedimento"];
    this.headerAzienda = this.sharedData.getSharedObject()["headerAzienda"];
    this.headerStruttura = "Seleziona una struttura...";
  }

  showPopup() {
    this.popupVisible = true;
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


