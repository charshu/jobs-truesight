// import { Observable } from 'rxjs/Observable';
import { UserService } from '../shared';
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class RouteGuard implements CanActivate {
  constructor(
    private userService: UserService,
    private router: Router) {
    console.log("RouterGuard called");
  }

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let url: string = state.url;
    if (await this.userService.isLoggedIn()) {
      console.log('Check user login');
      return true;
    }
    this.userService.redirectUrl = url;
    this.router.navigate(['/login']);
    return false;

  }
}
