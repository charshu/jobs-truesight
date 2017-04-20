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
    Job
} from '../../type.d';
import { Router } from '@angular/router';
declare var google: any;

@Component({
    templateUrl: 'signup.component.html',
    styleUrls: ['./signup.component.scss']
})

export class SignUpComponent implements OnInit {
    private loaded: boolean;
    private user: any = {
        profile: {
            age_range: undefined,
            gender: 'male',
            jobId: undefined,
            workPlaceId: undefined,
            workPlaceName: undefined,
            salary: undefined
        }
    };
    private jobs: Job[];
    private error: string;
    private success: string;

    constructor(
        private userService: UserService,
        private testService: TestService,
        private placeService: PlaceService,
        private router: Router
    ) {

    }

    public selectJob(id) {
        console.log(`Select job id:${id}`);
        this.user.profile.jobId = id;
    }
    public async register() {
        console.log(this.user);
        try {
            if (this.user.password !== this.user.confirmPassword) {
                throw new Error('Password does not match the confirm password');
            }
            let isSuccess = await this.userService.register(this.user);
            if (isSuccess) {
                this.router.navigate(['/']);
            } else {
                throw new Error('Register Failed: No response from server');
            }
        } catch (e) {
            console.log(e);
            this.error = e;
        }
    }
    public async ngOnInit() {
        this.loaded = false;
        if (await this.userService.isLoggedIn()) {
            this.router.navigate(['/']);
        }
        // load jobs list
        this.jobs = await this.testService.getJobsChoice();
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
