import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DefinizioneTipiProcedimentoComponent } from './definizione-tipi-procedimento/definizione-tipi-procedimento.component';
import { DettaglioProcedimentoComponent } from './dettaglio-procedimento/dettaglio-procedimento.component';
import { AziendeTipiProcedimentoComponent } from './aziende-tipi-procedimento/aziende-tipi-procedimento.component';
import { AssociazioniComponent } from './associazioni/associazioni.component';
import { StrutturaTipiProcedimentoComponent } from './struttura-tipi-procedimento/struttura-tipi-procedimento.component';
import { LoginComponent } from './login/login.component';
import { NoLoginGuard } from './login/guards/no-login.guard';
import { LoginGuard } from './login/guards/login.guard';
import { ProcedimentiAttiviComponent } from 'app/procedimenti-attivi/procedimenti-attivi.component';
import { PopupStrutturaTipiProcedimentoComponent } from 'app/popup-struttura-tipi-procedimento/popup-struttura-tipi-procedimento.component';
import { IterProcedimentoComponent } from 'app/iter-procedimento/iter-procedimento.component';
import {TestLayoutComponent} from "./test-layout/test-layout.component";
import { TestTreeComponent } from './test/test-tree/test-tree.component';


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
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NoLoginGuard], data: {breadcrumb: "Login"}},
  { path: 'home', component: HomeComponent, canActivate: [LoginGuard], data: {breadcrumb: "Home"}},
  { path: 'definizione-tipi-procedimento', component: DefinizioneTipiProcedimentoComponent, canActivate: [LoginGuard], data: {breadcrumb: "Tipi Procedimento"}},
  { path: 'app-dettaglio-provvedimento', component: DettaglioProcedimentoComponent, canActivate: [LoginGuard], data: {breadcrumb: "Dettaglio Procedimento"}},
  { path: 'aziende-tipi-procedimento', component: AziendeTipiProcedimentoComponent, canActivate: [LoginGuard], data: {breadcrumb: "Associazione Azienda"}},
  { path: 'associazioni', component: AssociazioniComponent, canActivate: [LoginGuard], data: {breadcrumb: "Associazioni"}},
  { path: 'struttura-tipi-procedimento', component: StrutturaTipiProcedimentoComponent, data: {breadcrumb: "Strutture Associate"}},
  { path: 'procedimenti-attivi', component: ProcedimentiAttiviComponent, data: {breadcrumb: "Procedimenti Attivi"} },
  { path: 'popup-struttura-tipi-procedimento', component: PopupStrutturaTipiProcedimentoComponent, data: {breadcrumb: "Associa"} },
  { path: 'iter-procedimento', component: IterProcedimentoComponent, data: {breadcrumb: "Nuovo Iter"} },
  { path: 'test-layout', component: TestLayoutComponent},
  { path: 'app-test-tree', component: TestTreeComponent }
];

