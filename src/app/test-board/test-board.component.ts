import { Component, OnInit } from '@angular/core';
import { TestService, UserService, PlaceService } from '../shared';
import { TestSheet, Question, AnswerSheet } from './../../type.d';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import * as _ from 'lodash';
const PAGE_LIMIT = 5;

@Component({
  selector: 'test-sheet-board',
  templateUrl: './test-board.component.html',
  styleUrls: ['./test-board.component.scss']
})
export class TestBoardComponent implements OnInit {
  public flip: boolean;
  public page: number = 0;
  private testSheets: TestSheet[];
  private loaded: boolean = false;
  private allAnswerSheets: AnswerSheet[][];
  private chunkAnswerSheets: AnswerSheet[] = [];
  private pid: string;
  private info: string;
  constructor(
    private testService: TestService,
    private userService: UserService,
    private placeService: PlaceService,
    private route: ActivatedRoute,
    private router: Router ) {
      this.route.params.subscribe((params) => {
            this.pid = params['pid'];
          });
    }

  public getFactorNumber(questions: Question[]) {
    let factors: string[] = [];
    for ( let question of questions) {
      if (factors.indexOf(question.factorName) === -1) {
        factors.push(question.factorName);
      }
    }
    return factors.length;
  }
  public async getPlaceName(id) {
    let place = await this.placeService.getPlace(id);
    return place.name;
  }

  public async getPastAnswerSheetByUid(uid: string) {
    this.page = 0;
    let answerSheets: AnswerSheet[] =  await this.userService.getAnswerSheetByUid(uid);
    for (let answerSheet of answerSheets) {
      if (answerSheet.workPlace) {
        answerSheet.workPlace.name = await this.getPlaceName(answerSheet.workPlace.id);
      } else {
        answerSheet.workPlace.name = 'N/A';
      }
    }
    this.allAnswerSheets = _.chunk(answerSheets, PAGE_LIMIT);
    console.log(this.allAnswerSheets);
    if (this.allAnswerSheets.length > 0) {
     this.chunkAnswerSheets = this.allAnswerSheets[this.page];
     console.log(this.chunkAnswerSheets);
    } else {
      this.chunkAnswerSheets = [];
    }

  }
  public nextPage() {
    if (this.allAnswerSheets[this.page].length >= PAGE_LIMIT
    && this.page < this.allAnswerSheets.length - 1) {
      this.page += 1;
      this.chunkAnswerSheets = this.allAnswerSheets[this.page];
    }
  }
  public previousPage() {
    if (this.page > 0) {
      this.page -= 1;
      this.chunkAnswerSheets = this.allAnswerSheets[this.page];
    }
  }
  public async ngOnInit() {
    this.loaded = false;
    // load all testSheet (no question only testSheet information)
    this.testSheets = await this.testService.getTestSheet();
    if (this.pid) {
      let place = await this.placeService.getPlace(this.pid);
      this.info = `เลือกชุดแบบสอบถามจากด้านล่าง เพื่อทำการทดสอบ "${place.name}"`;
    }
    this.loaded = true;
  }

}
