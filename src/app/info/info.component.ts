import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared';


// We use the gql tag to parse our query string into a query document
@Component({
    templateUrl: 'info.component.html'
})

export class InfoComponent implements OnInit {
    loaded: boolean;
    currentUser: any;

    constructor(
        private userService: UserService
    ) {
        this.userService.currentUser.subscribe( (currentUser) => {
            if (currentUser !== null) {
                this.currentUser = currentUser;
            }
            this.loaded = true;
        });
    }

    ngOnInit() {}
}