import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { DefinizioneTipiProcedimentoComponent } from './definizione-tipi-procedimento/definizione-tipi-procedimento.component';
import { DettaglioProvvedimentoComponent } from './dettaglio-provvedimento/dettaglio-provvedimento.component';
import { AssociazioniComponent } from './associazioni/associazioni.component';


export const rootRouterConfig: Routes = [
  //ho reindirizzato la pagina di atterraggio a definizione-tipi-procedimento
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'definizione-tipi-procedimento', component: DefinizioneTipiProcedimentoComponent},
  { path: 'app-dettaglio-provvedimento', component: DettaglioProvvedimentoComponent},
  { path: 'associazioni', component: AssociazioniComponent},
];
