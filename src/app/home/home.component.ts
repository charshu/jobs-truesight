import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared';


@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private userService: UserService) {}

  ngOnInit() {
    console.log('Hello Home');
  }

}
