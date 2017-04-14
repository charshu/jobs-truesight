import {
  Component,
  OnInit
} from '@angular/core';
import {
  TestService
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

  private error: String;
  private workPlace: WorkPlace;
  private job: Job;
  private testSheetUid: String;
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
      private testService: TestService) {
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
      console.log(this.testSheet);

      /*
        load lastest user answer sheet and calculate result
      */
      let answerSheets = await this.testService.getAnswerSheetByUid(this.testSheetUid);
      console.log(answerSheets);
      if (answerSheets && answerSheets.length > 0) {
        // sort by date
        answerSheets = answerSheets.sort((a, b) => {
          return (b.createdAt - a.createdAt);
        });
        this.answerSheets = answerSheets;
        let factorCount = [];
        for (let answer of this.answerSheets[0].answers) {
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

        // find average and round
        let temp = [];
        for (let i = 0; i < this.radarChartData[0].data.length; i++) {
          this.radarChartData[0].data[i] /= factorCount[i];
          this.radarChartData[0].data[i] = this.radarChartData[0].data[i].toFixed(3);
          temp.push({
            label: this.radarChartLabels[i],
            value: this.radarChartData[0].data[i]
          });
        }
        temp = orderBy(temp, 'value', 'desc');
        this.sortedData = temp;

        /*
            load work place and work place's result
         */
        this.workPlace = await this.testService.getWorkPlace(this.answerSheets[0].workPlaceId);
        let result = find(this.workPlace.results, {
          testSheetUid: this.testSheetUid
        });
        this.pushData(result, 'same job and work place');

        /*
            load job and job's result
         */
        this.job = await this.testService.getJob(this.answerSheets[0].jobId);
        result = find(this.job.results, {
          testSheetUid: this.testSheetUid
        });
        this.pushData(result, 'same job');

        this.loaded = true;

        /*
           load work place details
        */
        let map = new google.maps.Map(document.getElementById('map'), {
          center: {
            lat: 13.737889,
            lng: 100.547247
          },
          zoom: 10
        });
        let infowindow = new google.maps.InfoWindow();
        let service = new google.maps.places.PlacesService(map);
        console.log(`request place id : ${this.answerSheets[0].workPlaceId}`);
        service.getDetails({
          placeId: this.answerSheets[0].workPlaceId
        }, (place, status) => {
          console.log(`status: ${status}, place: `, place);
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            this.workPlace = place;
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
            google.maps.event.addListener(marker, 'click', function () {
              infowindow.setContent('<div><strong>' + place.name + '</strong><br>' +
                'Place ID: ' + place.place_id + '<br>' +
                place.formatted_address + '</div>');
              infowindow.open(map, this);
            });
          }
          this.googleLoaded = true;
        });
      } else {
        this.error = 'answer sheet not found';
      }

    } catch (err) {
      console.log(err);
    }
  }
}
