
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { SignUpComponent } from './signup/signup.component';
import { ResultComponent } from './result/result.component';
import { TestBoardComponent } from './test-board/test-board.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { RouteGuard } from './shared';
const routes: Routes = [
  { path: '', component: HomeComponent  },
  { path: 'questionnaires', component: TestBoardComponent  },
  { path: 'questionnaires/:pid', component: TestBoardComponent  },
  { path: 'questionnaire/:uid', component: TestComponent, canActivate: [RouteGuard] },
  { path: 'questionnaire/:uid/:pid', component: TestComponent, canActivate: [RouteGuard] },
  { path: 'result/:uid', component: ResultComponent, canActivate: [RouteGuard]  },
  { path: 'result/:uid/:id', component: ResultComponent, canActivate: [RouteGuard]  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [RouteGuard] },
  { path: '404' , component: NotFoundComponent},
  { path: '**' , redirectTo: '404'}

];

export const routing = RouterModule.forRoot(routes);
