import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import 'devextreme/data/odata/store';
import 'devextreme/data/odata/context';

import {
  DxDataGridModule,
  DxFormModule,
  DxButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxTemplateModule,
  DxTagBoxModule,
  DxTabsModule,
  DxPopupModule
} from 'devextreme-angular';

import {RouterModule} from '@angular/router';
import {rootRouterConfig} from './app.routes';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {TipiProcedimentoComponent} from './tipi-procedimento/tipi-procedimento.component'

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TipiProcedimentoComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(rootRouterConfig, {useHash: true}),
    DxDataGridModule,
    DxFormModule,
    DxButtonModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxTemplateModule,
    DxTagBoxModule,
    DxTabsModule,
    DxPopupModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
