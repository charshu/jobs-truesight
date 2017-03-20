
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent  },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent }

];

export const routing = RouterModule.forRoot(routes);
