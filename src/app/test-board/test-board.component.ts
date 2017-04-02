import { Component, OnInit } from '@angular/core';
import { TestService } from '../shared';
import { CookieService } from 'angular2-cookie/core';
// import { Router, ActivatedRoute } from '@angular/router';
import { TestSheet, AnswerSheet } from './../../type.d';
import { find } from 'lodash';

@Component({
  selector: 'test-sheet-board',
  templateUrl: './test-board.component.html',
  styleUrls: ['./test-board.component.scss']
})
export class TestBoardComponent implements OnInit {
  testSheets: TestSheet[];
  loaded: boolean = false;

  constructor(
    private testService: TestService,
    private _cookieService: CookieService ) {}


  public getAnswerSize(testSheetUid) {
    let answerSheet: AnswerSheet = this._cookieService.getObject('answerSheet.' + testSheetUid);
    if (answerSheet) {
      return answerSheet.answers.length;
    }
    return 0;
  }

  public async ngOnInit() {
    this.loaded = false;
    // load all testSheet (no question only testSheet information)
    this.testSheets = await this.testService.getTestSheet();

    this.loaded = true;
  }

}
