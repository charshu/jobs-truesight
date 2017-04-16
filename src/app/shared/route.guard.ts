// import { Observable } from 'rxjs/Observable';
import { UserService } from '../shared';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class RouteGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router) { }

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url: string = state.url;
    if (await this.userService.isLoggedIn()) {
      return true;
    }
    this.userService.redirectUrl = url;
    console.log(`set redirect url:${url}`);
    this.router.navigate(['/login']);
    return false;

  }

}
