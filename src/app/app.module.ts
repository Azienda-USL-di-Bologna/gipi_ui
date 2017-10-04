import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import { HttpModule } from '@angular/http';

import 'devextreme/data/odata/store';
import 'devextreme/data/odata/context';
import { DefinizioneTipiProcedimentoService } from './definizione-tipi-procedimento/definizione-tipi-procedimento.service';
import { UtilityFunctions } from './utility-functions';


import {
  DxDataGridModule,
  DxFormModule,
  DxButtonModule,
  DxSelectBoxModule,
  DxTextBoxModule,
  DxTemplateModule,
  DxTagBoxModule,
  DxTabsModule,
  DxPopupModule,
  DxResponsiveBoxModule,
  DxDateBoxModule,
  DxCheckBoxModule,
  DxTextAreaModule,
  DxTreeViewModule
} from 'devextreme-angular';

import {RouterModule} from '@angular/router';
import {rootRouterConfig} from './app.routes';

import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import { DefinizioneTipiProcedimentoComponent } from './definizione-tipi-procedimento/definizione-tipi-procedimento.component';
import { DettaglioProvvedimentoComponent } from './dettaglio-provvedimento/dettaglio-provvedimento.component';
import { AssociazioniComponent } from './associazioni/associazioni.component';
import { AziendeTipiProcedimentoComponent } from './aziende-tipi-procedimento/aziende-tipi-procedimento.component';
import { AssociaComponent } from './associazioni/sub-view/associa/associa.component';
import { ProcedimentoComponent } from './associazioni/sub-view/procedimento/procedimento.component';
import { AssociaDirective } from './associazioni/directives/associa.directive';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DefinizioneTipiProcedimentoComponent,
    DettaglioProvvedimentoComponent,
    AziendeTipiProcedimentoComponent
    AssociaComponent,
    ProcedimentoComponent,
    AssociaDirective
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
    DxPopupModule,
    DxResponsiveBoxModule,
    DxDateBoxModule,
    DxCheckBoxModule,
    DxTextAreaModule,
    HttpModule,
    DxTreeViewModule
  ],
  providers: [DefinizioneTipiProcedimentoService],
  bootstrap: [AppComponent],
  entryComponents: [AssociaComponent, ProcedimentoComponent]
})
export class AppModule {
}
