// TODO: implement authentication server
import { Injectable } from '@angular/core';
import { Http,Headers, Response,RequestOptions,URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map'

@Injectable()
export class AuthenticationService {
    public token: string;

    constructor(private http: Http) {}

    login(email: string, password: string): Observable<boolean> {
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
            .map((res: Response) => {
                console.log(res);
               return res.status === 200;
                
            });
    }

}