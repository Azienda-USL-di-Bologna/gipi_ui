// import { Component, OnInit } from "@angular/core";
// import { Router } from "@angular/router";
// import { GlobalContextService } from "@bds/nt-context";
// import { CommonData } from "../authorization/common-data";
// import DataSource from "devextreme/data/data_source";
// import { OdataContextDefinition } from "@bds/nt-context";
// import { OdataContextFactory } from "@bds/nt-context";
// import { Ruolo } from "@bds/nt-entities";
//
//
// @Component({
//   selector: "after-login",
//   templateUrl: "./after-login.component.html",
//   styleUrls: ["./after-login.component.scss"]
// })
// export class AfterLoginComponent implements OnInit {
//
//     private commonData = new CommonData();
//     private ruoliDataSource: DataSource;
//     private odataContextDefinition: OdataContextDefinition;
//     private ruoli: Ruolo[];
//
//     constructor(private router: Router,
//                 private globalContextService: GlobalContextService,
//                 private odataContextFactory: OdataContextFactory ) { }
//
//     ngOnInit() {
//         console.log("siamo nell After Login");
//
//         this.odataContextDefinition = this.odataContextFactory.buildOdataContextEntitiesDefinition();
//         this.ruoliDataSource = new DataSource({
//             store: this.odataContextDefinition.getContext()[new Ruolo().getName()],
//         });
//         this.ruoliDataSource.load().then(res => {
//             this.ruoli = res;
//             this.commonData.ruoli = this.ruoli;
//             this.globalContextService.setInnerSharedObject("commonData", this.commonData);
//         });
//
//         this.router.navigate(["/home"], { queryParams: { reset: true } });
//     }
// }
