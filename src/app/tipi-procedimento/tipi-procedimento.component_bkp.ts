// import {Component, OnInit} from '@angular/core';
// import 'devextreme/data/odata/store';
// import DataSource from 'devextreme/data/data_source';
// import ODataStore from 'devextreme/data/odata/store';
// import {
//   ODATA_STORE_ROOT_URL, odataAziendeStruttureTipiProcPath,
//   odataTipiProcedimentoPath
// } from '../../environments/app.constant'
// import {TipiProcedimentoService, Tab} from './tipi-procedimento.service';
//
//
// @Component({
//   selector: 'app-tipi-procedimento',
//   templateUrl: './tipi-procedimento.component.html',
//   styleUrls: ['./tipi-procedimento.component.css'],
//   providers: [TipiProcedimentoService]
// })
// export class TipiProcedimentoComponent_bkp implements OnInit {
//
//   events: Array<string> = [];
//
//   dataSourceTipiProcedimento: any;
//   companyDataSource: any;
//   associatedCompaniesSource: any;
//   selectedRow: any;
//
//   formItems: any;
//   defaultOpenModesSource: string[];
//
//   currentEditingRow: any;
//   currentProcTypeCompanies: any[];
//
//   editingTabs: Tab[];
//
//
//   constructor(service: TipiProcedimentoService) {
//     this.currentEditingRow = new Object();
//     this.editingTabs = service.getTabs();
//     this.defaultOpenModesSource = ['b', 'A', 'd'];
//
//     this.dataSourceTipiProcedimento = new DataSource({
//       store: new ODataStore({
//         key: 'IdTipoProcedimento',
//         url: ODATA_STORE_ROOT_URL + odataTipiProcedimentoPath
//         // url: 'http://localhost:10005/odata.svc/TipiProcedimentos?$expand=AziendeStruttureTipiProcedimentoDetails'
//       }),
//       onChanged: function () {
//         // debugger;
//       },
//       // filter: ["Attivo", "=", true],
//       expand: ['AziendeStruttureTipiProcedimentoDetails/AziendaDetails']
//     });
//
//
//     this.companyDataSource = new DataSource({
//       store: new ODataStore({
//         key: 'Id',
//         url: 'http://localhost:10005/odata.svc/Aziendas'
//       }),
//       onChanged: function () {
//         // debugger;
//       },
//       // filter: ["Attivo", "=", true]
//     });
//
//
//     this.associatedCompaniesSource = service.getCompanyStructureProcTypeSource();
//
//
//   }
//
//   ngOnInit() {
//
//   }
//
//   getCurrentId() {
//     if (!this.currentEditingRow)
//       return '0';
//     return this.currentEditingRow.Id;
//   }
//
//
//   handleEvent(eventName, e) {
//     switch (eventName) {
//       case 'editingStart':
//         this.editingStart(e);
//         break;
//     }
//
//     this.events.unshift(eventName);
//   }
//
//
//   clearEvents() {
//     this.events = [];
//   }
//
//   selectionChanged(e) {
//     this.selectedRow = e.selectedRowsData[0];
//     // this.getAziende(this.selectedRow.IdTipoProcedimento);
//     console.log(e);
//   }
//
//   changeSelectedRow(e) {
//     console.log(e);
//   }
//
//   editingStart(e) {
//     this.currentEditingRow = e.data;
//     // this.associatedCompaniesSource.load()
//     //   .done(function (res) {
//     //     this.currentProcTypeCompanies = [];
//     //     res.forEach((item) => {
//     //       this.currentProcTypeCompanies.push(item.AziendaDetails);
//     //     });
//     //   })
//     //   .fail(function (err) {
//     //     debugger;
//     //   });
//   }
//
//   selectTab(e) {
//     console.log(e);
//   }
//
// }
