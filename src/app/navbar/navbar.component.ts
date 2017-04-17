import {
    Component,
    OnInit,
    HostListener,
    Inject,
    AfterViewInit,
    OnDestroy
} from '@angular/core';
import {
    Subscription
} from 'rxjs';
import {
    DOCUMENT
} from '@angular/platform-browser';
import {
    UserService
} from '../shared';
import {
    Router
} from '@angular/router';

// We use the gql tag to parse our query string into a query document
@Component({
    selector: 'navbar',
    styleUrls: ['navbar.component.scss'],
    templateUrl: 'navbar.component.html'
})

export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
    private loaded: boolean;
    private user: any;
    private navOpaque: boolean = true;
    private currentRoute: any;
    private sub: Subscription;
    constructor(
        private router: Router,
        private userService: UserService,
        @Inject(DOCUMENT) private document: Document
    ) {}

    public async logout() {
        try {
            const isLogout = await this.userService.logout();
            if (isLogout) {
                this.router.navigate(['/']);
            }
        } catch (e) {
            console.log(e);
        }
    }

    public async ngOnInit() {
        if (window.location.hash && window.location.hash === '#_=_') {
            window.location.hash = '';
        }
        this.sub = this.userService.getObservableUser().subscribe((user) => {
                this.user = user;
        });

        if (this.user) {
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
    public ngOnDestroy() {
        this.sub.unsubscribe();
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