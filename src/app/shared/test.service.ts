import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { UserService } from './user.service';
import { TestSheet, AnswerSheet } from '../../type.d';
import 'rxjs/add/operator/map';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';

const testQuery = gql`
query test($uid: String!){
  test(uid:$uid) {
    title
    questions {
      id
      factor
      title
      choices {
        title
        value
      }
    }
  }
}

    
`;
interface QueryResponse {
  testSheet: TestSheet;
}

@Injectable()
export class TestService implements OnInit {
  private _answer: BehaviorSubject<AnswerSheet> = new BehaviorSubject<AnswerSheet>(null);
  public answer: Observable<AnswerSheet> = this._answer.asObservable();

  constructor(
      private apollo: Apollo,
      private userService: UserService,
      private http: Http) {

  }

  public async loadTestSheet(uid): Promise<TestSheet> {
    console.log('loading test');
    try {
        const query = this.apollo.query<QueryResponse>({
          query: testQuery,
          forceFetch: true,
          variables: {
               uid
          }
        }).map(({data}) => data.testSheet);
        const testSheet = await query.toPromise();
        console.log('test loaded!');
        return testSheet;
  } catch (e) {
      console.log(e);
  }
}
public async createAnswerSheet(jobId, workPlaceId, uid) {
    let answerData = {
        testUid: uid,
        jobId,
        workPlaceId,
        answers: []
    };
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({
            headers,
            withCredentials: true
        });
    try {
        const response = await this.http.post('http://localhost:3000/answer',
        JSON.stringify(answerData), options).toPromise();
        return response.status === 200;
    } catch (err) {
        console.log(err);
        return false;
    }

}

  ngOnInit() {

  }

}
