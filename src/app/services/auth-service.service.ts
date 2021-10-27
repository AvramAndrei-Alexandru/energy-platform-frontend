import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserModel } from '../models/user-models';
import { environment } from 'src/environments/environment';
import { UserEndpoints } from '../utils/endpoints';
import { JwtHelperService } from '@auth0/angular-jwt';
import { UserRoles } from '../utils/constants';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private baseUrl = environment.baseUrl;
    private userSubject: BehaviorSubject<UserModel>;
    public user: Observable<UserModel>;

    constructor(
        private http: HttpClient,
        private _router: Router,
        private jwtHelper: JwtHelperService
    ) {
        this.userSubject = new BehaviorSubject<UserModel>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): UserModel {
        return this.userSubject.value;
    }

    public login(credentials: any): Observable<any> {
      let url = this.baseUrl + UserEndpoints.Login;
      return this.http.post<any>(url, credentials);
    }

    public logOut() {
      localStorage.removeItem("jwt");
      this._router.navigate(["/login"])
   }

   public isUserAdmin(): boolean {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)){
        var decodedToken = this.jwtHelper.decodeToken(token);
        var role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if(role !== UserRoles.Admin) {
          return false;
        }
        return true;
      }
      return false;
    }

    public isUserClient(): boolean {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)){
        var decodedToken = this.jwtHelper.decodeToken(token);
        var role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        if(role !== UserRoles.Client) {
          return false;
        }
        return true;
      }
      return false;
    }
}