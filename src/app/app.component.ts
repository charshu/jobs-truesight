import { Component } from '@angular/core';

import { ApiService } from './shared';
import { Http, Response } from '@angular/http';
import '../styles/global.scss';

@Component({
  selector: 'my-app', // <my-app></my-app>
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  url = 'https://github.com/preboot/angular2-webpack';
  title: string;

  constructor(private api: ApiService, private http: Http) {
    this.title = this.api.title;

    this.http.get('/api/handshake')
      .map((res:Response) => res.text())
      .subscribe((data) => {this.title = data});
  }
}
