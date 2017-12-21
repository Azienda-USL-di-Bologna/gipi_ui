import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
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

   @Input("daPadre") daPadre: Object;
  
  constructor(private odataContextFactory: OdataContextFactory) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
  }

  ngOnInit() {
    this.dataSourceDocumentiIter = new DataSource({
      store: this.odataContextDefinition.getContext()[Entities.DocumentoIter.name],
      expand: ["eventoIterList/idEvento"],
      filter: ['FK_id_iter', '=', parseInt(this.daPadre['idIter'])]
    });
   }

     ngOnChanges(changes: SimpleChanges) {
    if (this.dataSourceDocumentiIter != undefined) {
      //debugger;
      this.dataSourceDocumentiIter.load();
    }

  }
}
