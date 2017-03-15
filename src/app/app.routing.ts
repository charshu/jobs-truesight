
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component'
import { InfoComponent } from './info/info.component';

const routes: Routes = [
  { path: '', redirectTo: 'home',pathMatch: 'full'},
  { path: 'home', component: HomeComponent  },
  { path: 'login', component: LoginComponent },
  { path: 'info', component: InfoComponent }
  
];

export const routing = RouterModule.forRoot(routes);
