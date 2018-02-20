import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from "@angular/core";
import {Struttura} from "../../classi/server-objects/entities/struttura";
import DataSource from "devextreme/data/data_source";
import ODataStore from "devextreme/data/odata/store";
import {OdataContextFactory} from "@bds/nt-angular-context";
import {CUSTOM_RESOURCES_BASE_URL, FunctionsImport} from "../../../environments/app.constants";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-test-tree',
  templateUrl: './test-tree.component.html',
  styleUrls: ['./test-tree.component.scss']
})
export class TestTreeComponent implements OnInit {

  private odataContextDefinition;
  public paramsDaPassare = new ParamsAvviaIter();
  public datasource: DataSource;
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

  avviaIter(data: any) {
      console.log(this.paramsDaPassare);
      this.paramsDaPassare.numeroDocumento = this.padLeft(this.paramsDaPassare.numeroDocumento, "0", 7);
      console.log(this.paramsDaPassare.numeroDocumento);
      const req = this.http.post(CUSTOM_RESOURCES_BASE_URL + "tests/testWebApi", this.paramsDaPassare, {headers: new HttpHeaders().set("content-type", "application/json")}) // Object.assign({}, this.iterParams))
          .subscribe(
              res => {
                  console.log("RES = ", res);
              },
              err => {
                  console.log("L'avvio del nuovo iter è fallito. Contattare Babelcare: ", err);
              }
          );
  }

  padLeft(text: string, padChar: string, size: number): string {
        return (String(padChar).repeat(size) + text).substr( (size * -1), size) ;
    }


}



class ParamsAvviaIter {
  public idIter: number;
  public cfResponsabileProcedimento: string;
  public numeroDocumento: string;
  public annoDocumento: number;
  public codiceRegistroDocumento: string;
  public annoIter: number;
  public nomeProcedimento: string;
}
    
export const NodeOperations  = {INSERT: "INSERT", DELETE: "DELETE"}