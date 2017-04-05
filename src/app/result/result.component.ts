import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { TestService, UserService } from '../shared';
import { Observable } from 'rxjs/Observable';
import { DOCUMENT } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AnswerSheet, TestSheet, Answer } from './../../type.d';
import { CookieService } from 'angular2-cookie/core';
import { PageScrollService, PageScrollInstance, PageScrollConfig } from 'ng2-page-scroll';
import { find } from 'lodash';
@Component({
  selector: 'my-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  error: String;
  sub: any;
  public testSheetUid: String;
  public answerSheets: AnswerSheet[] = [];

  testSheet: TestSheet;
  loaded: boolean = false;
  // Radar
  public radarChartLabels: string[] = [];

  public radarChartData: any = [
    {data: [], label: 'Your result'}
    // {data: [28, 48, 40, 19, 96, 27, 100], label: 'Series B'}
  ];
  public radarChartType:string = 'radar';

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
 
  public chartHovered(e:any):void {
    console.log(e);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    private userService: UserService) {

     this.route.params.subscribe((params) => {
          // console.log(params['uid']);
          this.testSheetUid = params['uid'];
      });

    }
  //   @HostListener('window:scroll', [])
  //   onWindowScroll() {
  //       let scrollPos = this.document.body.scrollTop;
  // }

  public async ngOnInit() {
    this.loaded = false;
    try {

        this.testSheet = await this.testService.getTestSheetByUid(this.testSheetUid);
        // console.log(JSON.stringify(this.testSheet));
        // load answer sheet by requested uid (recently submit by user)
        let answerSheets = await this.testService.getAnswerSheetByUid(this.testSheetUid);
        if (answerSheets && answerSheets.length > 0) {
          // sort by date
          answerSheets = answerSheets.sort( (a, b) => {
           return (b.createdAt - a.createdAt);
          });
          this.answerSheets = answerSheets;
          // console.log(`answer sheet is : ${JSON.stringify(this.answerSheets)}`);

          let factorCount = [];
          for (let answer of this.answerSheets[0].answers) {
            let question = find(this.testSheet.questions, { id: answer.questionId });
            let index = this.radarChartLabels.indexOf(question.factor);
            if (index < 0) {
              this.radarChartLabels.push(question.factor);
              this.radarChartData[0].data.push(0);
              factorCount.push(0);
              index = this.radarChartLabels.length - 1;
            }
            factorCount[index] += 1;
            let chosenChoice = find(question.choices, { id: answer.selectedChoiceId });
            this.radarChartData[0].data[index] += chosenChoice.value;

          }
          // find average and round
          for (let i = 0; i < this.radarChartData[0].data.length; i++) {
            this.radarChartData[0].data[i] /= factorCount[i];
            this.radarChartData[0].data[i] = this.radarChartData[0].data[i].toFixed(3);
            
          }
        } else {
          this.error = `Sorry, answer sheet (uid=${this.testSheetUid}) wasn't found`;
        }



    } catch (err) {
      console.log(err);

    }
    this.loaded = true;

  }
}
