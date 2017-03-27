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

   public async checkLogin(url: string): Promise<boolean> {
    console.log('check login2');
    if (await this.userService.isLoggedIn()) { return true; }
    console.log('check login3');
    // Store the attempted URL for redirecting
    this.userService.redirectUrl = url;
    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }

  public async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log('check login');
    let url: string = state.url;
    return await this.checkLogin(url);
  }
}
