import {
    Component,
    OnInit
} from '@angular/core';
import {
    UserService,
    TestService
} from '../shared';
import {
    Job
} from '../../type.d';
declare var google: any;

@Component({
    templateUrl: 'profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
    private loaded: boolean;
    private googleLoaded: boolean;
    private user: any = {
        profile: {
            gender: 'male',
            jobId: -1,
            workPlaceName: ''
        }
    };
    private jobs: Job[];
    private error: string;
    private success: string;

    constructor(
        private userService: UserService,
        private testService: TestService
    ) {

    }

    public selectJob(id) {
        console.log(id);
        this.user.profile.jobId = id;
    }
    public updateProfile() {
        try {
        
            let isSuccess = this.userService.updateProfile(this.user.profile);
            if (isSuccess) {
                this.success = 'Profile is successfully saved.';
            }
        } catch (e) {
            console.log(e);
            this.error = e;
        }
    }
    public async ngOnInit() {
        this.loaded = false;
        // load jobs list
        this.jobs = await this.testService.getJobsChoice();
        // load user profile
        this.user = this.userService.getCurrentUser();
        this.user.profile.workPlaceName = await this.userService.getWorkPlaceName();
        console.log(this.user.profile.workPlaceName);
        this.loaded = true;
        let searchBox: any = document.getElementById('search-box');
        let options = {
            types: [
                'establishment'
            ],
            componentRestrictions: {
                country: 'th'
            }
        };
        let autocomplete = new google.maps.places.Autocomplete(searchBox, options);

        autocomplete.addListener('place_changed', async () => {
            const place = await autocomplete.getPlace();
            console.log(place);
            searchBox.value = place.name;
            this.user.profile.workPlaceName = place.name;
            console.log('change work place name', this.user.profile.workPlaceName);
            this.user.profile.workPlaceId = place.place_id;
            console.log('change work place id', this.user.profile.workPlaceId );
        });

    }
}
