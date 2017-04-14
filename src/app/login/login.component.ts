import { Component } from '@angular/core';
import { UserService } from '../shared';

@Component({
    templateUrl: 'login.component.html',
    styleUrls: ['./login.component.scss']
})

export class LoginComponent  {
    private model: any = {};
    private loading = false;
    private error = '';

    constructor(
        private userService: UserService) { }

    public async login() {
        this.loading = true;
        try {
            // tslint:disable-next-line:max-line-length
            const isLoginSuccess = await this.userService.login(this.model.email, this.model.password);
            if (!isLoginSuccess) {
                this.error = 'Email or password is incorrect';
                this.loading = false;
            }

        }catch (e) {
            console.log(e);
        }

    };
};
