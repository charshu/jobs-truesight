import { Component, OnInit, HostListener, Inject, AfterViewInit  } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { UserService } from '../shared';
import { Router } from '@angular/router';

// We use the gql tag to parse our query string into a query document
@Component({
    selector : 'navbar',
    styleUrls: ['navbar.component.scss'],
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit, AfterViewInit {
    private loaded: boolean;
    private user: any;
    private navOpaque: boolean = true;
    private currentRoute: any;
    constructor(
        private router: Router,
        private userService: UserService,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.userService.currentUser.subscribe((currentUser) => {
                console.log(currentUser);
                if (currentUser !== null) {
                    this.user = currentUser;
                }
            });


    }

    public async logout() {
        try {
            const isLogout = await this.userService.logout();
            // console.log(isLogout);
            if (isLogout) {
                this.user = undefined;
                this.router.navigate(['/']);
            }
        }catch (e) {
            console.log(e);
        }
    }

    public async ngOnInit() {
        if (window.location.hash && window.location.hash === '#_=_') {
            window.location.hash = '';
        }
        const success = await this.userService.loadCurrentUser();
        console.log('load user success:' + success);
        if (success) {
            this.user = this.userService.getCurrentUser();
            this.navOpaque = true;
        } else {
            this.navOpaque = false;
        }

        // detect scroll when route change
        this.router.events.subscribe((val) => {
                this.currentRoute = val.url;
                if (this.user) {
                    this.navOpaque = true;
                } else if (this.document.body.scrollTop <= 50 && this.currentRoute === '/') {
                    this.navOpaque = false;
                } else {
                    this.navOpaque = true;
                }
             });
        this.loaded = true;
    }
    public ngAfterViewInit() {
        console.log('view init');

    }
    // tslint:disable-next-line:member-access
    @HostListener('window:scroll', [])
    onWindowScroll() {
        let scrollPos = this.document.body.scrollTop;
        if (scrollPos <= 50 && this.currentRoute === '/' && !this.user) {
        this.navOpaque = false;
        } else if (scrollPos > 50 && this.currentRoute === '/' && !this.user) {
        this.navOpaque = true;
        } else {
        this.navOpaque = true;
        }

  }

}