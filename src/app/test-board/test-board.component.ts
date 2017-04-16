import { Component, OnInit } from '@angular/core';
import { TestService } from '../shared';
import { CookieService } from 'angular2-cookie/core';
import { TestSheet } from './../../type.d';

@Component({
  selector: 'test-sheet-board',
  templateUrl: './test-board.component.html',
  styleUrls: ['./test-board.component.scss']
})
export class TestBoardComponent implements OnInit {
  public flip: boolean;

  private testSheets: TestSheet[];
  private loaded: boolean = false;

  constructor(
    private testService: TestService,
    private _cookieService: CookieService ) {}

  public getFactorNumber(questions) {
    let factors: string[] = [];
    for ( let question of questions) {
      if (factors.indexOf(question.factorName) === -1) {
        factors.push(question.factorName);
      }
    }
    return factors.length;
  }

  public async ngOnInit() {
    this.loaded = false;
    // load all testSheet (no question only testSheet information)
    this.testSheets = await this.testService.getTestSheet();

    this.loaded = true;
  }

}
