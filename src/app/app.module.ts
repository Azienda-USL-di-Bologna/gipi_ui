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
    DxValidationSummaryModule
} from "devextreme-angular";

import {RouterModule} from "@angular/router";
import {rootRouterConfig} from "./app.routes";

import {AppComponent} from "./app.component";
import {HomeComponent} from "./home/home.component";
import { DefinizioneTipiProcedimentoComponent } from "./definizione-tipi-procedimento/definizione-tipi-procedimento.component";
import { DettaglioProvvedimentoComponent } from "./dettaglio-provvedimento/dettaglio-provvedimento.component";
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
import { CronologiaEventiComponent } from "./iter-procedimento/cronologia-eventi/cronologia-eventi.component";
import { DocumentiIterComponent } from "./iter-procedimento/documenti-iter/documenti-iter.component";

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        DefinizioneTipiProcedimentoComponent,
        DettaglioProvvedimentoComponent,
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
        DocumentiIterComponent,
        CronologiaEventiComponent
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
        ContextModule.forRoot(contextModuleConfig)
    ],
    providers: [DefinizioneTipiProcedimentoService, SessionManager, LoginGuard, NoLoginGuard,
        ],
    bootstrap: [AppComponent],
    entryComponents: [AssociaComponent, ProcedimentoComponent]
})
export class AppModule {
}
