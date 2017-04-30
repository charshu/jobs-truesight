import {
    Injectable
} from '@angular/core';
import {
    Http,
    Headers,
    RequestOptions,
    URLSearchParams
} from '@angular/http';
import {
    Router
} from '@angular/router';
import {
    Observable
} from 'rxjs/Observable';
import {
    BehaviorSubject
} from 'rxjs/BehaviorSubject';
// import { AuthenticationService } from '../shared/authentication.service';
import {
    User,
    AnswerSheet
} from '../../type.d';
import 'rxjs/add/operator/map';
import {
    Apollo
} from 'apollo-angular';
import gql from 'graphql-tag';
import {
    filter
} from 'lodash';

const getUser = gql `
{
    getUser {
        id
        email
        profile {
            name
            gender
            age_range
            location
            job{
                id
                name
            }
            workPlaceId
            picture
            salary
        }
        results {
        testSheetUid
        job{
            name
        }
            factors {
                name
                value
                question_counter
            }
        }
answerSheets {
      id
      testSheetUid
      job {
        id
        name
        salary{
            average
            min
            max
        }
        results {
          testSheetUid
          factors {
            name
            value
            question_counter
            min
            max
          }
        }
      }
      workPlace {
        id
        results {
          testSheetUid
          job {
            id
            name
          }
          factors {
            name
            value
            question_counter
            min
            max
          }
        }
      }
      salary
      createdAt
      answers {
        questionId
        selectedChoiceId
      }
    }
  }
}
    
`;
interface QueryResponse {
    getUser: User;
}

@Injectable()
export class UserService {
    public redirectUrl: string;
    private user: BehaviorSubject < User > = new BehaviorSubject < User > (null);
    private observableUser: Observable < User > = this.user.asObservable();
    constructor(private apollo: Apollo, private http: Http, private router: Router, ) {
        console.log('User services init');
        this.isLoggedIn();
    }
    public async register(user) {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({
            headers
        });

        try {
            const response = await this.http.post('http://localhost:3000/auth/register',
            JSON.stringify(user), options).toPromise();
            if (response.status === 200) {
                await this.login(user.email , user.password);
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    public async login(email: string, password: string): Promise < boolean > {
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
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
                const user = await this.getUser();
                if (user) {
                    // redirect back where they came
                    if (!this.redirectUrl) {
                        this.redirectUrl = '/';
                    }
                    console.log(`redirect to ${this.redirectUrl}`);
                    const isRedirect = await this.router.navigate([this.redirectUrl]);
                    if (isRedirect) {
                        this.redirectUrl = null;
                    } else {
                        throw new Error('Redirect fail');
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

    public async logout(): Promise < boolean > {
        let headers = new Headers({
            'Content-Type': 'application/x-www-form-urlencoded'
        });
        let options = new RequestOptions({
            headers,
            withCredentials: true
        });
        const response = await this.http.get('http://localhost:3000/auth/logout', options)
        .toPromise();
        if (response.status === 200) {
            this.user.next(null);
            return true;
        }
        return false;
    }

    public async getUser(): Promise < User > {
        try {
            const query = this.apollo.query < QueryResponse > ({
                query: getUser,
                forceFetch: true
            }).map(({
                data
            }) => data.getUser);
            let user: User = await query.toPromise();
            user = JSON.parse(JSON.stringify(user));
            console.log(user);
            // save in local memory
            this.user.next(user);
            return user;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
    public async isLoggedIn(): Promise<boolean> {
        const user = await this.getUser();
        console.log(`User session ? ${user ? 'FOUND' : 'NOT FOUND'}`);
        console.log(`User local data ? ${this.user.value ? 'FOUND' : 'NOT FOUND'} `);
        return user ? true : false;
    }
    public getCurrentUser(): User {
        return this.user.value;
    }
    public getObservableUser(): Observable < User > {
        return this.observableUser;
    }
    public getUserId(): string {
        return this.user.value ? this.user.value.id : null;
    }
    public getJobId(): number {
        return this.user.value ? this.user.value.profile.job.id : -1;
    }
    public getJobName(): string {
        return this.user.value ? this.user.value.profile.job.name : null;
    }
    public getWorkPlaceId(): string {
        return this.user.value ? this.user.value.profile.workPlaceId : null;
    }
    public setJobId(jobId): void {
        if (this.user.value) {
            this.user.value.profile.job.id = jobId;
        }
    }
    // tslint:disable-next-line:max-line-length
    public async getAnswerSheetByUid(uid: string, option?: {forceFetch?: boolean}): Promise<AnswerSheet[]> {
        if (option && option.forceFetch) {
            await this.getUser();
        }
        let answerSheets: AnswerSheet[] = filter(this.user.value.answerSheets, {
            testSheetUid: uid
        });
        console.log('Get answer sheet by uid: ' + uid + '\n', answerSheets);
        return answerSheets;
    }

    public async updateProfile(profile): Promise < boolean > {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });
        let options = new RequestOptions({
            headers,
            withCredentials: true
        });
        try {
            const response = await this.http.post('http://localhost:3000/auth/profile',
                JSON.stringify(profile), options).toPromise();
            const user = await this.getUser();
            if (user) {
                return response.status === 200;
            } else {
                throw new Error('user is missing after update profile');
            }
        } catch (err) {
            console.log(err);
            return false;
        }
    }

}
