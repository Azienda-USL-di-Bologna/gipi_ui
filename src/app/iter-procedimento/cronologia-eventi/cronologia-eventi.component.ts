import { Component, OnInit, Input, SimpleChanges } from "@angular/core";
import { DxDataGridComponent } from "devextreme-angular";
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

  // @Input("idIter") idIter: string;
  @Input("daPadre") daPadre: Object;

  constructor(private odataContextFactory: OdataContextFactory) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
  }

  ngOnInit() {
    this.dataSourceEventoIter = new DataSource({
      store: this.odataContextDefinition.getContext()[new EventoIter().getName()],
      expand: ["idEvento", "idIter", "idFaseIter.idFase", "autore.idPersona"],
      filter: ["idIter.id", "=", parseInt(this.daPadre["idIter"])]
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.dataSourceEventoIter !== undefined) {
      this.dataSourceEventoIter.load();
    }
  }
}
