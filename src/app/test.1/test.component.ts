import { Component, OnInit } from '@angular/core';
import { UserService, TestService } from '../shared';
import { jobs } from './../shared/job';
import { Router, ActivatedRoute } from '@angular/router';
import { AnswerSheet } from './../../type.d';
declare var google: any;
@Component({
  selector: 'my-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  model: any = {
    jobId : -1
  };
  error: String;
  done: boolean = false;
  hasAnswerSheet: boolean = false;
  jobs: String[];
  sub: any;
  testSheetUid: String;
  answerSheet: AnswerSheet;
  start:boolean = false;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private testService: TestService ) {

      this.sub = this.route.params.subscribe((params) => {
          console.log(params['uid']);
          this.testSheetUid = params['uid'];
      });
    }

  public selectJob( id ) {
    console.log(id);
    this.model.jobId = id;
  }

  public async initTest() {
    console.log(this.model.jobId);
    console.log(this.model.workPlaceId);

    try {
      // find done/in-progress answer sheet
      this.answerSheet = await this.testService.findAnswerSheet(this.testSheetUid);
      if (this.answerSheet) {
        // is it done ?
        this.done = false;
        //load first undone question
      } else {
        // if not create new one
        if (this.model.jobId && this.model.jobId !== -1 && this.model.workPlaceId) {
          const isCreated = await this.testService
          .createAnswerSheet(this.model.jobId, this.model.workPlaceId, this.testSheetUid);
          if (isCreated) {
            return true;
          } else {
            return false;
          }
        }
      }
      // this.router.navigate(['/question']);
    } catch (err) {
      console.log(err);

    }
  }

  public ngOnInit() {
    // Initialize the search box and autocomplete
    let searchBox: any = document.getElementById('search-box');
    let options = {
      types: [
        // return only geocoding results, rather than business results.
        'establishment'
      ],
      componentRestrictions: { country: 'th' }
    };
    let autocomplete = new google.maps.places.Autocomplete(searchBox, options);

    // Add listener to the place changed event
    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace();
      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng();
      let address = place.formatted_address;

      // this.placeChanged(lat, lng, address);
      console.log(lat, lng, address, place);
      searchBox.value = place.name;
      this.model.workPlaceId = place.id;
    });
    // load jobs list
    this.jobs = jobs.split('\n');

  }

}
