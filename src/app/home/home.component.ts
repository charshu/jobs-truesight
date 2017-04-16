import {
  Component,
  OnInit
} from '@angular/core';
import {
  UserService,
  TestService,
  PlaceService
} from '../shared';
import {
  WorkPlace
} from '../../type.d';
declare var google: any;
const MIN_LOADING_TIME = 1000;

@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public workPlace: WorkPlace;
  public place: any;
  private loaded: boolean;
  private searchLoaded: boolean = true;
  private user: any;
  private placeId: string = null;
  private coverUrl: string = '/img/cover.jpg';
  private hasResult: boolean = false;

  constructor(
    private userService: UserService,
    private placeService: PlaceService) {}

  public async searchWorkPlace(placeId: string) {
    try {
      if (!placeId) {
        placeId = 'ChIJg3T4J4-e4jARWboW-tZ3nok';
      }
      this.hasResult = true;
      this.searchLoaded = false;
      this.workPlace = await this.placeService.getWorkPlace(placeId);
      console.log(this.workPlace);
      this.place = await this.placeService.getPlace(this.workPlace.id);
      // minimum loading time 1s
      setTimeout( () => {
        this.searchLoaded = true;
      }, MIN_LOADING_TIME);
    } catch (e) {
      console.log(e);
    }
  }

  public async ngOnInit() {
    this.user = await this.userService.getUser();
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
}
