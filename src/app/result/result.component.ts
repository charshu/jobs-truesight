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
  public answerSheet: AnswerSheet;

  testSheet: TestSheet;
  loaded: boolean = false;

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
        // load answer sheet by requested uid (recently submit by user)
        
    } catch (err) {
      console.log(err);

    }
    this.loaded = true;

  }
}
