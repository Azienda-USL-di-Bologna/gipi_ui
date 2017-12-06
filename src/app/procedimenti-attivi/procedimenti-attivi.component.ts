import { Component, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxFormComponent } from "devextreme-angular";
import DataSource from "devextreme/data/data_source";
import { OdataContextFactory } from "@bds/nt-angular-context/odata-context-factory";
import { Entities } from "environments/app.constants";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";

@Component({
  selector: "procedimenti-attivi",
  templateUrl: "./procedimenti-attivi.component.html",
  styleUrls: ["./procedimenti-attivi.component.css"]
})
export class ProcedimentiAttiviComponent {

  @ViewChild("gridContainer") gridContainer: DxDataGridComponent;

  private odataContextDefinition: OdataContextDefinition;
  private rigaSelezionata: any;

  public idAzienda: number = 5;
  public descrizioneAzienda: string = "Azienda USL Parma";
  public dataSourceProcedimenti: DataSource;
  public popupButtons: any[];
  public popupNuovoIterVisible: boolean = false;
  public procedimentoDaPassare: object;

  constructor(private odataContextFactory: OdataContextFactory) {
    const now = new Date();

    this.odataContextDefinition = odataContextFactory.buildOdataContextEntitiesDefinition();
    this.dataSourceProcedimenti = new DataSource({
      store: this.odataContextDefinition.getContext()[Entities.Procedimento.name],
      expand: [
        "idStruttura",
        "idTitolarePotereSostitutivo",
        "idAziendaTipoProcedimento/idTitolo",
        "idAziendaTipoProcedimento/idTipoProcedimento"
      ],
      filter: [
        ["idAziendaTipoProcedimento.FK_id_azienda", "=", this.idAzienda],
        ["dataInizio", "<=", now],
        [
          ["dataFine", ">", now],
          "or",
          ["dataFine", "=", null]
        ]
      ]
    });

    this.itemClear = this.itemClear.bind(this);
    this.setFormLook();
  }

  // Definisco l'aspetto della pagina
  setFormLook() {
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
    }]
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
            value.toLowerCase()]
        } else {
          return defaultCalculateFilterExpression.apply(this, arguments);
        }
      }
    });
  }

  private apriDettaglio(row: any) {
    this.gridContainer.instance.editRow(row.rowIndex);
  }

  public handleEvent(name: String, e: any) {
    switch (name) {
      case "infoOnClick":
        this.rigaSelezionata = e.row;
        this.apriDettaglio(e.row);
      break
      case "iterOnClick":
        this.popupNuovoIterVisible = true;
        console.log(e);
        this.procedimentoDaPassare = [{
          id: e.row.data.idProcedimento,
          nome: e.row.data.idAziendaTipoProcedimento.idTipoProcedimento.nomeTipoProcedimento
        }];
      break
    }
  }
}