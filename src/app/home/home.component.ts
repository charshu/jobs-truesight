import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild
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
  TestSheet,
  Result,
  Factor
} from '../../type.d';
import {
  BaseChartDirective
} from 'ng2-charts/ng2-charts';
import * as _ from 'lodash';
declare var google: any;
const MIN_LOADING_TIME = 1000;
const JobEnum = {
  NO_JOB: -1,
  ALL_JOB: 0
};

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
  private chartLoaded: boolean = false;
  private user: User;
  private selectedJob: number = JobEnum.ALL_JOB;
  private selectedTestSheet: string;
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
  private averageAge: any = 0;
  // Radar
  private radarChartLabels: string[] = [];

  private radarChartData: any = [{
      data: [],
      label: 'You'
    }
  ];
  private radarChartType: string = 'radar';
  private radarChartOptions = {
    scale: {
      ticks: {
        beginAtZero: true,
        backdropColor: '#FFF',
        showLabelBackdrop: false,
        max: undefined,
        min: undefined
      }
    },
    legend: {
      display: true,
      position: 'bottom'
    },
    responsive: true,
    maintainAspectRatio: false
  };

  @ViewChild(BaseChartDirective)
  public chart: BaseChartDirective;

  public barChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
    scales: {
            xAxes: [{
                ticks: {
                    max: 100,
                    min: 0,
                    stepSize: 10
                }
            }]
        }
  };
  public barChartLabels: string[] = [];
  public barChartType: string = 'horizontalBar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [];

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  constructor(
    private userService: UserService,
    private placeService: PlaceService,
    private testService: TestService) {}

  public getTestSheetList(results: Result[], jobId: number = JobEnum.ALL_JOB) {
      /*
        set up unique test sheet list for selector
      */
      jobId = Number(jobId);
      let testSheetList: any = [];
      let testSheetSet: string[] = [];
      for (let result of results) {
        if (!result.job) {
          continue;
        }
        if (jobId !== result.job.id && jobId !== JobEnum.ALL_JOB) {
          continue;
        }
        let testSheet = _.find(this.testSheets, { uid : result.testSheetUid});
        if (_.indexOf(testSheetSet, testSheet.title) === -1) {
            testSheetSet.push(testSheet.title);
            testSheetList.push({ uid: testSheet.uid, title: testSheet.title});
        }
      }
      console.log('return unique test sheet list\n', testSheetList);
      return testSheetList;
  }
  public getJobList(results, testSheetUid?) {
      let jobList: any = [];
      let jobSet = [];
      for (let result of results) {
        if (testSheetUid && testSheetUid !== result.testSheetUid) {
          continue;
        }
        if (!result.job) {
          continue;
        }
        let job = result.job;
        if (_.indexOf(jobSet, job.name) === -1) {
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
      if (this.workPlace) {
        this.averageAge = _.round(_.mean(this.workPlace.participant.ages), 2);
        this.testSheetList = this.getTestSheetList(this.workPlace.results);
      }
      this.place = await this.placeService.getPlace(placeId);
       // minimum loading time 1s
      setTimeout( () => {
        this.searchLoaded = true;
      }, MIN_LOADING_TIME);
    } catch (e) {
      console.log(e);
    }
  }

  public findAndMergeResult(results: Result[], selectedTestSheet: string, selectedJob: number): Result {
    let copy_results = JSON.parse(JSON.stringify(results));
    selectedJob = Number(selectedJob);
    let _results;
    console.log('copy_result: ', copy_results);
    console.log('ts: ' + selectedTestSheet + ' sj: ' + selectedJob);
    if (selectedJob === JobEnum.ALL_JOB) {
      _results = _.filter(copy_results, { testSheetUid: selectedTestSheet });
    } else {
      _results = _.filter(copy_results, { testSheetUid: selectedTestSheet,
        job: { id: selectedJob }});
    }
    console.log('filtered results ', _results);
    let mergedFactors: Factor[] = [];
    if (_results.length > 1) {
      _.forEach(_results, (result) => {
          _.forEach(result.factors, (factor) => {
            let _factor = JSON.parse(JSON.stringify(factor));
            let found = _.find(mergedFactors, { name : factor.name});
            if (!found) {
              console.log('push-> name: ' + _factor.name + ' value: ' + _factor.value
              + '/' + _factor.max);
              mergedFactors.push(_factor);
            } else {
              found.value += _factor.value;
              found.max += _factor.max;
              found.min += _factor.min;
              console.log('update-> name: ' + found.name + ' value: ' + found.value
              + '/' + found.max);
            }
          });
      });
    } else {
      mergedFactors = _results[0].factors;
    }
    console.log('merged factors : ', mergedFactors);
    let new_result: Result = {
      testSheetUid: selectedTestSheet,
      factors: mergedFactors
    };
    return new_result;
  }
  public onChangeTestSheet(uid: string) {
    this.chartLoaded = false;
    console.log('change test sheet uid: ' + uid);
    this.selectedTestSheet = uid;
    this.jobList = this.getJobList(this.workPlace.results, uid);
    let mergedResult = this.findAndMergeResult(this.workPlace.results, this.selectedTestSheet, this.selectedJob);
    this.barChartLabels = [];
    this.barChartLabels = _.map(mergedResult.factors, 'name') as string[];
    let data = this.testService.getChartData(mergedResult, this.barChartLabels, {method : 'percentage'});
    data = _.map(data, (val) => {
      return _.round(val * 100, 2);
    });
    this.barChartData = [];
    this.barChartData.push({
      data,
      label: this.place.name
    });
    console.log('bar chart : ', this.barChartData);
    this.chartLoaded = true;
    // this.chart.chart.update();
  }
  public onChangeJob(jobId: number) {
    this.chartLoaded = false;
    console.log('change job id: ' + jobId);
    this.selectedJob = jobId;
    this.testSheetList = this.getTestSheetList(this.workPlace.results, jobId);
    let mergedResult = this.findAndMergeResult(this.workPlace.results, this.selectedTestSheet, this.selectedJob);
    this.barChartLabels = [];
    this.barChartLabels = _.map(mergedResult.factors, 'name');
    let data = this.testService.getChartData(mergedResult, this.barChartLabels, {method : 'percentage'});
    data = _.map(data, (val) => {
      return _.round(val * 100, 2);
    });
    this.barChartData = [];
    this.barChartData.push({
      data,
      label: this.place.name
    });
    console.log('bar chart : ', this.barChartData);

    this.chartLoaded = true;
    // this.chart.chart.update();
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
