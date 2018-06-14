import { Component, OnInit, Input, SimpleChanges, ViewChild } from "@angular/core";
import { DxDataGridComponent, DxTooltipComponent } from "devextreme-angular";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition } from "@bds/nt-context";
import { OdataContextFactory } from "@bds/nt-context";
import {EventoIter, Evento} from "@bds/nt-entities";

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
  public classeDiHighlight = "";

  // @Input("idIter") idIter: string;
  @Input("daPadre") daPadre: Object;

  constructor(private odataContextFactory: OdataContextFactory) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
  }

  ngOnInit() {
    this.dataSourceEventoIter = new DataSource({
      store: this.odataContextDefinition.getContext()[new EventoIter().getName()],
      expand: ["idEvento", "idIter", "idFaseIter.idFase", "autore.idPersona", "idDocumentoIter"],
      // tslint:disable-next-line:radix
      filter: ["idIter.id", "=", parseInt(this.daPadre["idIter"])]
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges) {
    if (this.dataSourceEventoIter !== undefined) {
      this.dataSourceEventoIter.load();
    }
    if (this.daPadre["classeCSS"] !== "") {
      this.classeDiHighlight = "cronologiaEventihightlightClass"; 
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
      if ((e.data.idEvento.codice === "avvio_iter" || e.data.idEvento.codice === "chiusura_iter") && this.classeDiHighlight !== "") {
        e.cellElement.classList.add(this.classeDiHighlight);
      }
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
