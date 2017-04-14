import { Component, OnInit, Inject } from '@angular/core';
import { TestService, UserService } from '../shared';
import { DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerSheet, TestSheet, Answer } from './../../type.d';
import { CookieService } from 'angular2-cookie/core';
import { PageScrollService, PageScrollInstance, PageScrollConfig } from 'ng2-page-scroll';

import { find } from 'lodash';
@Component({
  selector: 'my-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  public testSheetUid: string;
  public answerSheet: AnswerSheet;
  private error: string;
  private userId: string;

  private testSheet: TestSheet;
  private start: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    @Inject(DOCUMENT) private document: Document,
    private pageScrollService: PageScrollService,
    private _cookieService: CookieService,
    private userService: UserService) {

     this.route.params.subscribe((params) => {
          this.testSheetUid = params['uid'];
      });
     PageScrollConfig.defaultDuration = 500;
     PageScrollConfig.defaultScrollOffset = 200;
     PageScrollConfig.defaultEasingLogic = {
        ease: (t: number, b: number, c: number, d: number): number => {
                // easeInOutExpo easing
                if (t === 0) return b;
                if (t === d) return b + c;
                if ((t /= d / 2) < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;
                return c / 2 * (-Math.pow(2, -10 * --t) + 2) + b;
            }
        };
    }

  public jump(index) {
    let pageScrollInstance: PageScrollInstance = PageScrollInstance.simpleInstance(this.document, '#q' + index);
    this.pageScrollService.start(pageScrollInstance);
  }

  public getAnswerByQid(qid: string): Answer {
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

  public async saveAnswer(newAnswer) {
      const userId = await this.userService.getUserId();
      let answer = find(this.answerSheet.answers, { questionId: newAnswer.questionId} );
      if (!answer) {
        this.answerSheet.answers.push({
          questionId: newAnswer.questionId,
          selectedChoiceId: newAnswer.choiceId
        });
      } else {
        answer.selectedChoiceId = newAnswer.choiceId;
      }
      // save to cookie
      this._cookieService.putObject(userId + '.' + newAnswer.questionId, newAnswer.choiceId );

      // done flag
      if (this.testSheet.questions.length === this.answerSheet.answers.length) {
        this.answerSheet.done = true;
      }
  }

  public async submitAnswerSheet() {
    // if (!this.answerSheet.done) {
    //   this.error = 'Please answer every questions';
    //   return false;
    // }
    let newAnswerSheet = await this.testService.submitAnswerSheet(this.answerSheet);
    if (newAnswerSheet) {
      const userId = await this.userService.getUserId();
      for (let question of this.testSheet.questions) {
        this._cookieService.remove(userId + '.' + question.id);
      }
      this.router.navigate(['/result', this.testSheetUid]);
      return true;
    }
    this.error = 'Cannot submit your answer, please try again';
    return false;
  }

  public async ngOnInit() {
    this.start = false;
    try {
      // load test sheet
      this.userId = await this.userService.getUserId();
      this.testSheet = await this.testService.getTestSheetByUid(this.testSheetUid);
      if (!this.testSheet) {
        this.error = 'Test sheet not found';
      }
      const userId: string = await this.userService.getUserId();

      // reload unsubmited answer from cookie
      this.answerSheet = {
            testSheetUid: this.testSheetUid,
            userId,
            done: false,
            answers: []
          };
      for (let question of this.testSheet.questions) {
          let answer: string = this._cookieService.getObject( userId + '.' + question.id);
          if (answer) {
            this.answerSheet.answers.push({
              questionId: question.id,
              selectedChoiceId: answer
            });
          }
          // done flag
          if (this.testSheet.questions.length === this.answerSheet.answers.length) {
            this.answerSheet.done = true;
          }
      }
      this.start = true;
    } catch (err) {
      console.log(err);
    }

  }
}
