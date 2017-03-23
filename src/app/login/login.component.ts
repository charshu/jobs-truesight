import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../shared';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
    model: any = {};
    loading = false;
    error = '';

    constructor(
        private router: Router,
        private userService: UserService) { }

    ngOnInit() {
        // TODO: reset login status

    }

    public async login() {
        this.loading = true;
        try {
            const isLoginSuccess = await this.userService.login(this.model.email, this.model.password);
            if (isLoginSuccess) {
                this.router.navigate(['/profile']);
            } else {
                this.error = 'Email or password is incorrect';
                this.loading = false;
            }
        }catch (e) {
            console.log(e);
        }

    };
};
