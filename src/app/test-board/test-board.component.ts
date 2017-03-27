import { Component, OnInit } from '@angular/core';
import { UserService, TestService } from '../shared';
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
  answerSheets: AnswerSheet[];
  loaded: boolean = false;
  constructor(
    private testService: TestService ) {

    }
  public findAnswerSheet(testSheetUid) {
    return find(this.answerSheets, { testSheetUid });
  }

  public answerSize(testSheetUid) {
    let answerSheet = this.findAnswerSheet(testSheetUid);
    if (answerSheet) {
      let size = this.findAnswerSheet(testSheetUid).answers.length;
      return size > 0 ? size : 0;
    }
    return -1;
  }

  public async ngOnInit() {
    this.loaded = false;
    // load all testSheet (no question only testSheet information)
    this.testSheets = await this.testService.getTestSheet();
    // load answer sheet
    this.answerSheets = await this.testService.getAnswerSheet();

    this.loaded = true;
  }

}
