import { Component, OnInit } from "@angular/core";
import {Iter} from "@bds/nt-entities";
import DataSource from "devextreme/data/data_source";
import {OdataContextEntitiesDefinition, OdataContextFactory} from "@bds/nt-context";
import {PersistenceContextStore} from "../persistence-context/persistence-context-store";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: "app-test-grid",
  templateUrl: "./test-grid.component.html",
  styleUrls: ["./test-grid.component.scss"]
})
export class TestGridComponent implements OnInit {
  private odataContextDefinition: OdataContextEntitiesDefinition;
  public dataSource: DataSource;

  constructor(private odataContextFactory: OdataContextFactory, private httpClient: HttpClient) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
  }

  ngOnInit() {

      this.dataSource = new DataSource({
          store: this.odataContextDefinition.getContext()[new Iter().getName()],
          expand: ["idResponsabileProcedimento.idPersona"],
      });
  }

  public handleEvent(name: String, event: any) {
    // console.log("EVENTO "+name, event);
    switch (name) {
      case "RowUpdating":
        console.log(event);
        event.cancel = true;
        new PersistenceContextStore(new Iter().getName(), "http://localhost:10006/gipi-api/resources/sdr", this.httpClient).update(event.key, event.newData);
    }
  }
}
