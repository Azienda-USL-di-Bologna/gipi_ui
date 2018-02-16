import { Component, ViewChild, Input, Output, EventEmitter } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import DataSource from "devextreme/data/data_source";
import { OdataContextFactory } from "@bds/nt-angular-context/odata-context-factory";
import { Entities } from "environments/app.constants";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import {Router} from "@angular/router";
import { LoggedUser } from "../authorization/logged-user";
import { GlobalContextService } from "@bds/nt-angular-context";
import { UtilityFunctions } from "app/utility-functions";
import { forEach } from "@angular/router/src/utils/collection";

@Component({
  selector: "procedimenti-attivi",
  templateUrl: "./procedimenti-attivi.component.html",
  styleUrls: ["./procedimenti-attivi.component.scss"]
})
export class ProcedimentiAttiviComponent {

  private odataContextDefinition: OdataContextDefinition;
  private rigaSelezionata: any;
  private utility: UtilityFunctions = new UtilityFunctions();
  
  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;
  public idAzienda: number;
  public dataSourceProcedimenti: DataSource;
  public popupButtons: any[];
  public popupNuovoIterVisible: boolean = false;
  public procedimentoDaPassare: any;
  public iterAvviato: boolean = false;
  public idIterAvviato: number;
  public daDocumento: boolean = false;
  public enableSelection: string = "none";
  public colonnaVisibile: boolean = true;
  public showTitle: boolean = true ;

  @Input()
  set avviaIterDaDocumento(daDocumento: any) {
    this.daDocumento = daDocumento;
    this.setDataAvviaIterDaDocumento();
    this.setFormLookAvviaIterDaDocumento();
  }

  @Output("messageEvent") messageEvent = new EventEmitter<any>();

  public loggedUser: LoggedUser;

  constructor(private odataContextFactory: OdataContextFactory, 
              public router: Router,
              private globalContextService: GlobalContextService) {

    this.loggedUser = this.globalContextService.getInnerSharedObject("loggedUser");
    this.idAzienda = this.loggedUser.aziendaLogin.id;

   // this.idAzienda = JSON.parse(sessionStorage.getItem("userInfoMap")).aziende.id;
    const now = new Date();

    this.odataContextDefinition = odataContextFactory.buildOdataContextEntitiesDefinition();
    this.dataSourceProcedimenti = new DataSource({
      store: this.odataContextDefinition.getContext()[Entities.Procedimento.name],
      expand: [
        "idStruttura",
        "idTitolarePotereSostitutivo/idPersona",
        "idAziendaTipoProcedimento/idTitolo",
        "idAziendaTipoProcedimento/idTipoProcedimento"
      ],
      filter: [
        ["idAziendaTipoProcedimento.idAzienda.id", "=", this.idAzienda],
        ["dataInizio", "<=", now],
        [
          ["dataFine", ">", now],
          "or",
          ["dataFine", "=", null]
        ]
      ]
    });

    this.itemClear = this.itemClear.bind(this);
    this.setFormLookBase();
  }

  private setDataAvviaIterDaDocumento() {
    // Devo aggiungere il filtro sulle strutture dell'utente
    // Prima mi creo l'array con gli id struttura
    let idStrutture: any = [];
    console.log(this.loggedUser);
    this.loggedUser.struttureAfferenzaDiretta.forEach(function(struttura: any) {
      console.log(struttura);

      idStrutture.push(struttura.ID);
    });
    if (this.loggedUser.struttureAfferenzaFunzionale != null) {
      this.loggedUser.struttureAfferenzaFunzionale.forEach(function(struttura: any) {
        idStrutture.push(struttura.ID);
      });
    }
    // Ora mi creo l'array-filtro e filtro
    this.dataSourceProcedimenti.filter(this.utility.buildMultipleFilterForArray("idStruttura.id", idStrutture));
    
    console.log(this.loggedUser);
  }

  private setFormLookAvviaIterDaDocumento() {
    this.enableSelection = "single";
    this.colonnaVisibile = false;
    this.showTitle = false;
  }
  
  private apriDettaglio(row: any) {
    this.gridContainer.instance.editRow(row.rowIndex);
  }

  // Definisco l'aspetto della pagina
  private setFormLookBase() {
    this.popupButtons = [{
      toolbar: "bottom",
      location: "center",
      widget: "dxButton",
      options: {
          type: "normal",
          text: "Chiudi",
          onClick: () => {
              this.gridContainer.instance.cancelEditData();
          }
      }
    }];
  }

  

  // Gestisco la toolbar di ricerca. La voglio centrale.
  onToolbarPreparing(e) {
    const toolbarItems = e.toolbarOptions.items;
    const searchPanel = toolbarItems.filter(item => item.name === "searchPanel");

    if (searchPanel && searchPanel[0]) {
      searchPanel[0].location = "center";
    }
  }

  // Calcolo la Width dei widget in base alla grandezza della finestra del browser.
  calcWidth(divisore: number, responsive = false): any {
    if (responsive && window.innerWidth < 1280)
      return "90%";
    return window.innerWidth / divisore;
  }

  // Creo un template per item "puri"
  itemClear(data, itemElement): string {
    const rowData = this.gridContainer.instance.getDataSource().items()[this.rigaSelezionata.rowIndex];
    return data.dataField.split(".").reduce((o, i) => o[i], rowData); // Devo parsare il dataField per entrare in profondità nell'oggetto
  }

  // Aggiungo l'ignore case per tutte le colonne non lookup
  customizeColumns(columns: any) {
    columns.forEach(column => {
      const defaultCalculateFilterExpression = column.calculateFilterExpression;
      column.calculateFilterExpression = function(value, selectedFilterOperation) {
        if (this.dataType === "string" && !this.lookup && value) {
          return ["tolower(" + this.dataField + ")",
            selectedFilterOperation || "contains",
            value.toLowerCase()];
        } else {
          return defaultCalculateFilterExpression.apply(this, arguments);
        }
      };
    });
  }

  public receiveMessage(event: any) {
    this.iterAvviato = !!event.idIter;
    if (this.iterAvviato) {
      this.idIterAvviato = event.idIter;
    }
    this.popupNuovoIterVisible = event.visible;   
  }

  public popupHidden() {
    this.popupNuovoIterVisible = false; // Settaggio necessario in caso il popup venga chiuso tramite la X
    if (this.iterAvviato) {
      this.iterAvviato = false;
      this.router.navigate(["iter-procedimento"], {queryParams: {idIter: this.idIterAvviato}});
    }
  }

  public handleEvent(name: String, e: any) {
    switch (name) {
      case "infoOnClick":
        this.rigaSelezionata = e.row;
        this.apriDettaglio(e.row);
      break;
      case "iterOnClick":
        this.popupNuovoIterVisible = true;
        this.procedimentoDaPassare = {
          /* idAzienda: this.idAzienda,
          idProcedimento: e.row.data.id,
          nomeProcedimento: e.row.data.idAziendaTipoProcedimento.idTipoProcedimento.nome */
          procedimento: e.row.data
        };
      break;
      case "onSelectionChanged":
        this.messageEvent.emit({ row: e});
      break;
    }
  }
}
