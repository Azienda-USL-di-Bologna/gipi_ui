import { Component, OnInit, ViewChild } from "@angular/core";
import DataSource from "devextreme/data/data_source";
import {OdataContextFactory} from "@bds/nt-context";
import {HttpClient} from "@angular/common/http";
import {GetStruttureByTipoProcedimento} from "@bds/nt-entities";


@Component({
  selector: "app-test-tree",
  templateUrl: "./test-tree.component.html",
  styleUrls: ["./test-tree.component.scss"]
})
export class TestTreeComponent implements OnInit {

  private odataContextDefinition;
  public datasource: DataSource;
  
  @ViewChild("treeViewChild") treeViewChild: any;

  constructor(private http: HttpClient, private odataContextFactory: OdataContextFactory) {

    this.odataContextDefinition = odataContextFactory.buildOdataFunctionsImportDefinition();
  }

  
  ngOnInit() {
    
    this.datasource = new DataSource({
      store: this.odataContextDefinition.getContext()[new GetStruttureByTipoProcedimento().getName()],
      customQueryParams: {
        idAziendaTipoProcedimento: 33,
        idAzienda: 5
      }
    }); 

  }

  click(e) {
    console.log(this.treeViewChild.instance.selectItem(3693));
   }
 

} 
    
export const NodeOperations  = {INSERT: "INSERT", DELETE: "DELETE"};