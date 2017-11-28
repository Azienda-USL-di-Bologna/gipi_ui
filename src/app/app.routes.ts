import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DefinizioneTipiProcedimentoComponent } from './definizione-tipi-procedimento/definizione-tipi-procedimento.component';
import { DettaglioProvvedimentoComponent } from './dettaglio-provvedimento/dettaglio-provvedimento.component';
import { AziendeTipiProcedimentoComponent } from './aziende-tipi-procedimento/aziende-tipi-procedimento.component';
import { AssociazioniComponent } from './associazioni/associazioni.component';
import { StrutturaTipiProcedimentoComponent } from './struttura-tipi-procedimento/struttura-tipi-procedimento.component';
import { LoginComponent } from './login/login.component';
import { NoLoginGuard } from './login/guards/no-login.guard';
import { LoginGuard } from './login/guards/login.guard';
import { ProcedimentiAttiviComponent } from 'app/procedimenti-attivi/procedimenti-attivi.component';
import { PopupStrutturaTipiProcedimentoComponent } from 'app/popup-struttura-tipi-procedimento/popup-struttura-tipi-procedimento.component';
import { IterProcedimentoComponent } from 'app/iter-procedimento/iter-procedimento.component';


export const rootRouterConfig: Routes = [
  // ho reindirizzato la pagina di atterraggio a definizione-tipi-procedimento
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NoLoginGuard]},
  { path: 'home', component: HomeComponent, canActivate: [LoginGuard]},
  { path: 'definizione-tipi-procedimento', component: DefinizioneTipiProcedimentoComponent, canActivate: [LoginGuard]},
  { path: 'app-dettaglio-provvedimento', component: DettaglioProvvedimentoComponent, canActivate: [LoginGuard]},
  { path: 'aziende-tipi-procedimento', component: AziendeTipiProcedimentoComponent, canActivate: [LoginGuard]},
  { path: 'associazioni', component: AssociazioniComponent, canActivate: [LoginGuard]},
  { path: 'struttura-tipi-procedimento', component: StrutturaTipiProcedimentoComponent},
  { path: 'procedimenti-attivi', component: ProcedimentiAttiviComponent },
  { path: 'popup-struttura-tipi-procedimento', component: PopupStrutturaTipiProcedimentoComponent },
  { path: 'iter-procedimento', component: IterProcedimentoComponent }
];

