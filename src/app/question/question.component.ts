import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Question, Answer } from './../../type.d';

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

  emitNewAnswer(questionId, choiceId) {
    if (this.answer.selectedChoiceId === choiceId) {
      // same answer
      return;
    }
    this.clickChoice.emit({
      questionId,
      choiceId
    });
  }
  ngOnInit() {
    // get questions from testSheet
    // console.log(this.answer);
  }

}
