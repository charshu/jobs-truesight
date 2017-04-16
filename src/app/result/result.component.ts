import {
  Component,
  OnInit
} from '@angular/core';
import {
  TestService,
  PlaceService,
  UserService
} from '../shared';
import {
  ActivatedRoute
} from '@angular/router';
import {
  AnswerSheet,
  TestSheet,
  Job,
  Result,
  WorkPlace
} from './../../type.d';
import {
  find,
  orderBy
} from 'lodash';
declare var google: any;

@Component({
  selector: 'my-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  private error: string;
  private workPlace: WorkPlace;
  private place: any;
  private job: Job;
  private testSheetUid: string;
  private answerSheets: AnswerSheet[] = [];
  private sortedData = [];
  private testSheet: TestSheet;
  private loaded: boolean = false;
  private googleLoaded: boolean = false;

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
        showLabelBackdrop: false
      }
    },
    legend: {
      display: true,
      position: 'bottom'
    },
    responsive: true,
    maintainAspectRatio: false
  };
  constructor(
      private route: ActivatedRoute,
      private userService: UserService,
      private testService: TestService,
      private placeService: PlaceService) {
      this.route.params.subscribe((params) => {
        // console.log(params['uid']);
        this.testSheetUid = params['uid'];
      });

    }

  // events
  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  public pushData(result: Result, label: string) {
    // set initial factor label sequence
    if (!this.radarChartLabels) {
      for (let factor of result.factors) {
        this.radarChartLabels.push(factor.name);
      }
    }

    // add dataset
    let dataset = {
      data: [],
      label
    };

    for (let factorLabel of this.radarChartLabels) {
      let factor = find(result.factors, {
        name: factorLabel
      });
      dataset.data.push((factor.value / factor.question_counter).toFixed(3));
    }
    this.radarChartData.push(dataset);

  }
  public async ngOnInit() {
    this.loaded = false;
    try {

      this.testSheet = await this.testService.getTestSheetByUid(this.testSheetUid);

      /*
        load lastest user answer sheet
      */
      let answerSheets = await this.userService.getAnswerSheetByUid(this.testSheetUid
      , {forceFetch : true} );
      this.answerSheets = answerSheets;
      /*
        calculating result offline for an user's answer sheet
        (Because this answer sheet result don't have to save in database)
      */
      if (answerSheets) {
        let factorCount = [];
        for (let answer of answerSheets[0].answers) {
          let question = find(this.testSheet.questions, {
            id: answer.questionId
          });
          let index = this.radarChartLabels.indexOf(question.factorName);
          if (index < 0) {
            this.radarChartLabels.push(question.factorName);
            this.radarChartData[0].data.push(0);
            factorCount.push(0);
            index = this.radarChartLabels.length - 1;
          }
          factorCount[index] += 1;
          let chosenChoice = find(question.choices, {
            id: answer.selectedChoiceId
          });
          if (!chosenChoice) {
            throw new Error(`chosen choice id: ${answer.selectedChoiceId} not found`);
          }
          this.radarChartData[0].data[index] += chosenChoice.value;

        }

        // Average value
        let temp = [];
        for (let i = 0; i < this.radarChartData[0].data.length; i++) {
          this.radarChartData[0].data[i] /= factorCount[i];
          this.radarChartData[0].data[i] = this.radarChartData[0].data[i].toFixed(3);
          temp.push({
            label: this.radarChartLabels[i],
            value: this.radarChartData[0].data[i]
          });
        }
        // Sorting
        temp = orderBy(temp, 'value', 'desc');
        this.sortedData = temp;

        /*
            Loading results from the work place
        */
        this.workPlace = answerSheets[0].workPlace;
        let workPlaceResult = find(this.workPlace.results, {
          testSheetUid: this.testSheetUid,
          jobId: answerSheets[0].job.id
        });
        if (workPlaceResult) {
          this.pushData(workPlaceResult, 'Your Co-worker');
        }

        /*
            Loading results from job
        */
        this.job = answerSheets[0].job;
        let jobResult = find(this.job.results, {
          testSheetUid: this.testSheetUid
        });
        if (jobResult) {
          this.pushData(jobResult, 'Same Job');
        }

        this.loaded = true;

        /*
           Loading work place details
        */
        let map = new google.maps.Map(document.getElementById('map'), {
          center: {
            lat: 13.737889,
            lng: 100.547247
          },
          zoom: 10
        });
        let infowindow = new google.maps.InfoWindow();
        let place = await this.placeService.getPlace(answerSheets[0].workPlace.id);
        if (place) {
          let latitude = place.geometry.location.lat();
          let longitude = place.geometry.location.lng();
          map.setOptions({
                center: {
                  lat: latitude,
                  lng: longitude
                },
                zoom: 15
              });
          let marker = new google.maps.Marker({
                map,
                position: place.geometry.location
              });
          this.place = place;
          google.maps.event.addListener(marker, 'click', () => {
                infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                  'Place ID: ' + place.place_id + '<br>' +
                  place.formatted_address + '</div>');
                infowindow.open(map, this);
              });
          this.googleLoaded = true;
        }
      } else {
        this.error = 'answer sheet not found';
      }

    } catch (err) {
      console.log(err);
    }
  }
}
