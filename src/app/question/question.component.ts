import { Component, OnInit } from '@angular/core';
import { UserService, TestService } from '../shared';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'my-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  jobs: String[];
  sub: any;
  test: any;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService ) {

      this.sub = this.route.params.subscribe((params) => {
          console.log(params['qid']);
      });
    }

  ngOnInit() {
    // get questions from testSheet

  }

}
