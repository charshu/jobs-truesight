import { Component, OnInit } from '@angular/core';

import { User } from '../_model/user';
import { UserService } from '../shared/user.service';

@Component({
    
    templateUrl: 'info.component.html'
})

export class InfoComponent implements OnInit {
    user: User;

    constructor(private userService: UserService) { }

    ngOnInit() {
        // get users from secure api end point
        this.userService.getUserInfo()
            .subscribe(user => {
                this.user = user;
            });
    }

}