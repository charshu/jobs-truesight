import { Injectable,OnInit } from '@angular/core';
import { Http, Headers, RequestOptions, Response,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
//import { AuthenticationService } from '../shared/authentication.service';
import { User } from '../../type.d'
import 'rxjs/add/operator/map'
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
  private _currentUser:BehaviorSubject<User> = new BehaviorSubject<User>(null);
  public currentUser:Observable<User> = this._currentUser.asObservable();
  
  constructor(private apollo: Apollo,private http: Http) {

  }

  login(email: string, password: string): Observable<Response> {
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({ 
            headers: headers,
            withCredentials:true 
        });
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('email', email);
        urlSearchParams.append('password', password);
        let body = urlSearchParams.toString()
        return this.http.post('http://localhost:3000/auth/login', body, options)
            
    }
    logout(){
        let headers = new Headers({'Content-Type': 'application/x-www-form-urlencoded'});
        let options = new RequestOptions({ 
            headers: headers,
            withCredentials:true 
        });
        return this.http.get('http://localhost:3000/auth/logout',options)
           
    }

  loadCurrentUser(){
      console.log('loading current user');
      this.apollo.watchQuery<QueryResponse>({
            query: CurrentUserProfile
        }).map(({data}) => data.currentUser).subscribe(currentUser =>{
          this._currentUser.next(currentUser);
        })
  }

  ngOnInit(){
     
  }
  
}
