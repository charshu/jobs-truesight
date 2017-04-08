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
     results {
      testSheetUid
      factors {
        name
        value
        question_counter
      }
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
        try {
            const query = this.apollo.query<QueryResponse>({
            query: CurrentUserProfile,
            forceFetch: true
            }).map(({data}) => data.currentUser);
            let currentUser: User = await query.toPromise();
            if (!currentUser) {
                return false;
            }
            // found user, clone to avoid read only
            this._currentUser.next(JSON.parse(JSON.stringify(currentUser)));
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    public isLoggedIn(): boolean {
        console.log('current user : ' + this._currentUser.value);
        if (!this._currentUser.value) {
            this.router.navigate(['/login']);
            return false;
        }
        return true;
    }

    public getUserId(): string {
        return this.isLoggedIn ? this._currentUser.value.id : null;
    }
    public getJobId(): number {
        return this.isLoggedIn ? this._currentUser.value.profile.jobId : -1;
    }
    public getWorkPlaceId(): string {
        return this.isLoggedIn ? this._currentUser.value.profile.workPlaceId : null;
    }
    public setJobId(jobId): boolean {
        if (this.isLoggedIn) {
            this._currentUser.value.profile.jobId = jobId;
            return true;
        }
        return false;
    }


    ngOnInit() {
       
    }

}
