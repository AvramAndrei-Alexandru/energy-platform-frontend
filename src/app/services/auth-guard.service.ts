import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { UserRoles } from '../utils/constants';
import { AdminRoutes } from '../utils/routes';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

  constructor(private jwtHelper: JwtHelperService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)){
      if(state.url === AdminRoutes.Users || state.url === AdminRoutes.Register) {
        var decodedToken = this.jwtHelper.decodeToken(token);
        var role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if(role !== UserRoles.Admin) {
          this.router.navigate(["/login"]);
          return false;
        }
      }
      return true;
    }
    this.router.navigate(["/login"]);
    return false;
  }
}
