import { Component, OnInit } from '@angular/core';
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import { OdataContextFactory } from "@bds/nt-angular-context/odata-context-factory";
import { Entities } from "environments/app.constants";

@Component({
  selector: 'app-lista-iter',
  templateUrl: './lista-iter.component.html',
  styleUrls: ['./lista-iter.component.scss']
})
export class ListaIterComponent implements OnInit {

  public dataSource: DataSource;
  private odataContextDefinition: OdataContextDefinition;

  constructor(private odataContextFactory: OdataContextFactory) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
  }

  ngOnInit() {
    this.dataSource = new DataSource({
      store: this.odataContextDefinition.getContext()[Entities.Iter.name],
      expand: ["idResponsabileProcedimento"],
    })
  }

}
