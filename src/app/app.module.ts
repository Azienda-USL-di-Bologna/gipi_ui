import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import { HttpModule } from "@angular/http";

import "devextreme/data/odata/store";
import "devextreme/data/odata/context";
import { DefinizioneTipiProcedimentoService } from "./definizione-tipi-procedimento/definizione-tipi-procedimento.service";

import { SidebarModule } from "ng-sidebar";

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
    DxValidationSummaryModule, DxSlideOutModule, DxToolbarModule, DxSwitchModule
} from "devextreme-angular";

import {RouterModule} from "@angular/router";
import {rootRouterConfig} from "./app.routes";

import {AppComponent} from "./app.component";
import {HomeComponent} from "./home/home.component";
import { DefinizioneTipiProcedimentoComponent } from "./definizione-tipi-procedimento/definizione-tipi-procedimento.component";
import { DettaglioProcedimentoComponent } from "./dettaglio-procedimento/dettaglio-procedimento.component";
import { AssociazioniComponent } from "./associazioni/associazioni.component";
import { AziendeTipiProcedimentoComponent } from "./aziende-tipi-procedimento/aziende-tipi-procedimento.component";
import { AssociaComponent } from "./associazioni/sub-view/associa/associa.component";
import { ProcedimentoComponent } from "./associazioni/sub-view/procedimento/procedimento.component";
import { AssociaDirective } from "./associazioni/directives/associa.directive";
import { AlberoStruttureComponent } from "./associazioni/sub-view/albero-strutture/albero-strutture.component";
import { StrutturaTipiProcedimentoComponent } from "./struttura-tipi-procedimento/struttura-tipi-procedimento.component";

import {AuthenticationJwtModule} from "./authentication-jwt/authentication-jwt.module";
import { LoginComponent } from "./login/login.component";
import {NoLoginGuard} from "./login/guards/no-login.guard";
import {LoginGuard} from "./login/guards/login.guard";

import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import {MomentModule} from "angular2-moment";
import {NgIdleKeepaliveModule} from "@ng-idle/keepalive";
import {SessionManager} from "./login/session-manager";
import {ContextModule} from "@bds/nt-angular-context/context.module";
import {contextModuleConfig} from "./module-configurations";
import { StruttureTreeComponent } from "./reusable-component/strutture-tree/strutture-tree.component";
import { ProcedimentiAttiviComponent } from "./procedimenti-attivi/procedimenti-attivi.component";
import { PopupStrutturaTipiProcedimentoComponent } from "./popup-struttura-tipi-procedimento/popup-struttura-tipi-procedimento.component";
import { IterProcedimentoComponent } from "./iter-procedimento/iter-procedimento.component";
import { SequenzaDelleFasiComponent } from "./iter-procedimento/sequenza-delle-fasi/sequenza-delle-fasi.component";
import { ButtonsBarComponent } from "./buttons-bar/buttons-bar.component";
import { CronologiaEventiComponent } from "./iter-procedimento/cronologia-eventi/cronologia-eventi.component";
import { DocumentiIterComponent } from "./iter-procedimento/documenti-iter/documenti-iter.component";
import { AvviaNuovoIterComponent } from "./procedimenti-attivi/avvia-nuovo-iter/avvia-nuovo-iter.component";
import { TestTreeComponent } from "./test/test-tree/test-tree.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import {PassaggioDiFaseComponent} from "./iter-procedimento/passaggio-di-fase/passaggio-di-fase.component";
import {NavbarService} from "./navbar/navbar.service";


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        DefinizioneTipiProcedimentoComponent,
        DettaglioProcedimentoComponent,
        AziendeTipiProcedimentoComponent,
        AssociaComponent,
        ProcedimentoComponent,
        AssociaDirective,
        AssociaDirective,
        AssociazioniComponent,
        AlberoStruttureComponent,
        StrutturaTipiProcedimentoComponent,
        LoginComponent,
        StruttureTreeComponent,
        ProcedimentiAttiviComponent,
        PopupStrutturaTipiProcedimentoComponent,
        IterProcedimentoComponent,
        SequenzaDelleFasiComponent,
        ButtonsBarComponent,
        CronologiaEventiComponent,
        DocumentiIterComponent,
        TestTreeComponent,
        AvviaNuovoIterComponent,
        NavbarComponent,
        PassaggioDiFaseComponent,
        SidebarComponent
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
        AuthenticationJwtModule,
        FormsModule,
        HttpClientModule,
        MomentModule,
        DxValidatorModule,
        DxValidationSummaryModule,
        NgIdleKeepaliveModule.forRoot(),
        DxSlideOutModule,
        DxToolbarModule,
        DxSwitchModule,
        ContextModule.forRoot(contextModuleConfig),
        SidebarModule.forRoot()
    ],
    providers: [DefinizioneTipiProcedimentoService, SessionManager, LoginGuard, NoLoginGuard, NavbarService],
    bootstrap: [AppComponent],
    entryComponents: [AssociaComponent, ProcedimentoComponent]
})
export class AppModule {
}
