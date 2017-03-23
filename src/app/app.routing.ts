
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { QuestionComponent } from './question/question.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent  },
  { path: 'test', component: TestComponent  },
  { path: 'test/:uid', component: TestComponent  },
  { path: 'test/:uid/:qid', component: QuestionComponent  },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent }

];

export const routing = RouterModule.forRoot(routes);
