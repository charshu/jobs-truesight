import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Question, Answer } from './../../type.d';
import { TestService } from '../shared';

@Component({
  selector: 'my-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss']
})
export class QuestionComponent implements OnInit {
  sub: any;
  select: Number = -1;
  @Input() question: Question;
  @Input() answer: Answer;
  @Input() number: Number;
  @Output() clickChoice = new EventEmitter();

  constructor(private testService: TestService){}
  emitNewAnswer(questionId, choiceId) {
    this.clickChoice.emit({
      questionId,
      choiceId
    });
  }
  ngOnInit() {
    // get questions from testSheet
    console.log(this.answer);
  }

}
