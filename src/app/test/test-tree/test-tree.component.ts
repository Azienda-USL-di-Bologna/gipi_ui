import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";
import {Struttura} from "../../classi/server-objects/entities/struttura";
import DataSource from "devextreme/data/data_source";
import ODataStore from "devextreme/data/odata/store";
import {OdataContextFactory} from "@bds/nt-angular-context";
import { FunctionsImport } from "../../../environments/app.constants";
import {HttpClient} from "@angular/common/http";
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-test-tree',
  templateUrl: './test-tree.component.html',
  styleUrls: ['./test-tree.component.scss']
})
export class TestTreeComponent implements OnInit {

  public datasource: DataSource;
  private odataContextDefinition;
  @ViewChild("treeViewChild") treeViewChild: any;

  constructor(private http: HttpClient, private odataContextFactory: OdataContextFactory) {

    this.odataContextDefinition = odataContextFactory.buildOdataFunctionsImportDefinition();
  }

  
  ngOnInit() {
    
    this.datasource = new DataSource({
      store: this.odataContextDefinition.getContext()[FunctionsImport.GetStruttureByTipoProcedimento.name],
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
    
export const NodeOperations  = {INSERT: "INSERT", DELETE: "DELETE"}