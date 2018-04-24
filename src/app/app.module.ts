import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import { HttpModule } from "@angular/http";

import "devextreme/data/odata/store";
import "devextreme/data/odata/context";
import { DefinizioneTipiProcedimentoService } from "./definizione-tipi-procedimento/definizione-tipi-procedimento.service";

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
    DxTreeViewModule,
    DxContextMenuModule,
    DxLookupModule,
    DxValidatorModule,
    DxValidationSummaryModule, 
    DxSlideOutModule, 
    DxToolbarModule, 
    DxSwitchModule,
    DxScrollViewModule,
    DxNumberBoxModule,
    DxValidationGroupModule,
    DxTooltipModule,
    DxLoadPanelModule
} from "devextreme-angular";

import {RouterModule} from "@angular/router";
import {rootRouterConfig} from "./app.routes";

import {AppComponent} from "./app.component";
import {HomeComponent} from "./home/home.component";
import { DefinizioneTipiProcedimentoComponent } from "./definizione-tipi-procedimento/definizione-tipi-procedimento.component";
import { AssociazioneAziendeComponent } from "./associazione-aziende/associazione-aziende.component";
import { AssociazioniComponent } from "./associazioni/associazioni.component";
import { GestioneAssociazioneAziendaComponent } from "./gestione-associazione-azienda/gestione-associazione-azienda.component";
import { AssociaComponent } from "./associazioni/sub-view/associa/associa.component";
import { ProcedimentoComponent } from "./associazioni/sub-view/procedimento/procedimento.component";
import { AssociaDirective } from "./associazioni/directives/associa.directive";
import { AlberoStruttureComponent } from "./associazioni/sub-view/albero-strutture/albero-strutture.component";
import { StrutturaTipiProcedimentoComponent } from "./struttura-tipi-procedimento/struttura-tipi-procedimento.component";

// import {NoLoginGuard} from "./authorization/guards/no-login.guard";
// import {LoginGuard} from "./authorization/guards/login.guard";
import {RoleGuard} from "./authorization/guards/role.guard";

import { FormsModule } from "@angular/forms";
// import {MomentModule} from "angular2-moment";
 import {NgIdleKeepaliveModule} from "@ng-idle/keepalive";
import {ContextModule} from "@bds/nt-context";
import {contextModuleConfig, loginModuleConfig} from "./config/module-configurations";
import { StruttureTreeComponent } from "./reusable-component/strutture-tree/strutture-tree.component";
import { ProcedimentiAttiviComponent } from "./procedimenti-attivi/procedimenti-attivi.component";
import { PopupStrutturaTipiProcedimentoComponent } from "./popup-struttura-tipi-procedimento/popup-struttura-tipi-procedimento.component";
import { IterProcedimentoComponent } from "./iter-procedimento/iter-procedimento.component";
import { SequenzaDelleFasiComponent } from "./iter-procedimento/sequenza-delle-fasi/sequenza-delle-fasi.component";
import { CronologiaEventiComponent } from "./iter-procedimento/cronologia-eventi/cronologia-eventi.component";
import { DocumentiIterComponent } from "./iter-procedimento/documenti-iter/documenti-iter.component";
import { AvviaNuovoIterComponent } from "./procedimenti-attivi/avvia-nuovo-iter/avvia-nuovo-iter.component";
import { TestTreeComponent } from "./test/test-tree/test-tree.component";
import {PassaggioDiFaseComponent} from "./iter-procedimento/passaggio-di-fase/passaggio-di-fase.component";
import { SospensioneIterComponent } from "./iter-procedimento/sospensione-iter/sospensione-iter.component";
import { ListaIterComponent } from "./lista-iter/lista-iter.component";
// import { AfterLoginComponent } from "./after-login/after-login.component";
import { EntitiesModule } from "@bds/nt-entities";
import { AvviaNuovoIterDaDocumentoComponent } from "./procedimenti-attivi/avvia-nuovo-iter-da-documento/avvia-nuovo-iter-da-documento.component";
import { ListaIterConPermessiComponent } from "./cambio-di-stato/lista-iter-con-permessi/lista-iter-con-permessi.component";
import { CambioDiStatoBoxComponent } from "./cambio-di-stato-box/cambio-di-stato-box.component";
import { CambioDiStatoComponent } from "./cambio-di-stato/cambio-di-stato.component";
import { TipiProcedimentoAziendaliComponent } from "./tipi-procedimento-aziendali/tipi-procedimento-aziendali.component";
import { DettaglioTipoProcedimentoComponent } from "./tipi-procedimento-aziendali/dettaglio-tipo-procedimento/dettaglio-tipo-procedimento.component";
import {LoginModule} from "@bds/nt-login";
import { TestGridComponent } from "./test/test-grid/test-grid.component";
import {AppConfiguration} from "./config/app-configuration";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        DefinizioneTipiProcedimentoComponent,
        AssociazioneAziendeComponent,
        GestioneAssociazioneAziendaComponent,
        AssociaComponent,
        ProcedimentoComponent,
        AssociaDirective,
        AssociaDirective,
        AssociazioniComponent,
        AlberoStruttureComponent,
        StrutturaTipiProcedimentoComponent,
        StruttureTreeComponent,
        ProcedimentiAttiviComponent,
        PopupStrutturaTipiProcedimentoComponent,
        IterProcedimentoComponent,
        SequenzaDelleFasiComponent,
        CronologiaEventiComponent,
        DocumentiIterComponent,
        TestTreeComponent,
        AvviaNuovoIterComponent,
        PassaggioDiFaseComponent,
        SospensioneIterComponent,
        ListaIterComponent,
        // AfterLoginComponent,
        AvviaNuovoIterDaDocumentoComponent,
        ListaIterConPermessiComponent,
        CambioDiStatoBoxComponent,
        CambioDiStatoComponent,
        TipiProcedimentoAziendaliComponent,
        DettaglioTipoProcedimentoComponent,
        TestGridComponent
    ],
    imports: [
        BrowserModule,
        RouterModule.forRoot(rootRouterConfig, { useHash: true }),
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
        DxLookupModule,
        HttpModule,
        DxTreeViewModule,
        DxContextMenuModule,
        FormsModule,
        // MomentModule,
        DxValidatorModule,
        DxValidationSummaryModule,
        NgIdleKeepaliveModule.forRoot(),
        DxSlideOutModule,
        DxToolbarModule,
        DxSwitchModule,
        DxScrollViewModule,
        ContextModule.forRoot(contextModuleConfig),
        LoginModule.forRoot(loginModuleConfig),
        EntitiesModule.forRoot(null),
        DxNumberBoxModule,
        DxValidationGroupModule,
        DxTooltipModule,
        DxLoadPanelModule
    ],
    providers: [DefinizioneTipiProcedimentoService, RoleGuard, AppConfiguration
        // NavbarService
    ],
    bootstrap: [AppComponent],
    entryComponents: [AssociaComponent, ProcedimentoComponent]
})
export class AppModule {
}
