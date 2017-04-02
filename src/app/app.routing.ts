
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ResultComponent } from './result/result.component';
import { TestBoardComponent } from './test-board/test-board.component';
import { RouteGuard } from './shared';
const routes: Routes = [
  { path: '', component: HomeComponent  },
  { path: 'test', component: TestBoardComponent  },
  { path: 'test/:uid', component: TestComponent, canActivate: [RouteGuard] },
  { path: 'result/:uid', component: ResultComponent  },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent }

];

export const routing = RouterModule.forRoot(routes);
