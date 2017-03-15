import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { routing } from './app.routing';
import { AuthenticationService } from './shared/authentication.service';
import { UserService } from './shared/user.service';

import { InfoComponent } from './info/info.component';
import { LoginComponent } from './login/login.component';

import { removeNgStyles, createNewHosts } from '@angularclass/hmr';
import { ApolloClient } from 'apollo-client';
import { ApolloModule } from 'apollo-angular';
// by default, this client will send queries to `/graphql` (relative to the URL of your app)
const client = new ApolloClient();
export function provideClient(): ApolloClient {
  return client;
}


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    routing,
    ApolloModule.forRoot(provideClient)
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    InfoComponent
  ],
  providers: [
    UserService,
    AuthenticationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public appRef: ApplicationRef) {}
  hmrOnInit(store) {
    console.log('HMR store', store);
  }
  hmrOnDestroy(store) {
    let cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
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
