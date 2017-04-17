import {
  Injectable
} from '@angular/core';
import {
  Http,
  Headers,
  RequestOptions
} from '@angular/http';
// import { Router } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { UserService } from './user.service';
import {
  TestSheet,
  AnswerSheet,
  Job,
  Result,
  WorkPlace
} from '../../type.d';
import 'rxjs/add/operator/map';
import {
  Apollo
} from 'apollo-angular';
import gql from 'graphql-tag';
// import { find } from 'lodash';

const getTestSheet = gql`
query getTestSheet{
  getTestSheet {
    title
    uid
    picture
    doneCounter
    criterias {
      factorName
      ranges {
        min
        result
      }
    }
    questions {
      id
      factorName
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
const getTestSheetSmall = gql`
query getTestSheet{
  getTestSheet {
    uid
    title
  }
}    
`;
const getTestSheetByUid = gql`
query getTestSheetByUid($uid: String!){
  getTestSheetByUid(uid:$uid) {
    title
    uid
    picture
    doneCounter
    questions {
      id
      factorName
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
const getAnswerSheet = gql`
query getAnswerSheet{
  getAnswerSheet {
  testSheetUid
    gender
    age_range
    jobId
    workPlaceId
    salary
    done
    answers {
      questionId
      selectedChoiceId
    }
  }
}    
`;
const getAnswerSheetByUid = gql`
query getAnswerSheetByUid($testSheetUid: String!){
  getAnswerSheetByUid(testSheetUid:$testSheetUid) {
    testSheetUid
    gender
    age_range
    jobId
    workPlaceId
    salary
    createdAt
    updatedAt
    answers {
      questionId
      selectedChoiceId
    }
  }
}    
`;
const getJobsChoice = gql`
query getJobsChoice{
  getJobsChoice {
    id
    name
  }
}    
`;
const getJob = gql`
query getJob($id:Int!){
  getJob(id:$id) {
    name
		answerSheets{
      testSheetUid
        job {
        name
        results {
          testSheetUid
          factors {
            name
            value
            question_counter
          }
        }
      }
      workPlace {
        id
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
  getTestSheet: TestSheet[];
  getTestSheetByUid: TestSheet;
  getAnswerSheet: AnswerSheet[];
  getAnswerSheetByUid: AnswerSheet[];
  getJobsChoice: Job[];
  getJob: Job;
}

@Injectable()
export class TestService {

  constructor(
    private apollo: Apollo,
    private http: Http) {

  }

  public async getTestSheet(option?: { small: boolean}): Promise < TestSheet[] > {
    try {
      const query = this.apollo.query < QueryResponse > ({
        query: option.small ? getTestSheetSmall : getTestSheet,
        forceFetch: true
      }).map(({
        data
      }) => data.getTestSheet);
      const testSheets = await query.toPromise();
      console.log('Get all TestSheet\n', testSheets);
      return testSheets;
    } catch (e) {
      console.log(e);
    }
  }

  public async getTestSheetByUid(uid ?: String): Promise < TestSheet > {
    try {
      const query = this.apollo.query < QueryResponse > ({
        query: getTestSheetByUid,
        forceFetch: true,
        variables: {
          uid
        }
      }).map(({
        data
      }) => data.getTestSheetByUid);
      const testSheet = await query.toPromise();
      console.log(`TestSheet uid: ${uid} \n`, testSheet);
      return testSheet;
    } catch (e) {
      console.log(e);
    }
  }
  public async getAnswerSheet(): Promise < AnswerSheet[] > {

    try {
      const query = this.apollo.query < QueryResponse > ({
        query: getAnswerSheet,
        forceFetch: true
      }).map(({
        data
      }) => data.getAnswerSheet);
      const answerSheets = await query.toPromise();
      console.log('Answer sheet loaded!');
      return answerSheets;
    } catch (e) {
      console.log(e);
    }
  }
  public async getAnswerSheetByUid(testSheetUid: String): Promise < AnswerSheet[] > {
    console.log('Getting answer sheet by uid');
    try {
      const query = this.apollo.query < QueryResponse > ({
        query: getAnswerSheetByUid,
        forceFetch: true,
        variables: {
          testSheetUid
        }
      }).map(({
        data
      }) => data.getAnswerSheetByUid);
      const answerSheets = await query.toPromise();
      if (answerSheets) {
        return JSON.parse(JSON.stringify(answerSheets));
      }
      return [];
    } catch (e) {
      console.log(e);
    }
  }
  public async submitAnswerSheet(answerSheet): Promise < AnswerSheet > {

    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    let options = new RequestOptions({
      headers,
      withCredentials: true
    });
    try {
      const newAnswerSheet = await this.http.post('http://localhost:3000/test/answer',
        JSON.stringify(answerSheet), options).map((res) => res.json()).toPromise();
      console.log('submit answer sheet complete!');
      return newAnswerSheet;
    } catch (err) {
      console.log(err);
    }

  }

  public async getJobsChoice(): Promise < Job[] > {
    try {
      const query = this.apollo.query < QueryResponse > ({
        query: getJobsChoice,
        forceFetch: true
      }).map(({
        data
      }) => data.getJobsChoice);
      const jobs = await query.toPromise();
      return jobs;
    } catch (e) {
      console.log(e);
    }
  }
  public async getJob(id: number): Promise < Job > {
    try {
      const query = this.apollo.query < QueryResponse > ({
        query: getJob,
        forceFetch: true,
        variables: {
          id
        }
      }).map(({
        data
      }) => data.getJob);
      const job = await query.toPromise();
      return job;
    } catch (e) {
      console.log(e);
    }
  }

}
