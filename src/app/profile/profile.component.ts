import { Component, OnInit } from '@angular/core';
import { UserService, TestService } from '../shared';
import { Job } from '../../type.d';
declare var google: any;
// We use the gql tag to parse our query string into a query document
@Component({
    templateUrl: 'profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
    loaded: boolean;
    user: any = {
        profile:{
            jobId : -1
        }
    };
    jobs: Job[];

    constructor(
        private userService: UserService,
        private testService: TestService
    ) {
        this.userService.currentUser.subscribe( (currentUser) => {
            if (currentUser !== null) {
                if (!currentUser.profile.jobId) {
                    this.userService.setJobId(-1);
                }
                this.user = currentUser;
            }
            this.loaded = true;
        });
    }

    public selectJob( id ) {
        console.log(id);
        this.user.profile.jobId = id;
    }

    public async ngOnInit() {
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
        this.user.profile.workPlaceId = place.id;
        });
        // load jobs list
        this.jobs = await this.testService.loadJobsChoice();
        }
}
