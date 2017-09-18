import { Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TipiProcedimentoComponent } from './tipi-procedimento/tipi-procedimento.component';


export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent},
  { path: 'tipi-procedimento', component: TipiProcedimentoComponent},
];

