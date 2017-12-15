import {Component, Input, OnDestroy, OnInit, ViewChild,} from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { DxDataGridComponent } from "devextreme-angular";
import { DefinizioneTipiProcedimentoService } from "./definizione-tipi-procedimento.service";
import {TipoProcedimento} from "../classi/server-objects/entities/tipo-procedimento";
import {OdataContextDefinition} from "@bds/nt-angular-context/odata-context-definition";
import {Entities} from "../../environments/app.constants";
import {OdataContextFactory} from "@bds/nt-angular-context/odata-context-factory";
import {ActivatedRoute, Router} from "@angular/router";
import {GlobalContextService} from "@bds/nt-angular-context/global-context.service";
import {Blocco} from "../buttons-bar/buttons-bar.component";
import {ButtonAppearance} from "../classi/client-objects/ButtonAppearance";
// import { UtilityFunctions } from '../utility-functions';


@Component({
  selector: "app-definizione-tipi-procedimento",
  templateUrl: "./definizione-tipi-procedimento.component.html",
  styleUrls: ["./definizione-tipi-procedimento.component.css"]
})
export class DefinizioneTipiProcedimentoComponent implements OnInit, OnDestroy{

  @ViewChild("grid") grid: DxDataGridComponent;
  @Input("refreshButton") resfreshButton;

  public dataSource: DataSource;
  private odataContextDefinition: OdataContextDefinition;
  public tipiProcedimento: TipoProcedimento[] = new Array<TipoProcedimento>();
  public texts: Object= {
    editRow: "Modifica",
    deleteRow: "Elimina",
    saveRowChanges: "Salva",
    cancelRowChanges: "Annulla",
    confirmDeleteMessage: "Stai per cancellare il tipo di procedimento: procedere?"
  };

  public backBtn: ButtonAppearance;
  public saveBtn: ButtonAppearance;
  public reloadBtn: ButtonAppearance;
  public restoreBtn: ButtonAppearance;

  constructor(private odataContexFactory: OdataContextFactory,
              private service: DefinizioneTipiProcedimentoService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private globalContextService: GlobalContextService) {

    this.backBtn = new ButtonAppearance("indietro", "back", true);
    this.saveBtn = new ButtonAppearance("salva", "save", true);
    this.reloadBtn = new ButtonAppearance("refresh", "refresh", true);
    this.restoreBtn = new ButtonAppearance("ripristina", "revert", true);


    // this.sharedData.setSharedObject({route: "definizione-tipi-procedimento"});

    this.odataContextDefinition = odataContexFactory.buildOdataContextEntitiesDefinition();
    this.dataSource = new DataSource({
      store: this.odataContextDefinition.getContext()[Entities.TipoProcedimento.name],


/*      map: function (item) {
        if (item.dataInizioValidita != null)
          item.dataInizioValidita = new Date(item.dataInizioValidita.getTime() - new Date().getTimezoneOffset() * 60000);
        if (item.dataFineValidita != null)
          item.dataFineValidita = new Date(item.dataFineValidita.getTime() - new Date().getTimezoneOffset() * 60000);

        //console.log('item', item);
        return item;
      }*/
    });
    this.dataSource.load().then(res => this.buildTipiProcedimento(res));


    // debugger;
    // console.log(this.dataSource);

  }

  public manageCommand(e){
    console.log("evento: ", e);
  }

  public onReload(){
    console.log("event: onReload");
  }

  public onSave(){
    console.log("event: onSave");
  }

  public onRestore(){
    console.log("event: onRestore");
  }

  public onBack(){
    console.log("event: onBack");
  }

  ngOnInit() {
    // this.globalContext.setButtonBarVisible(false);
  }

  ngOnDestroy() {
    // console.log("destroy");
  }

  private loggaContesto(e: Object){
    // console.log(e);

  }

  buildTipiProcedimento(res) {
    this.tipiProcedimento = res;
  }

  // questa proprietà serve per capire che pulsante è stato cliccato
  private comando: any;

  public handleEvent(name: String, event: any) {
    // console.log("EVENTO "+name, event);
    switch (name){
      // Questo evento scatta al cliccare di qualsiasi cella: se però siamo sulla 5 colonna e si è cliccato un pulsante viene gestito
      case "CellClick":
        this.cellClick(event);
        // console.log("CellClick --> COMANDO = ", this.comando);

        if (event.columnIndex === 5 && this.comando != null)  // se ho cliccato sulla colonna Azioni potrei modificare o cancellare la riga
        { // a seconda del pulsante spinto viene editata o cancellata la riga.

          // console.log(event.columnIndex);

          switch (this.comando){
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

      case "associaClicked":
        // console.log("entrato in associaClicked");
        this.comando = null;
        break;

      // Ho cliccato sul pulsante per modificare la riga: quindi faccio diventare il comando "edita"
      case "editClicked":
        this.comando = "edita";
        break;

      // Ho cliccato sul pulsante per modificare la riga: quindi faccio diventare il comando "cancella"
      case "deleteClicked":
        // console.log("entrato in deleteClicked");
        this.comando = "cancella";  // rimetto il comando a null così non c'è pericolo di fare cose sulla riga selezionata
        break;

      default:
        break;
    }

  }


  // cancello la riga passata come parametro
  private cancellaRiga(row: any){
    // prendo l'indice della riga selezionata e
    // console.log("FUNZIONE CANCELLARIGA");
    // console.log(row.rowIndex);
    this.grid.instance.deleteRow(row.rowIndex);
    this.comando = null; // rimetto il comando a null così non c'è pericolo di fare cose sulla riga selezionata
  }

  // modifico la riga passata come parametro
  private modificaRiga(row: any){
    // console.log("FUNZIONE MODIFICARIGA");
    // console.log(row.rowIndex);
    this.grid.instance.editRow(row.rowIndex);
    this.comando = null; // rimetto il comando a null così non c'è pericolo di fare cose sulla riga selezionata
  }


  private cellClick(e: any){
    this.service.valorizzaSelectedRow(e.data);

  }

  public onToolbarPreparing(e: any){
    // console.log("onToolbarPreparing event!!!")
    let toolbarItems = e.toolbarOptions.items;

    toolbarItems.forEach(element => {
      if (element.name === "addRowButton")
      {
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

  public filterOperationDescriptions: Object = {"contains": "contiene", "notContains": "non contiene", "equal": "uguale", "notEqual": "diverso",
    "startsWith": "comincia con",  "endsWith": "finisce con", "between": "compreso tra", "greaterThan": "maggiore di",
    "greaterThanOrEqual": "maggiore o uguale a", "lessThan": "minore di", "lessThanOrEqual": "minore o uguale a" };


  public calcolaSeAttiva(row: any) {
    // console.log(coso);
    // debugger;

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

    // debugger;


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


}
