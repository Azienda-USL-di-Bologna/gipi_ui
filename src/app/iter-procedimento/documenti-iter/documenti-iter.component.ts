import { Component, Input, OnInit, SimpleChanges } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import { OdataContextDefinition } from "@bds/nt-context";
import { OdataContextFactory } from "@bds/nt-context";
import {DocumentoIter} from "@bds/nt-entities";

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
    console.log("DOCUMENTI-ITER.NGONINIT", this.daPadre);
    this.dataSourceDocumentiIter = new DataSource({
      store: this.odataContextDefinition.getContext()[new DocumentoIter().getName()],
      expand: ["eventoIterList/idEvento"],
      filter: [["idIter.id", "=", parseInt(this.daPadre["idIter"])], ["parziale", "=", false]]
    });
   }

  ngOnChanges(changes: SimpleChanges) {
    if (this.dataSourceDocumentiIter !== undefined) {
      this.dataSourceDocumentiIter.load();
    }
  }
}
