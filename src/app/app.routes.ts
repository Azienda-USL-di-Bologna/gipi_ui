import { Routes } from "@angular/router";

import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { DefinizioneTipiProcedimentoComponent } from "./definizione-tipi-procedimento/definizione-tipi-procedimento.component";
import { AssociazioneAziendeComponent } from "./associazione-aziende/associazione-aziende.component";
import { GestioneAssociazioneAziendaComponent } from "./gestione-associazione-azienda/gestione-associazione-azienda.component";
import { AssociazioniComponent } from "./associazioni/associazioni.component";
import { StrutturaTipiProcedimentoComponent } from "./struttura-tipi-procedimento/struttura-tipi-procedimento.component";
import { LoginComponent } from "./login/login.component";
import { AfterLoginComponent } from "./after-login/after-login.component";
import { NoLoginGuard } from "./authorization/guards/no-login.guard";
import { LoginGuard } from "./authorization/guards/login.guard";
import { ProcedimentiAttiviComponent } from "app/procedimenti-attivi/procedimenti-attivi.component";
import { PopupStrutturaTipiProcedimentoComponent } from "app/popup-struttura-tipi-procedimento/popup-struttura-tipi-procedimento.component";
import { IterProcedimentoComponent } from "app/iter-procedimento/iter-procedimento.component";
import { TestTreeComponent } from "./test/test-tree/test-tree.component";
import { ListaIterComponent } from "app/lista-iter/lista-iter.component";
import { AvviaNuovoIterDaDocumentoComponent } from "app/procedimenti-attivi/avvia-nuovo-iter-da-documento/avvia-nuovo-iter-da-documento.component";
import { CambioDiStatoComponent } from "app/cambio-di-stato/cambio-di-stato.component";


export const rootRouterConfig: Routes = [

  // {
  //   path: 'home',
  //   component: HomeComponent,
  //   children: [
  //     { path: 'login', component: LoginComponent, canActivate: [NoLoginGuard], data: {breadcrumb: "Login"}},
  //     { path: 'definizione-tipi-procedimento', component: DefinizioneTipiProcedimentoComponent, canActivate: [LoginGuard], data: {breadcrumb: "Tipi Procedimento"}},
  //     { path: 'app-dettaglio-procedimento', component: DettaglioProcedimentoComponent, canActivate: [LoginGuard], data: {breadcrumb: "Dettaglio Procedimento"}},
  //     { path: 'aziende-tipi-procedimento', component: AziendeTipiProcedimentoComponent, canActivate: [LoginGuard], data: {breadcrumb: "Associazione Azienda"}}
  //   ]
  // },
  // ho reindirizzato la pagina di atterraggio a definizione-tipi-procedimento
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "login", component: LoginComponent, canActivate: [NoLoginGuard], data: {}},
  // { path: "after-login", component: AfterLoginComponent, canActivate: [LoginGuard], data: {}},
  { path: "home", component: HomeComponent, canActivate: [LoginGuard], data: {breadcrumb: "Home"}},
  { path: "definizione-tipi-procedimento", component: DefinizioneTipiProcedimentoComponent, canActivate: [LoginGuard], data: {breadcrumb: "Tipi Procedimento"}},
  { path: "associazione-aziende", component: AssociazioneAziendeComponent, canActivate: [LoginGuard], data: {breadcrumb: "Associazione alle Aziende"}},
  { path: "gestione-associazione-aziende", component: GestioneAssociazioneAziendaComponent, canActivate: [LoginGuard], data: {breadcrumb: "Gestione Associazione"}},
  { path: "associazioni", component: AssociazioniComponent, canActivate: [LoginGuard], data: {breadcrumb: "Associazioni"}},
  { path: "struttura-tipi-procedimento", component: StrutturaTipiProcedimentoComponent, data: {breadcrumb: "Strutture Associate"}},
  { path: "procedimenti-attivi", component: ProcedimentiAttiviComponent, data: {breadcrumb: "Procedimenti Attivi"} },
  { path: "popup-struttura-tipi-procedimento", component: PopupStrutturaTipiProcedimentoComponent, data: {breadcrumb: "Associa"} },
  { path: "iter-procedimento", component: IterProcedimentoComponent, data: {breadcrumb: "Nuovo Iter"} },
  { path: "app-test-tree", component: TestTreeComponent },
  { path: "app-lista-iter", component: ListaIterComponent, data: {breadcrumb: "Lista Iter"}},
  { path: "avvia-nuovo-iter-da-documento", component: AvviaNuovoIterDaDocumentoComponent, canActivate: [LoginGuard], data: {breadcrumb: "Nuovo Iter"} }
  { path: "app-cambio-di-stato", canActivate: [LoginGuard], component: CambioDiStatoComponent, data: {breadcrumb: "Cambio di stato"}
  { path: "app-cambio-di-stato", canActivate: [LoginGuard], component: CambioDiStatoComponent, data: {breadcrumb: "Cambio di stato"}}
];

