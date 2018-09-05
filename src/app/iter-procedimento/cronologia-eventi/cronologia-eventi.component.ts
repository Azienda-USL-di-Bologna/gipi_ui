import { Component, OnInit, Input, SimpleChanges, ViewChild, Output, EventEmitter } from "@angular/core";
import { DxDataGridComponent, DxTooltipComponent } from "devextreme-angular";
import notify from "devextreme/ui/notify";
import { CUSTOM_RESOURCES_BASE_URL, TOAST_WIDTH, TOAST_POSITION, ESITI } from "environments/app.constants";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition } from "@bds/nt-context";
import { OdataContextFactory } from "@bds/nt-context";
import {EventoIter, Evento} from "@bds/nt-entities";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-cronologia-eventi",
  templateUrl: "./cronologia-eventi.component.html",
  styleUrls: ["./cronologia-eventi.component.scss"]
})
export class CronologiaEventiComponent implements OnInit {

  private odataContextDefinition: OdataContextDefinition;  
  public dataSourceEventoIter: DataSource;
  @ViewChild(DxTooltipComponent) tooltip: DxTooltipComponent;
  public oggettoDocumento: String = "";
  public classeDiHighlight = "";
  public popupVisible = false;
  public enablePopup = false;
  public nota: String;
  public possoCancellare: boolean;
  public arrayEventiIterCancellabili: Array<EventoIter> = [];

  // @Input("idIter") idIter: string;
  @Input("daPadre") daPadre: Object;
  @Input("possoCorreggereAssociazioni") canDelete: boolean;

  @Output() messageEvent: EventEmitter<any>= new EventEmitter();

  constructor(private odataContextFactory: OdataContextFactory, private http: HttpClient) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
  }

  ngOnInit() {
    this.arrayEventiIterCancellabili = [];
    this.dataSourceEventoIter = new DataSource({
      store: this.odataContextDefinition.getContext()[new EventoIter().getName()],
      expand: ["idEvento", "idIter", "idFaseIter.idFase", "autore.idPersona", "idDocumentoIter"],
      // tslint:disable-next-line:radix
      filter: ["idIter.id", "=", parseInt(this.daPadre["idIter"])],
      map: (item) => {
        if(item.idEvento.codice==="chiusura_sospensione" || (item.idDocumentoIter && item.idEvento.codice!="chiusura_iter" && item.idEvento.codice!="avvio_iter" && item.idEvento.codice!="modifica_iter"))
          this.arrayEventiIterCancellabili.push(item);
        item.canDelete = false;
        return item;
      }
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnChanges(changes: SimpleChanges) {
    if (this.dataSourceEventoIter !== undefined) {
      this.arrayEventiIterCancellabili = [];
      this.dataSourceEventoIter.load();
    }
    if (this.daPadre["classeCSS"] !== "") {
      this.classeDiHighlight = "cronologiaEventihightlightClass"; 
    }

    if(this.canDelete)
      this.possoCancellare = this.canDelete;
      
  }

  showNotes(noteValue) {
    this.enablePopup = true;
    this.popupVisible = true;
    this.nota = noteValue.value;
  }

  disablePopup() {
    this.enablePopup = false;
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

  onRowPrepared(e){
    // Qui dentro setto la variabile canDelete
    /* if(e.rowType=== "data" && e.rowIndex === this.dataSourceEventoIter.totalCount() - 1){
      let evento = e.data.idEvento;
      console.log("EVVAI!", evento)
      if(evento.codice !== "avvio_iter" && evento.codice !== "chiusura_iter" && evento.codice !== "modifica_iter")
        e.data.canDelete = true;
    }
    console.log(e.data) */
  }

  onCellPrepared(e) {
    let self = this;
    if (e.rowType === "data" && e.column.dataField === "idDocumentoIter") {
      if ((e.data.idEvento.codice === "avvio_iter" || e.data.idEvento.codice === "chiusura_iter") && this.classeDiHighlight !== "") {
        e.cellElement.classList.add(this.classeDiHighlight);
      }
      e.cellElement.onmouseover = function () {
        if (e.row.data && e.row.data.idDocumentoIter && e.row.data.idDocumentoIter.oggetto) {
          self.tooltip.instance.option("target", e.cellElement);
          self.oggettoDocumento = e.row.data.idDocumentoIter.oggetto;
          self.tooltip.instance.show();
        }
      };
      e.cellElement.onmouseout = function () {
        self.tooltip.instance.hide();
      };
    }
    else if (e.rowType === "data" && e.column.dataField === "canDelete"){
        if(e.rowIndex > 0){
          if(e.data.idEvento.codice !== "avvio_iter" && e.data.idEvento.codice !== "chiusura_iter" && e.data.idEvento.codice !== "modifica_iter"){
            if(this.arrayEventiIterCancellabili.lastIndexOf(e.data) == this.arrayEventiIterCancellabili.length - 1)
              e.data.canDelete = true;
          }
        }
    }
  }


  cancellaEvento(e: any){
    console.log("cancellaEvento(e: any) > ", e)
    let idEventoIter = +e.data.id
    const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "iter/rollbackEventoIterById", idEventoIter, { headers: new HttpHeaders().set("content-type", "application/json") })
          .subscribe(
          res => {
            console.log(res);
            notify({
              message: "Cancellazione dell'operazione avvenuta con successo",
              type: "success",
              displayTime: 4000,
              position: TOAST_POSITION,
              width: TOAST_WIDTH
            });
            this.messageEvent.emit({cancellatoDocIter: true});
            // this.dataSourceEventoIter.load();
          },
          err => {
            console.log(err);
            notify({
              message: "Attenzione: errore nella cancellazione dell'operazione: contattare BabelCare",
              type: "error",
              displayTime: 4000,
              position: TOAST_POSITION,
              width: TOAST_WIDTH
            });
            this.messageEvent.emit({cancellatoDocIter: false});
            this.dataSourceEventoIter.load();
          }
      );
  }
  
}
