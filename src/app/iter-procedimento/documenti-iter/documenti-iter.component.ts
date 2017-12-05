import { Component, Input, OnInit } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import { Entities } from "environments/app.constants";
import { OdataContextFactory } from "@bds/nt-angular-context";

@Component({
  selector: "documenti-iter",
  templateUrl: "./documenti-iter.component.html",
  styleUrls: ["./documenti-iter.component.scss"]
})
export class DocumentiIterComponent {

  private odataContextDefinition: OdataContextDefinition;
  public dataSourceDocumentiIter: DataSource;

   @Input("idIter") idIter: string;
  
  constructor(private odataContextFactory: OdataContextFactory) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
  }

  ngOnInit() {
    this.dataSourceDocumentiIter = new DataSource({
      store: this.odataContextDefinition.getContext()[Entities.DocumentoIter.name],
      expand: ["eventoIterList/idEvento"],
      filter: ['FK_id_iter', '=', parseInt(this.idIter)]
    });
   }
}
