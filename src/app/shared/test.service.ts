import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
// import { Router } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { UserService } from './user.service';
import { TestSheet, AnswerSheet } from '../../type.d';
import 'rxjs/add/operator/map';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
// import { find } from 'lodash';

const testSheetQuery = gql`
query getTestSheet{
  getTestSheet {
    title
    uid
    questions {
      id
      factor
      title
      choices {
        id
        title
        value
      }
    }
  }
}    
`;
const testSheetQuery2 = gql`
query getTestSheetByUid($uid: String!){
  getTestSheetByUid(uid:$uid) {
    title
    uid
    questions {
      id
      factor
      title
      choices {
        id
        title
        value
      }
    }
  }
}    
`;
const answerSheetQuery = gql`
query getAnswerSheet{
  getAnswerSheet {
  testSheetUid
    userId
    jobId
    workPlaceId
    done
    answers {
      questionId
      selectedChoiceId
    }
  }
}    
`;
const answerSheetQuery2 = gql`
query getAnswerSheetByUid($testSheetUid: String!,$done: Boolean){
  getAnswerSheetByUid(testSheetUid:$testSheetUid,done:$done) {
  testSheetUid
    userId
    jobId
    workPlaceId
    done
    answers {
      questionId
      selectedChoiceId
    }
  }
}    
`;
const saveAnswerMutation = gql`
mutation saveAnswer($testSheetUid: String!, $questionId:Int!,$choiceId:String!){
  saveAnswer(testSheetUid:$testSheetUid,questionId:$questionId,choiceId:$choiceId){
    testSheetUid
    userId
    jobId
    workPlaceId
    done
    answers {
      questionId
      selectedChoiceId
    }
  }
}
`;
interface QueryResponse {
  getTestSheet: TestSheet[];
  getTestSheetByUid: TestSheet;
  getAnswerSheet: AnswerSheet[];
  getAnswerSheetByUid: AnswerSheet[];
  saveAnswer: AnswerSheet[];
}

@Injectable()
export class TestService implements OnInit {

  constructor(
      private apollo: Apollo,
      private http: Http) {

  }

  public async getTestSheet(): Promise<TestSheet[]> {
    console.log('Loading test');
    try {
        const query = this.apollo.query<QueryResponse>({
          query: testSheetQuery,
          forceFetch: true
        }).map(({data}) => data.getTestSheet);
        const testSheets = await query.toPromise();
        console.log('Test loaded!');

        return testSheets;
    } catch (e) {
        console.log(e);
    }
}
public async getTestSheetByUid(uid?: String): Promise<TestSheet> {
    console.log('Loading test');
    try {
        const query = this.apollo.query<QueryResponse>({
          query: testSheetQuery2,
          forceFetch: true,
          variables: {
               uid
          }
        }).map(({data}) => data.getTestSheetByUid);
        const testSheet = await query.toPromise();
        console.log('Test loaded!');

        return testSheet;
    } catch (e) {
        console.log(e);
    }
}
  public async getAnswerSheet(): Promise<AnswerSheet[]> {

    try {
        const query = this.apollo.query<QueryResponse>({
        query: answerSheetQuery,
        forceFetch: true
      }).map(({data}) => data.getAnswerSheet);
        const answerSheets = await query.toPromise();
        console.log('Answer sheet loaded!');
        return answerSheets;
    } catch (e) {
        console.log(e);
    }
}
public async getAnswerSheetByUid(testSheetUid?: String, done?: Boolean): Promise<AnswerSheet[]> {
  console.log('Getting answer sheet by uid');
  try {
        const query = this.apollo.query<QueryResponse>({
        query: answerSheetQuery2,
        forceFetch: true,
        variables: {
            testSheetUid,
            done
        }
      }).map(({data}) => data.getAnswerSheetByUid);
        const answerSheets = await query.toPromise();
        console.log(answerSheets);
        console.log('Answer sheet loaded!');
        return answerSheets;
    } catch (e) {
        console.log(e);
    }
}
public async createAnswerSheet(testSheetUid): Promise<Boolean> {
    let answerData = {
        testSheetUid,
        answers: []
    };
    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({
            headers,
            withCredentials: true
        });
    try {
        const response = await this.http.post('http://localhost:3000/test/answer',
        JSON.stringify(answerData), options).toPromise();
        return response.status === 200;
    } catch (err) {
        console.log(err);
    }

}
public async saveAnswer(testSheetUid, answer) {
  try {
        const mutation = this.apollo.mutate<QueryResponse>({
        mutation: saveAnswerMutation,
        variables: {
            testSheetUid,
            questionId: answer.questionId,
            choiceId : answer.choiceId
        }
      }).map(({data}) => data.saveAnswer);
        const answerSheet = await mutation.toPromise();
        console.log(answerSheet);
        console.log('Answer sheet saved!');
        return answerSheet;
    } catch (e) {
        console.log(e);
    }
}

  ngOnInit() {

  }

}
