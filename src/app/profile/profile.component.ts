import {
    Component,
    OnInit,
    Inject
} from '@angular/core';
import {
    UserService,
    TestService,
    PlaceService
} from '../shared';
import {
    DOCUMENT
} from '@angular/platform-browser';
import {
    Job
} from '../../type.d';
import {
    find
} from 'lodash';
declare var google: any;

@Component({
    templateUrl: 'profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
    private loaded: boolean;
    private user: any = {
        profile: {
            age_range: 0,
            gender: 'male',
            job: {
                id: -1
            },
            workPlaceId: null,
            workPlaceName: null,
            salary: 0
        }
    };
    private jobs: Job[];
    private error: string;
    private success: string;

    constructor(
        private userService: UserService,
        private testService: TestService,
        private placeService: PlaceService,
        @Inject(DOCUMENT) private document: Document
    ) {

    }

    public selectJob(id) {
        console.log(`Select job id:${id}`);
        this.user.profile.job.id = id;
    }
    public updateProfile() {
        try {
            console.log(`Send profile to user service`, this.user.profile);
            let isSuccess = this.userService.updateProfile(this.user.profile);
            if (isSuccess) {
                this.success = 'Profile is successfully saved.';
                this.document.body.scrollTop = 0;
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
        this.user = await this.userService.getCurrentUser();
        if (this.user.profile.job.id) {
            let _job = find(this.jobs, { id : this.user.profile.job.id});
            if (!_job) {
                this.user.profile.job.id = -1;
            }
        }
        if (this.user.profile.workPlaceId) {
            let place = await this.placeService.getPlace(this.user.profile.workPlaceId);
            this.user.profile.workPlaceName = place.name;
        } else {
            this.user.profile.workPlaceName = '';
        }


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

        autocomplete.addListener('place_changed', async() => {
            const place = await autocomplete.getPlace();
            console.log(place);
            searchBox.value = place.name;
            this.user.profile.workPlaceName = place.name;
            console.log('change work place name', this.user.profile.workPlaceName);
            this.user.profile.workPlaceId = place.place_id;
            console.log('change work place id', this.user.profile.workPlaceId);
        });

    }
}