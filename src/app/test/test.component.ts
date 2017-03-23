import { Component, OnInit } from '@angular/core';
import { UserService, TestService } from '../shared';
import { jobs } from './../shared/job';
import { Router, ActivatedRoute } from '@angular/router';

declare var google: any;
@Component({
  selector: 'my-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit {
  jobs: String[];
  sub: any;
  testSheet: any;
  testSheetUid: String;
  JobId: String;
  workPlaceId: String;

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
  initTest(){
    console.log(this.JobId);
    console.log(this.workPlaceId);
    this.testService.createAnswerSheet(this.JobId, this.workPlaceId, this.testSheetUid);
  }

  ngOnInit() {
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
      this.workPlaceId = place.id;
    });
    // load jobs list
    this.jobs = jobs.split('\n');
    // load test data
    this.testSheet = this.testService.loadTestSheet(this.testSheetUid);
  }

}
