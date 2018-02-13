import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import DataSource from "devextreme/data/data_source";
import CustomStore from "devextreme/data/custom_store";
import { OdataContextDefinition } from "@bds/nt-angular-context/odata-context-definition";
import { GlobalContextService, OdataContextFactory } from "@bds/nt-angular-context";
import { Entities, CUSTOM_RESOURCES_BASE_URL } from "environments/app.constants";
import { HttpClient } from "@angular/common/http";
import { Subscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Observable";
import { LoggedUser } from "../../authorization/logged-user";

@Component({
  selector: 'app-lista-iter-con-permessi',
  templateUrl: './lista-iter-con-permessi.component.html',
  styleUrls: ['./lista-iter-con-permessi.component.scss']
})
export class ListaIterConPermessiComponent implements OnInit {

  private odataContextDefinition: OdataContextDefinition;
  public dataSource: DataSource;
  public customStore: CustomStore;
  public listaItems: any;

  private subscriptions: Subscription[] = [];
  public loggedUser$: Observable<LoggedUser>;
  public userInfo: LoggedUser;


  @Input() cfUtente : string;
  @Output() selectedRow : EventEmitter<any> = new EventEmitter();

  constructor(private odataContextFactory: OdataContextFactory, 
    private http: HttpClient,
    private globalContextService: GlobalContextService) {
    this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
  }

  ngOnInit() {
    // this.dataSource = new DataSource({
    //   store: this.odataContextDefinition.getContext()[Entities.Iter.name],
    //   expand: ["idResponsabileProcedimento.idPersona"],
    // });
///////////////////////////////
    // const req = this.http.get(CUSTOM_RESOURCES_BASE_URL + "iter/getProcessStatus" + "?cf=" + this.cfUtente) // qui manca l'azienda
    // .subscribe(
    // res => {
    //   let current = JSON.parse(res["currentFase"]);
    //   let next = JSON.parse(res["nextFase"]);

    //   this.perFiglioPassaggioFase = {
    //     idIter: this.idIter,
    //     currentFaseName: current.nomeFase,
    //     nextFaseName: next.nomeFase,
    //     isNextFaseDiChiusura: next.faseDiChiusura
    //   };

    //   this.popupData.title = "Passaggio Di Fase";
    //   this.passaggioDiFaseVisible = true;
    // },
    // err => {
    //   notify("Non esiste la fase successiva", "error", 1000);
    // });
    /////////////////////////////////////////////
    // this.loggedUser$ = this.globalContextService.getSubjectInnerSharedObject("loggedUser");
    // this.subscriptions.push(
    //     this.loggedUser$.subscribe(
    //         (loggedUser: LoggedUser) => {
    //             if (loggedUser) {
    //                 this.userInfo = loggedUser;
    //             }
    //         }
    //     )
    // );

    // this.customStore = new CustomStore({
    //   load: function() {
    //     var that = this;
    //     return this.http.get(CUSTOM_RESOURCES_BASE_URL + "iter/getProcessStatus" + "?cf=" + this.cfUtente) // environment.base_url + environment.resource_path + '?' + stringToSearch + params
    //     .subscribe(
    //       res => {
    //         console.log('Response Res:', res);
    //       },
    //       err => {
    //         console.log('Rerror Err:', err);
    //       });
    // }});
    // this.dataSource = new DataSource({
    //   store: this.customStore
    // });
    
}

  selectedRowChanged(e){
    this.selectedRow.emit(e.selectedRowsData[0].id);
    console.log('SELECTED:', e.selectedRowsData[0].id);
  }

  handleClick(){
    this.loggedUser$ = this.globalContextService.getSubjectInnerSharedObject("loggedUser");
    this.subscriptions.push(
        this.loggedUser$.subscribe(
            (loggedUser: LoggedUser) => {
                if (loggedUser) {
                    this.userInfo = loggedUser;
                    console.log("INFOUSER: ", this.userInfo)
                }
            }
        )
    );
    
    // let that = this;
    // this.customStore = new CustomStore({
    //   load: function(loadOptions: any) {
    //     // let that = this;
    //     return that.http.get(CUSTOM_RESOURCES_BASE_URL + "iter/getIterUtente?cf=" + "GSLFNC89A05G224Y" + "&idAzienda=" + "2") // environment.base_url + environment.resource_path + '?' + stringToSearch + params
    //     .subscribe(
    //       res => {
    //         console.log('Response Res:', res);
    //         return {
    //           data: res,
    //           totalCount: (res as Array<any>).length
    //         };
    //       },
    //       err => {
    //         console.log('Rerror Err:', err);
    //       });
    // }});
    // this.dataSource = new DataSource({
    //   store: this.customStore
    // });
///////////////////////////////////////
    // this.http.get(CUSTOM_RESOURCES_BASE_URL + "iter/getIterUtente?cf=" + "GSLFNC89A05G224Y" + "&idAzienda=" + "2") // environment.base_url + environment.resource_path + '?' + stringToSearch + params
    // .subscribe(
    //   res => {
    //     that.dataSource = new DataSource({
    //       store: new CustomStore({
    //         load: function() {
    //           return {data: res,
    //           totalCount: (res as Array<any>).length}
    //         }
    //       })
    //     });
    //     console.log('Response Res:', res);
    //     // console.log("CUSTOM STORE:", this.customStore);
    //     console.log("DATASOURCE: ", this.dataSource)
    //   },
    //   err => {
    //     console.log('Rerror Err:', err);
    //   });
    /////////////////////////////////////////////////
    this.http.get(CUSTOM_RESOURCES_BASE_URL + "iter/getIterUtente?cf=" + "GSLFNC89A05G224Y" + "&idAzienda=" + "2") // environment.base_url + environment.resource_path + '?' + stringToSearch + params
    .subscribe(
      res => {
        this.listaItems = res;
        console.log("ITEMS: ", this.listaItems)
      },
      err => {
        console.log('Rerror Err:', err);
      });
  }

}
