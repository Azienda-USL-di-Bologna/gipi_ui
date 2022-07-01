import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { DxDataGridComponent, DxTagBoxComponent } from "devextreme-angular";
import { DefinizioneTipiProcedimentoService } from "./definizione-tipi-procedimento.service";
import { TipoProcedimento, Registro, RegistroTipoProcedimento, bUtente, Utente } from "@bds/nt-entities";
import { OdataContextDefinition, GlobalContextService, OdataContextFactory, CustomLoadingFilterParams } from "@bds/nt-context";
import { ActivatedRoute, Router } from "@angular/router";
import { LoggedUser } from "@bds/nt-login";


@Component({
  selector: "definizione-tipi-procedimento",
  templateUrl: "./definizione-tipi-procedimento.component.html",
  styleUrls: ["./definizione-tipi-procedimento.component.scss"]
})
export class DefinizioneTipiProcedimentoComponent implements OnInit, OnDestroy {

  private odataContextDefinition: OdataContextDefinition;
  
  // questa proprietà serve per capire che pulsante è stato cliccato
  private comando: any;
  private selectedRow: any;
  private tipoProcedimento: TipoProcedimento;
  private loggedUser: LoggedUser;
  private registriTipo: RegistroTipoProcedimento[];
  private isNewRow = false;

  @ViewChild("definizione_tipi_procedimento") public grid: DxDataGridComponent;
  @ViewChild("tag_pubblicazione") public tagPubblicazione: DxTagBoxComponent;

  @Input("refreshButton") public refreshButton;

  public patternGreaterZero: any =  "^[1-9]+[0-9]*$";
  public patternGreaterEqualZero: any =  "^[0-9]+[0-9]*$";
  public dataSource: DataSource;
  public dataSourceRegistri: DataSource;
  public dataSourceRegistriProcedimento: DataSource;
  public tipiProcedimento: TipoProcedimento[] = new Array<TipoProcedimento>();
  public texts: Object = {
    editRow: "Modifica",
    deleteRow: "Elimina",
    saveRowChanges: "Salva",
    cancelRowChanges: "Annulla",
    confirmDeleteMessage: "Stai per cancellare il tipo di procedimento: procedere?"
  };
  public popupButtons: any[];
  public registri: any[];
  showTagBox = true;
  constructor(private odataContexFactory: OdataContextFactory,
    private service: DefinizioneTipiProcedimentoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private globalContextService: GlobalContextService) {

    // this.sharedData.setSharedObject({route: "definizione-tipi-procedimento"});

    this.odataContextDefinition = odataContexFactory.buildOdataContextEntitiesDefinition();
    const customLoadingFilterParams: CustomLoadingFilterParams = new CustomLoadingFilterParams();
    customLoadingFilterParams.addFilter("nome", ["tolower(${target})", "contains", "${value.tolower}"]);
    this.dataSource = new DataSource({
      store: this.odataContextDefinition.getContext()[new TipoProcedimento().getName()].on("loading", (loadOptions) => {
        loadOptions.userData["customLoadingFilterParams"] = customLoadingFilterParams;
        this.odataContextDefinition.customLoading(loadOptions);
      })
      /*       map: function (item) {
             if (item.dataInizioValidita != null)
                item.dataInizioValidita = new Date(item.dataInizioValidita.getTime() - new Date().getTimezoneOffset() * 60000);
              if (item.dataFineValidita != null)
                item.dataFineValidita = new Date(item.dataFineValidita.getTime() - new Date().getTimezoneOffset() * 60000);
      
              return item;
            } */
    });

    this.dataSource.load().then(res => this.buildTipiProcedimento(res));
    this.setFormLook();
  }

  private setFormLook() {
    this.popupButtons = [{
      toolbar: "bottom",
      location: "center",
      widget: "dxButton",
      options: {
        type: "normal",
        text: "Chiudi",
        onClick: () => {
          this.grid.instance.cancelEditData();
          this.showTagBox = false;
        }
      }
    },
    {
      toolbar: "bottom",
      location: "center",
      widget: "dxButton",
      options: {
        type: "normal",
        text: "Salva",
        onClick: (params) => {
           let result = params.validationGroup.validate();
          // console.log("RESULT: ", result);
          if (result.isValid) {
            if (this.isNewRow) {
              this.grid.instance.saveEditData();
            } else {
              this.grid.instance.saveEditData();
              this.gestisciPubblicazioni();
            }
          } else {
              // params.validator.reset();
          }
        }
      }
    }];
  }

  // cancello la riga passata come parametro
  private cancellaRiga(row: any) {
    // prendo l'indice della riga selezionata e
    this.grid.instance.deleteRow(row.rowIndex);
    this.comando = null; // rimetto il comando a null così non c'è pericolo di fare cose sulla riga selezionata
  }

