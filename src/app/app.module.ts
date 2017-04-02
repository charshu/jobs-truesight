import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { TestBoardComponent } from './test-board/test-board.component';
import { QuestionComponent } from './question/question.component';


import { routing } from './app.routing';
import { TestService, UserService, RouteGuard } from './shared';


import { ProfileComponent } from './profile/profile.component';
import { LoginComponent } from './login/login.component';
import { ResultComponent } from './result/result.component';
import { NavbarComponent } from './navbar/navbar.component';
import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { ApolloClient, createNetworkInterface } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { Ng2PageScrollModule } from 'ng2-page-scroll';
import { CookieService } from 'angular2-cookie/core';
// by default, this client will send queries to `/graphql` (relative to the URL of your app)
const client = new ApolloClient({
  networkInterface: createNetworkInterface({
    uri: 'http://localhost:3000/graphql',
    opts: {
      credentials: 'include'
    }
  }),
});
export function provideClient(): ApolloClient {
  return client;
}

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    routing,
    ApolloModule.forRoot(provideClient),
    RoundProgressModule,
    Ng2PageScrollModule.forRoot()
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    NavbarComponent,
    TestComponent,
    QuestionComponent,
    TestBoardComponent,
    ResultComponent
  ],
  providers: [
    UserService,
    TestService,
    RouteGuard,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
    // recreate elements
    store.disposeOldHosts = createNewHosts(cmpLocation);
    // remove styles
    removeNgStyles();
  }
  hmrAfterDestroy(store) {
    // display new elements
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
