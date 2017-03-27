import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Router } from '@angular/router';
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
        id
        email
        profile {
        name
        gender
        age_range
        location
        jobId
        workPlaceId
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

  public redirectUrl: string;

  constructor(private apollo: Apollo, private http: Http, private router: Router, ) {

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
        try {
            const response = await this.http.post('http://localhost:3000/auth/login', body, options)
            .toPromise();
            if (response.status === 200) {
                console.log('login successfully');
                const found = await this.loadCurrentUser();
                if (found) {
                    // redirect back where they came
                    if (this.redirectUrl) {
                        this.router.navigate([this.redirectUrl]);
                        this.redirectUrl = null;
                    }
                    return true;
                } else {
                    return false;
                }
            }
        } catch (err) {
            console.log(err);
            return false;
        }

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
            this._currentUser.next(null);
            return true;
        }
        return false;
    }

    public async loadCurrentUser(): Promise<boolean> {
        console.log('loading current user');
        try {
            const query = this.apollo.query<QueryResponse>({
            query: CurrentUserProfile,
            forceFetch: true
            }).map(({data}) => data.currentUser);
            const currentUser = await query.toPromise();
            // found user
            if (currentUser !== null) {
                console.log('currentUser: ' + currentUser);
                this._currentUser.next(currentUser);
                return true;
            }
            // no user
            console.log('no user!');
            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    public getUserId(): String {
        return this._currentUser.value.id;
    }
    public async isLoggedIn(): Promise<Boolean> {
        await this.loadCurrentUser();
        return this._currentUser.value !== null;
    }

    ngOnInit() {
       
    }

}
