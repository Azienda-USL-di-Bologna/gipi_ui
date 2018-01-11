import { Component, OnInit } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import { OdataContextFactory } from "@bds/nt-angular-context/odata-context-factory";
import { Entities } from "environments/app.constants";
import { Router } from "@angular/router";

@Component({
  selector: "app-lista-iter",
  templateUrl: "./lista-iter.component.html",
  styleUrls: ["./lista-iter.component.scss"]
})
export class ListaIterComponent implements OnInit {

  private odataContextDefinition: OdataContextDefinition;
  public dataSource: DataSource;
  public infoGeneriche: any = {
    azienda: "AOSP-BO",
    struttura: "UO DaTer",
    procedimento: "Procedimento A"
  };

  constructor(private odataContextFactory: OdataContextFactory, private router: Router) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
  }

  ngOnInit() {
    this.dataSource = new DataSource({
      store: this.odataContextDefinition.getContext()[Entities.Iter.name],
      expand: ["idResponsabileProcedimento.idPersona"],
    });
  }

  vaiAlDettaglio(e) {
    this.router.navigate(["/iter-procedimento"], { queryParams: { idIter: e.data.id } });
  }

}
