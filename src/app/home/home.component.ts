import {
  Component,
  OnInit
} from '@angular/core';
import {
  UserService
} from '../shared';


declare var google: any;
@Component({
  selector: 'my-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private loaded: boolean;

  constructor(
    private userService: UserService) {}

  public async ngOnInit() {

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
      let place = autocomplete.getPlace();
      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng();
      let address = place.formatted_address;

      // this.placeChanged(lat, lng, address);
      console.log(lat, lng, address, place);
      searchBox.value = place.name;
    });

    this.loaded = true;
  }


}