  // modifico la riga passata come parametro
  private modificaRiga(row: any) {
    this.grid.instance.editRow(row.rowIndex);
    this.comando = null; // rimetto il comando a null così non c'è pericolo di fare cose sulla riga selezionata
  }

  private getRegistri(): DataSource {
    return new DataSource({
      store: this.odataContextDefinition.getContext()[new Registro().getName()]
    });
  }

  private cellClick(e: any) {
    this.service.valorizzaSelectedRow(e.data);

  }

  
  private onInitRow() {
    this.registri = [];
    this.registriTipo = [];
    this.showTagBox = true;
    this.isNewRow = true;
    this.dataSourceRegistri = this.getRegistri();
    this.dataSourceRegistriProcedimento = new DataSource({
      store: this.odataContextDefinition.getContext()[new RegistroTipoProcedimento().getName()],
      expand: [
        "idTipoProcedimento",
        "idRegistro"
      ]
    });
  }
  
  private onEditingStart() {
    this.registri = [];
    this.registriTipo = [];
    this.dataSourceRegistriProcedimento = new DataSource({
      store: this.odataContextDefinition.getContext()[new RegistroTipoProcedimento().getName()],
      expand: [
        "idTipoProcedimento",
        "idRegistro"
      ],
      filter: ["idTipoProcedimento.id", "=", this.tipoProcedimento.id]
    });
    this.dataSourceRegistriProcedimento.load().then(
      (res) => {
        for (let r of res) {
          this.registri.push(r.idRegistro);
        }
        this.registriTipo = res;
      }
    );
  }

  async gestisciPubblicazioni() {
    if (this.registri !== this.tagPubblicazione.value) {
      await this.processDelete(this.registriTipo);
      await this.processInsert(this.tagPubblicazione.value);
    }
    // console.log("Esco dalla gestisci pubblicazioni");
    this.showTagBox = false;  // Setto qui la variabile in modo che viene eseguita dopo tutte le operazioni
  }
  
  async processInsert(arrayRegistriFinale) {
    let utente = new Utente();
    utente.id = this.loggedUser.getField(bUtente.id);
    let regTipoProc: RegistroTipoProcedimento;
    for (const item of arrayRegistriFinale) {
      regTipoProc = new RegistroTipoProcedimento();
      regTipoProc.idRegistro = item;
      regTipoProc.idTipoProcedimento = this.tipoProcedimento;
      regTipoProc.idUtente = utente;
      // console.log("Inserisco -> ", item);
      await this.dataSourceRegistriProcedimento.store().insert(regTipoProc);
    }
  }
  
  async processDelete(arrayRegistriIniziale) {
    for (const item of arrayRegistriIniziale) {
      // console.log("Elimino -> ", item);
      await this.dataSourceRegistriProcedimento.store().remove(item.id);
    }
  }

