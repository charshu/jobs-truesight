import {
  Component,
  OnInit,
  Inject
} from '@angular/core';
import {
  TestService,
  UserService,
  PlaceService
} from '../shared';
import {
  DOCUMENT
} from '@angular/platform-browser';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  AnswerSheet,
  TestSheet,
  Answer,
  Job
} from './../../type.d';
import {
  CookieService
} from 'angular2-cookie/core';
import {
  PageScrollService,
  PageScrollInstance,
  PageScrollConfig
} from 'ng2-page-scroll';
import {
  find
} from 'lodash';
declare var google: any;

@Component({
  selector: 'my-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  public testSheetUid: string;
  public answerSheet: AnswerSheet = {
    testSheetUid: null,
      job: {
        id: null
      },
      workPlace: {
        id: null
      },
      salary: null,
      done: false,
      answers: []
  };
  private jobs: Job[];
  private error: string;
  private pid: string;
  private user: any = {
    profile: {
      job: {
        id: -1
      },
      workPlaceId: null,
      workPlaceName: null
    }
  };

  private testSheet: TestSheet;
  private start: boolean = false;
  private jobId: number;
  private workPlaceId: string;
  private workPlaceName: string;
  private salary: number;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService,
    @Inject(DOCUMENT) private document: Document,
    private pageScrollService: PageScrollService,
    private _cookieService: CookieService,
    private userService: UserService,
    private placeService: PlaceService) {

    this.route.params.subscribe((params) => {
      this.testSheetUid = params['uid'];
      this.pid = params['pid'];
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
    let answer = find(this.answerSheet.answers, {
      questionId: qid
    });
    if (answer) {
      return answer;
    }
    let newAnswer: Answer = {
      questionId: qid,
      selectedChoiceId: null
    };
    return newAnswer;
  }

  public async saveAnswer(newAnswer) {
    const userId = await this.userService.getUserId();
    let answer = find(this.answerSheet.answers, {
      questionId: newAnswer.questionId
    });
    if (!answer) {
      this.answerSheet.answers.push({
        questionId: newAnswer.questionId,
        selectedChoiceId: newAnswer.choiceId
      });
    } else {
      answer.selectedChoiceId = newAnswer.choiceId;
    }
    let expire: Date = new Date();
    expire.setHours(expire.getHours() + 3);
    // save to cookie
    this._cookieService.putObject(userId + '.' + newAnswer.questionId, newAnswer.choiceId, {
      expires: expire
    });

    // done flag
    if (this.testSheet.questions.length === this.answerSheet.answers.length) {
      this.answerSheet.done = true;
    }
  }

  public async submitAnswerSheet() {
    if (!this.answerSheet.done) {
      this.error = 'คุณยังตอบคำถามไม่ครบทุกข้อ';
      return false;
    } else if (!this.jobId) {
      this.error = 'คุณยังไม่ได้เลือกอาชีพที่ต้องการทดสอบ';
      this.document.body.scrollTop = 0;
      return false;
    } else if (!this.workPlaceId) {
      this.error = 'คุณยังไม่ได้เลือกสถานที่ทำงานที่ต้องการทดสอบ';
      this.document.body.scrollTop = 0;
      return false;
    } else if (!this.salary) {
      this.error = 'คุณยังไม่ได้กรอกช่องเงินเดือนที่คุณได้รับ';
      this.document.body.scrollTop = 0;
      return false;
    }
    this.answerSheet.testSheetUid = this.testSheetUid;
    this.answerSheet.job.id = this.jobId;
    this.answerSheet.workPlace.id = this.workPlaceId;
    this.answerSheet.salary = this.salary;
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
    /*
      loading jobs list
    */
    this.jobs = await this.testService.getJobsChoice();


    /*
      get user data
    */
    let user = await this.userService.getCurrentUser();
    this.user = user;
    if (!user) {
      this.userService.redirectUrl = this.router.url;
      console.log(this.router.url);
      this.router.navigate(['/login']);
      return;
    }

    /*
      init information of answer sheet
      when specify PID in route url then use this value as default value
      if PID does not specify use user's profile as default value
    */
    if (this.pid) {
      let place = await this.placeService.getPlace(this.pid);
      this.workPlaceId = this.pid;
      this.workPlaceName = place.name;
    } else if (user.profile) {
      let place = await this.placeService.getPlace(user.profile.workPlaceId);
      this.workPlaceId = user.profile.workPlaceId;
      this.workPlaceName = place.name;
      this.salary = user.profile.salary;
      this.jobId = user.profile.job.id;
    }

    /*
      loading test sheet
    */
    this.testSheet = await this.testService.getTestSheetByUid(this.testSheetUid);

    if (!this.testSheet) {
      this.router.navigate(['404']);
      return;
    }

    /*
      reload unsubmited answer from cookie
    */

    for (let question of this.testSheet.questions) {
      let answer: any = this._cookieService.getObject(user.id + '.' + question.id);
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

    let searchBox: any = document.getElementById('search-box');
    let options = {
      types: [
        'establishment'
      ],
      componentRestrictions: {
        country: 'th'
      }
    };
    let autocomplete = new google.maps.places.Autocomplete(searchBox, options);

    autocomplete.addListener('place_changed', async() => {
      const place = await autocomplete.getPlace();
      console.log(place);
      searchBox.value = place.name;
      console.log('change work place name', this.user.profile.workPlaceName);
      this.workPlaceId = place.place_id;
      console.log('change work place id', this.user.profile.workPlaceId);
    });

  }
}