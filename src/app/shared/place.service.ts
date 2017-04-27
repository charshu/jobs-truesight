import {
    Injectable,
    OnInit
} from '@angular/core';

// import { AuthenticationService } from '../shared/authentication.service';
import {
    WorkPlace
} from '../../type.d';
import 'rxjs/add/operator/map';
import {
    Apollo
} from 'apollo-angular';
import gql from 'graphql-tag';
declare var google: any;

const getWorkPlace = gql`
query getWorkPlace($id:String!){
  getWorkPlace(id:$id) {
    id
    answerSheets{
      testSheetUid
        job {
        id
        name
        results {
          testSheetUid
          factors {
            name
            value
            question_counter
          }
        }
      }
    }
    viewCount
    participant{
        male
        female
        ages
    }
    factorsAvailable
    results {
      testSheetUid
      job{
          id
          name
      }
      factors {
        name
        value
        question_counter
        min
        max
      }
    }
  }
}   
`;
interface QueryResponse {
    getWorkPlace: WorkPlace;
}

@Injectable()
export class PlaceService implements OnInit {
    private googlePlaceService: any;
    private placeDict: any = {};
    constructor(private apollo: Apollo ) {}

    public async getWorkPlace(id: string): Promise <WorkPlace> {
        console.log(`Get work place by place id : ${id}`);
        try {
            const query = this.apollo.query <QueryResponse> ({
                query: getWorkPlace,
                forceFetch: true,
                variables: {
                id
                }
            }).map(({
                data
            }) => data.getWorkPlace);
            const workPlace = await query.toPromise();
            console.log(`Work place data \n`, workPlace);
            return JSON.parse(JSON.stringify(workPlace));
        } catch (e) {
            console.log(e);
        }
    }
    public getPlace(id: string): Promise<any> {
        console.log(`Get work place details by place id : ${id}`);
        if (!this.googlePlaceService) {
             this.googlePlaceService = new google.maps.places.PlacesService(document.createElement('div'));
        }
        // try to use old data
        if (this.placeDict[id]) {
            return this.placeDict[id];
        }
        return new Promise((resolve, reject) => {
            if (!id) {
            reject(null);
            }
            this.googlePlaceService.getDetails({
                 placeId : id
            }, (place, status) => {
                console.log(`Status: `, status);
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    console.log(`Place details: `, place);
                    this.placeDict[id] = place;
                    console.log(`Save ${place.name} to dict`);
                    resolve(place);
                } else {
                    reject(null);
                }
            });

        });
    }
    public ngOnInit() {
        console.log('setup google service');

    }
}
