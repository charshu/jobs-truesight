import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { AuthenticationService } from '../shared/authentication.service';
import { User } from '../../type.d';
import 'rxjs/add/operator/map';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const CurrentUserProfile = gql`
{
    currentUser {
        email
        profile {
        name
        gender
        age_range
        location
        picture
        }
    }
    }
    
`;
interface QueryResponse {
  currentUser: User;
}

@Injectable()
export class UserService implements OnInit {
  private _currentUser: BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public currentUser: Observable<User> = this._currentUser.asObservable();
  constructor(private apollo: Apollo, private http: Http) {

  }

  public async login(email: string, password: string): Promise<boolean> {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({
            headers,
            withCredentials: true
        });
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('email', email);
        urlSearchParams.append('password', password);
        let body = urlSearchParams.toString();
        const response = await this.http.post('http://localhost:3000/auth/login', body, options)
        .toPromise();
        if (response.status === 200) {
            await this.loadCurrentUser();
            console.log('currentUser is loaded');
            return true;
        }
        return false;

    }
    public async logout(): Promise<boolean> {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({
            headers,
            withCredentials: true
        });
        const response = await this.http.get('http://localhost:3000/auth/logout', options)
        .toPromise();
        if (response.status === 200) {
            return true;
        }
        return false;
    }

  public async loadCurrentUser() {
      console.log('loading current user');
      const currentUser = await this.apollo.query<QueryResponse>({
            query: CurrentUserProfile
        }).map(({data}) => data.currentUser).toPromise();
      console.log(currentUser);
      this._currentUser.next(currentUser);
  }

  ngOnInit(){

  }

}
