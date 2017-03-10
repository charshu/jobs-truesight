import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../shared/authentication.service';
import { User } from '../../type.d'
import 'rxjs/add/operator/map'

@Injectable()
export class UserService {

  constructor(
        private http: Http,
        private authenticationService: AuthenticationService) {}

  getUserInfo(): Observable<User> {
        // add authorization header with jwt token
      //   let headers = new Headers({ 'Authorization': 'Bearer ' + this.authenticationService.token });
      let options = new RequestOptions({ withCredentials: true });

        // get users from api
        return this.http.get('http://localhost:3000/auth/info', options)
            .map((response: Response) => response.json());
    }

}
