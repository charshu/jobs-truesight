import { Component, OnInit, HostListener, Inject  } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { UserService } from '../shared';
import { Router } from '@angular/router';

// We use the gql tag to parse our query string into a query document
@Component({
    selector : 'navbar',
    styleUrls: ['navbar.component.scss'],
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit {
    loaded: boolean;
    user: any;
    public navOpaque: boolean = true;
    currentRoute: any;
    constructor(
        private router: Router,
        private userService: UserService,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.userService.currentUser.subscribe((currentUser) => {
            // console.log(currentUser);
            if (currentUser !== null) {
                this.user = currentUser;
            }
            this.loaded = true;
        });

        router.events.subscribe((val) => {
        // console.log('current route: ' + val.url);
        this.currentRoute = val.url;
        // instantly detect scroll when route change one time
        if (this.document.body.scrollTop === 0 && this.currentRoute === '/') {
            this.navOpaque = false;
        } else {
            this.navOpaque = true;
        }
    });
    }

    public async logout() {
        try {
            const isLogout = await this.userService.logout();
            console.log(isLogout);
            if (isLogout) {
                this.user = undefined;
                this.router.navigate(['/']);
            }
        }catch (e) {
            console.log(e);
        }
    }

    ngOnInit() {
        if (window.location.hash && window.location.hash === '#_=_') {
            window.location.hash = '';
        }
        this.userService.loadCurrentUser();
    }
    // tslint:disable-next-line:member-access
    @HostListener('window:scroll', [])
    onWindowScroll() {
        let scrollPos = this.document.body.scrollTop;
        if (scrollPos <= 50 && this.currentRoute === '/') {
        this.navOpaque = false;
        } else if (scrollPos > 50 && this.currentRoute === '/') {
        this.navOpaque = true;
        } else {
        this.navOpaque = true;
        }

  }

}