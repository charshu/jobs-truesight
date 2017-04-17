import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import {
    Subscription
} from 'rxjs';
import {
  UserService,
  TestService,
  PlaceService
} from '../shared';
import {
  User,
  WorkPlace,
  TestSheet
} from '../../type.d';
import { indexOf, find } from 'lodash';
declare var google: any;
const MIN_LOADING_TIME = 1000;

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public workPlace: WorkPlace;
  public place: any;
  private loaded: boolean;
  private searchLoaded: boolean = true;
  private user: User;
  private selectedJob: number;
  private testSheetList: [{
    uid: string,
    title: string
  }];
  private jobList: [{
    id: number,
    name: string
  }];
  private placeId: string = null;
  private coverUrl: string = '/img/cover.jpg';
  private hasResult: boolean = false;
  private jobChoices: any;
  private sub: Subscription;
  private testSheets: TestSheet[];
  constructor(
    private userService: UserService,
    private placeService: PlaceService,
    private testService: TestService) {}

  public getTestSheetList(results, jobId?) {
      /*
        set up unique test sheet list for selector
      */
      let testSheetList: any = [];
      let testSheetSet: string[] = [];
      for (let result of results) {
        if (jobId && jobId !== result.jobId) {
          continue;
        }
        let testSheet = find(this.testSheets, { uid : result.testSheetUid});
        if (indexOf(testSheetSet, testSheet.title) === -1) {
            testSheetSet.push(testSheet.title);
            testSheetList.push({ uid: testSheet.uid, title: testSheet.title});
        }
      }
      console.log('return unique test sheet list\n', testSheetList);
      return testSheetList;
  }
  public getJobList(results, testSheetUid?) {
      let jobList: [{
        id: number,
        name: string
      }];
      let jobSet = [];
      for (let result of results) {
        if (testSheetUid && testSheetUid !== result.testSheetUid) {
          continue;
        }
        let job = result.job;
        if (indexOf(jobSet, job.name) === -1) {
            jobSet.push(job.name);
            jobList.push({ id: job.id, name: job.name});
        }
      }
      console.log('return unique job list\n', jobList);
      return jobList;
  }
  public async searchWorkPlace(placeId: string) {
    try {
      if (!placeId) {
        placeId = 'ChIJg3T4J4-e4jARWboW-tZ3nok';
      }
      this.hasResult = true;
      this.searchLoaded = false;
      this.workPlace = await this.placeService.getWorkPlace(placeId);
      this.testSheetList = this.getTestSheetList(this.workPlace.results);

      this.place = await this.placeService.getPlace(this.workPlace.id);

      // minimum loading time 1s
      setTimeout( () => {
        this.searchLoaded = true;
      }, MIN_LOADING_TIME);
    } catch (e) {
      console.log(e);
    }
  }

  public onChangeTestSheet(uid) {
    console.log('change test sheet uid: ' + uid);
    this.jobList = this.getJobList(this.workPlace.results, uid);
    // let workPlaceResult = find(this.workPlace.results, {
    //       testSheetUid: this.testSheetUid,
    //       jobId
    //     });
    // if (workPlaceResult) {
    //       this.pushData(workPlaceResult, 'Your Co-worker');
    //     }
  }
  public onChangeJob(jobId) {
    console.log('change job id: ' + jobId);
    this.testSheetList = this.getTestSheetList(this.workPlace.results, jobId);
    // let workPlaceResult = find(this.workPlace.results, {
    //       testSheetUid: this.testSheetUid,
    //       jobId
    //     });
    // if (workPlaceResult) {
    //       this.pushData(workPlaceResult, 'Your Co-worker');
    //     }
  }


  public async ngOnInit() {
    this.testSheets = await this.testService.getTestSheet({ small : true });
    this.sub = this.userService.getObservableUser().subscribe((user) => {
                this.user = user;
        });
    console.log(this.user);

    this.loaded = true;
    // Initialize the search box and autocomplete
    let searchBox: any = document.getElementById('search-box');
    let options = {
      types: [
        // return only geocoding results, rather than business results.
        'establishment'
      ],
      componentRestrictions: {
        country: 'th'
      }
    };
    let autocomplete = new google.maps.places.Autocomplete(searchBox, options);

    // Add listener to the place changed event
    autocomplete.addListener('place_changed', () => {
      console.log('place changed');
      let place = autocomplete.getPlace();
      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng();
      let address = place.formatted_address;
      searchBox.value = place.name;
      if (place.place_id) {
        this.placeId = place.place_id;
      }

    });
  }
  public ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
