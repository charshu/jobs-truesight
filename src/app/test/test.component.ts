import { Component, OnInit } from '@angular/core';
import { TestService } from '../shared';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { AnswerSheet, TestSheet, Answer } from './../../type.d';
import { find } from 'lodash';
@Component({
  selector: 'my-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {

  error: String;
  sub: any;
  public testSheetUid: String;
  public answerSheet: AnswerSheet;
  _answerSheet: Observable<AnswerSheet>;
  testSheet: TestSheet;
  start: boolean = false;
  loaded: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private testService: TestService ) {

     this.route.params.subscribe((params) => {
          // console.log(params['uid']);
          this.testSheetUid = params['uid'];
      });

    }

  public findAnswerByQid(qid: Number): Answer {
      let answer = find(this.answerSheet.answers, {questionId: qid});
      if (answer) {
        return answer;
      }
      let newAnswer: Answer = {
        questionId: qid,
        selectedChoiceId: null
      };
      return  newAnswer;
  }
  public saveAnswer(answer) {
      console.log('save answer : ', JSON.stringify(answer));
      this.testService.saveAnswer(this.testSheetUid, answer);
  }

  public async ngOnInit() {
    console.log('init test sheet');
    this.start = false;
    try {
      this.testSheet = await this.testService.getTestSheetByUid(this.testSheetUid);
      console.log(this.testSheet);
      if (!this.testSheet) {
        this.error = 'Test sheet not found';
      }
      // find done/in-progress answer sheet
      let answerSheet = await this.testService.getAnswerSheetByUid(this.testSheetUid, false);
      console.log(answerSheet);
      if (!answerSheet) {
        this.answerSheet = answerSheet[0];
        let isCreated = await this.testService.createAnswerSheet(this.testSheetUid);
        if (isCreated) {
            this.answerSheet = await this.testService.getAnswerSheetByUid(this.testSheetUid, false)[0];
            this.start = true;
          } else {
            this.start = false;
            this.error = 'Can\'t create answer sheet';
          }

      } else {
        this.answerSheet = answerSheet[0];
        this.start = true;
      }

      // autosave answers
      this._answerSheet = Observable.of(this.answerSheet);
      this.sub = this._answerSheet.subscribe( (_answerSheet) => {
          console.log('answer changed');
          console.log(_answerSheet);
        });

    } catch (err) {
      console.log(err);

    }

  }
}
