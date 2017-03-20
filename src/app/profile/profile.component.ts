import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared';


// We use the gql tag to parse our query string into a query document
@Component({
    templateUrl: 'profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
    loaded: boolean;
    user: any;

    constructor(
        private userService: UserService
    ) {
        this.userService.currentUser.subscribe( (currentUser) => {
            if (currentUser !== null) {
                this.user = currentUser;
            }
            this.loaded = true;
        });
    }

    ngOnInit() {}
}