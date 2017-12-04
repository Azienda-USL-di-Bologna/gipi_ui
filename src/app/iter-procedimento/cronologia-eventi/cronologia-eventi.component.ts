import { Component, OnInit } from '@angular/core';
import { DxDataGridComponent } from "devextreme-angular";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import { OdataContextFactory } from "@bds/nt-angular-context/odata-context-factory";
import { Entities } from "environments/app.constants";

@Component({
  selector: 'app-cronologia-eventi',
  templateUrl: './cronologia-eventi.component.html',
  styleUrls: ['./cronologia-eventi.component.scss']
})
export class CronologiaEventiComponent implements OnInit {

  public dataSourceEventoIter: DataSource;
  private odataContextDefinition: OdataContextDefinition;

  constructor(private odataContextFactory: OdataContextFactory) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
    this.dataSourceEventoIter = new DataSource({
      store: this.odataContextDefinition.getContext()[Entities.EventoIter.name],
      expand: ["idEvento", "idIter" , "idFaseIter.idFase"],
    //  qui va aggiunto il filtro in base all'iter
    })
  }

  ngOnInit() {
  }
}
