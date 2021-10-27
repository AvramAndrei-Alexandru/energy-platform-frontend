import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DashboardUserModel, UserModel } from '../models/user-models';
import { UserEndpoints } from '../utils/endpoints';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }


  public getAllUsers(): Observable<DashboardUserModel[]> {
    return this.http.get<DashboardUserModel[]>(this.baseUrl + UserEndpoints.GetAllUsers);
  }

  public registerUser(user: UserModel): Observable<any> {
    return this.http.post<any>(this.baseUrl + UserEndpoints.Register, user);
  }

  public updateUser(user: DashboardUserModel): Observable<any> {
    return this.http.put<any>(this.baseUrl + UserEndpoints.Update, user);
  }

  public removeUser(user: DashboardUserModel): Observable<any> {
    let url = this.baseUrl + UserEndpoints.Remove + '/' + user.id;
    return this.http.delete<any>(url);
  }

}
