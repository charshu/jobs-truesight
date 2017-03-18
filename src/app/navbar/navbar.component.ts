import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared';
import { Router } from '@angular/router';

// We use the gql tag to parse our query string into a query document
@Component({
    selector : 'navbar',
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
    loaded: boolean;
    currentUser: any;

    constructor(
        private router: Router,
        private userService: UserService
    ) {
        this.userService.currentUser.subscribe((currentUser) => {
            console.log(currentUser);
            if (currentUser !== null) {
                this.currentUser = currentUser;
            }
            this.loaded = true;
        });
    }

    public logout() {
        this.userService.logout().then((isLogout) => {
            console.log(isLogout);
            if (isLogout) {
                this.currentUser = undefined;
                this.router.navigate(['/home']);
            }

        }, (error) => {
            console.log(error);
        });

    }

    ngOnInit() {
       this.userService.loadCurrentUser();

  }

}