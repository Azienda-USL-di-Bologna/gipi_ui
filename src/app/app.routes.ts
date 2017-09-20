import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TipiProcedimentoComponent } from './tipi-procedimento/tipi-procedimento.component';
import { DettaglioProvvedimentoComponent } from './dettaglio-provvedimento/dettaglio-provvedimento.component';


export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: DettaglioProvvedimentoComponent},
  { path: 'tipi-procedimento', component: TipiProcedimentoComponent},
];