  public handleEvent(name: String, event: any) {
   // console.log("EVENTO " + name, event);
    switch (name) {
      // Questo evento scatta al cliccare di qualsiasi cella: se però siamo sulla 5 colonna e si è cliccato un pulsante viene gestito
      case "CellClick":
        this.selectedRow = event.row;

        this.cellClick(event);

        // console.log("CellClick --> COMANDO = ", this.comando);

        if (event.columnIndex === 5 && this.comando != null)  // se ho cliccato sulla colonna Azioni potrei modificare o cancellare la riga
        { // a seconda del pulsante spinto viene editata o cancellata la riga.

          // console.log(event.columnIndex);

          switch (this.comando) {
            case "edita":
              this.modificaRiga(event.row);
              break;

            case "cancella":
              this.cancellaRiga(event.row);
              break;

            default:
              break;
          }
        }
        break;

      case "ButtonClick":
        // console.log("button click");

        // console.log(event);
        break;
      case "onContentReady":
        break;

      case "associaClicked":
        // console.log("entrato in associaClicked");
        this.router.navigate(["/associazione-aziende"]);
        this.comando = null;
        break;

      // Ho cliccato sul pulsante per modificare la riga: quindi faccio diventare il comando "edita"
      case "editClicked":
        this.comando = "edita";
        this.showTagBox = true;
        this.dataSourceRegistri = this.getRegistri();
        break;

      // Ho cliccato sul pulsante per modificare la riga: quindi faccio diventare il comando "cancella"
      case "deleteClicked":
        // console.log("entrato in deleteClicked");
        this.comando = "cancella";  // rimetto il comando a null così non c'è pericolo di fare cose sulla riga selezionata
        break;

      case "onEditorPreparing":
        if (event.dataField === "modoApertura") {
          event.editorName = "dxSelectBox";
          event.editorOptions.items = ["Ufficio", "Istanza"];
        }

        if (event.dataField === "descrizioneDefault") {
          event.editorName = "dxTextArea";
          event.editorOptions.height = "70px";
        }
        break;

      case "rowValidating":
          // console.log("onRowValidating")
          // let dataInizioValidita = new Date(this.selectedRow.data.dataInizioValidita);
          // let dataFineValidita = new Date(this.selectedRow.data.dataFineValidita);

          // let durataMassimaIter = (this.selectedRow.data.durataMassimaIter && this.selectedRow.data.durataMassimaIter > 0) ? true : false;
          // // console.log("Max iter: ", durataMassimaIter);
          // let durataMassimaSospensione = (this.selectedRow.data.durataMassimaSospensione && this.selectedRow.data.durataMassimaSospensione > 0) ? true : false;
          // // console.log(this.selectedRow.data.durataMassimaSospensione);
          // // console.log("Max durataMassimaSospensione: ", durataMassimaSospensione);
          //
          // if ((durataMassimaIter) && (durataMassimaSospensione)) {
          //     event.isValid = true;
          // } else {
          //     event.isValid = false;
          // }
      break;

      case "InitNewRow":
        event.data.obbligoEsitoConclusivo = false;
        event.data.richiedePrecedente = false;
        event.data.pubblicazioneRegistroAccessi = false;
        this.grid.editing.popup.title = "Aggiungi Nuovo Tipo Procedimento";
        this.onInitRow();
        break;
      
      case "RowUpdating":
        return;
      
      case "RowInserted":
        this.isNewRow = false;
        this.tipoProcedimento = event.data;
        this.tipoProcedimento.id = event.key;
        this.processInsert(this.tagPubblicazione.value).then(() => this.showTagBox = false);
        break;
      case "EditingStart":
        this.grid.editing.popup.title = "Modifica Tipo Procedimento";
        this.tipoProcedimento = event.data;
        this.onEditingStart();
        break;  

      default:
        break;
    }
  }

  ngOnInit() {
    // this.globalContext.setButtonBarVisible(false);
    this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
  }

  ngOnDestroy() {
    // console.log("destroy");
  }

  buildTipiProcedimento(res) {
    this.tipiProcedimento = res;
  }

  public onToolbarPreparing(e: any) {
    // console.log("onToolbarPreparing event!!!")
    let toolbarItems = e.toolbarOptions.items;

    toolbarItems.forEach(element => {
      if (element.name === "addRowButton") {
        element.options.hint = "Aggiungi";
        element.options.text = "Aggiungi";
        element.options.showText = "always";
      }
    });
  }

  public onCellPrepared(e: any) {

    if (e.rowType === "data" && e.column.command === "edit") {
      let isEditing = e.row.isEditing,
        $links = e.cellElement.find(".dx-link");
      $links.text("");
      $links.filter(".dx-link-edit").addClass("dx-icon-edit");
      $links.filter(".dx-link-delete").addClass("dx-icon-trash");
    }
  }

  public calculateDecimal(e: any) {
    console.log(e);
  }

  public calcolaSeAttiva(row: any) {

    // var utilityFunctions = new UtilityFunctions();

    let attivo: String;
    let daAttivare: boolean;
    let now = new Date();
    let today = now.getTime();

    if (row.dataInizioValidita == null)
      daAttivare = false;
    else if (row.dataInizioValidita > now)
      daAttivare = false;
    else if (row.dataFineValidita == null)
      daAttivare = true;
    else if (row.dataInizioValidita <= row.dataFineValidita && row.dataFineValidita >= now)
      daAttivare = true;
    else
      daAttivare = false;

    /*    if(utilityFunctions.isDataBiggerOrEqual(new Date(),coso.dataInizioValidita) && coso.dataInizioValidita!= null)
          attivo = "Sì";
        else
          attivo = "No";


        if((utilityFunctions.isDataBiggerOrEqual(coso.dataFineValidita, new Date()) || coso.dataFineValidita==null) && attivo=="Sì")
          attivo = "Sì";
        else
          attivo = "No";*/

    attivo = daAttivare ? "Sì" : "No";

    return attivo;
  }

  // validazione(event: any): boolean {
  //   let from = new Date(event.data["dataInizioValidita"]);
  //   let to = new Date(event.data["dataFineValidita"]);
  //   /* La data di fine non è obbligatoria, permetto quindi che sia nulla */
  //   if (event.data["dataFineValidita"] === null || from <= to) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // questa potrebbe essere riutilizzata
  onInputNumberBox(e: any) {
    let val = e.component._getInputVal();
    if (val.length > 4) {
      e.component._setInputText(val.slice(0, 4));
    }
  }

}
