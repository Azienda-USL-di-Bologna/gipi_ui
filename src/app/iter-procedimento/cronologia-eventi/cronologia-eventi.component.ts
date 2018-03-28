import { Component, OnInit, Input, SimpleChanges, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxTooltipComponent } from "devextreme-angular";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition } from "@bds/nt-context";
import { OdataContextFactory } from "@bds/nt-context";
import {EventoIter} from "@bds/nt-entities";

@Component({
  selector: "app-cronologia-eventi",
  templateUrl: "./cronologia-eventi.component.html",
  styleUrls: ["./cronologia-eventi.component.scss"]
})
export class CronologiaEventiComponent implements OnInit {

  private odataContextDefinition: OdataContextDefinition;  
  public dataSourceEventoIter: DataSource;
  @ViewChild(DxTooltipComponent) tooltip: DxTooltipComponent;
  public oggettoDocumento: string = "";

  // @Input("idIter") idIter: string;
  @Input("daPadre") daPadre: Object;

  constructor(private odataContextFactory: OdataContextFactory) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
  }

  ngOnInit() {
    this.dataSourceEventoIter = new DataSource({
      store: this.odataContextDefinition.getContext()[new EventoIter().getName()],
      expand: ["idEvento", "idIter", "idFaseIter.idFase", "autore.idPersona", "idDocumentoIter"],
      filter: ["idIter.id", "=", parseInt(this.daPadre["idIter"])]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.dataSourceEventoIter !== undefined) {
      this.dataSourceEventoIter.load();
    }
  }

  customizeColumns(columns: any) {
    columns.forEach(column => {
        if (column.dataField === "idDocumentoIter") {
            column.calculateCellValue = function (value) {
                if (value && value.idDocumentoIter) {
                    return value.idDocumentoIter.registro + " " + value.idDocumentoIter.numeroRegistro + "/" + value.idDocumentoIter.anno;
                }
            };                
        }
    });
  }

  onCellPrepared(e) {
    let self = this;

    if (e.rowType === "data" && e.column.dataField === "idDocumentoIter") {
      e.cellElement.onmouseover = function () {
        self.tooltip.instance.option("target", e.cellElement);
        self.oggettoDocumento = e.row.data.idDocumentoIter.oggetto;
        self.tooltip.instance.show();
      };
      e.cellElement.onmouseout = function () {
        self.tooltip.instance.hide();
      };
    }  
  }
}
