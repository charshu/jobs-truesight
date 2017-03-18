import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../shared';

@Component({

    templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';

    constructor(
        private router: Router,
        private userService:UserService) { }
        
    ngOnInit() {
        // TODO: reset login status

    }

    login() {
        this.loading = true;
        this.userService.login(this.model.email, this.model.password)
            .subscribe(res => {
                if (res.status === 200) {
                    this.userService.loadCurrentUser();
                    this.router.navigate(['/info']);
                } else {
                    this.error = 'Email or password is incorrect';
                    this.loading = false;
                }
            });
    }
}
