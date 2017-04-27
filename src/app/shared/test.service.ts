import {
  Injectable
} from '@angular/core';
import {
  Http,
  Headers,
  RequestOptions
} from '@angular/http';
import { Router } from '@angular/router';
// import { Observable } from 'rxjs/Observable';
// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { UserService } from './user.service';
import {
  TestSheet,
  AnswerSheet,
  Job,
  Result,
  Criteria
} from '../../type.d';
import 'rxjs/add/operator/map';
import {
  Apollo
} from 'apollo-angular';
import gql from 'graphql-tag';
import * as _ from 'lodash';

const getTestSheet = gql`
query getTestSheet{
  getTestSheet {
    title
    uid
    picture
    doneCounter
    criterias {
      factorName
      factorNameTH
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
    criterias {
      factorName
      factorNameTH
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
        min
        max
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
    private http: Http,
    private router: Router) {

  }

  public async getTestSheet(option?: { small: boolean}): Promise < TestSheet[] > {

    if (!option) {
      option = {
        small : false
      };
    }
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
    } catch (err) {
      console.log(err);
      return null;
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
    } catch (err) {
      console.log(err);
      return null;
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
  public evaluate(criteria: Criteria, value: number): string {
    // sort desc
    let _criteria = JSON.parse(JSON.stringify(criteria));
    _criteria.ranges = _.sortBy(_criteria.ranges, 'min').reverse();
    for (let range of criteria.ranges) {
      if (value > range.min) {
        return range.result;
      }
    }
  }
  public getChartData(result: Result,
                      chartLabelsOrder: any[]|string[] = _.map(result.factors, 'name'),
                      options: { method: string } = { method : 'average'}) {
    // add dataset
    let data = [];
    for (let factorLabel of chartLabelsOrder) {
      let factor = _.find(result.factors, {
        name: factorLabel
      });
      if (factor) {
        if (options.method === 'average') {
          data.push(_.round(factor.value / factor.question_counter, 2));
        } else if (options.method === 'percentage') {
          data.push(_.round(factor.value / factor.max, 2));
        }
      }
    }
    return data;
  }
  public getMaxTick(result: Result) {
    let highestValueFactor = _.maxBy(result.factors, 'max');
    return highestValueFactor.max / highestValueFactor.question_counter;

  }
  public getMinTick(result: Result) {
    let lowestValueFactor = _.minBy(result.factors, 'min');
    return lowestValueFactor.min / lowestValueFactor.question_counter;
  }

}
