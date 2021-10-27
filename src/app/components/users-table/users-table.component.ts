import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardUserModel, UserModel } from 'src/app/models/user-models';
import { UserService } from 'src/app/services/user.service';
import { UserRoles } from 'src/app/utils/constants';
import { RoutingConstants } from 'src/app/utils/routes';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent implements OnInit {

  public users: DashboardUserModel[];
  public UserRoles: UserRoles;

  constructor(
    private _userService: UserService,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this._userService.getAllUsers().subscribe(u => {
      this.users = u;
      this.setRoleNames();
    })
  }

  private setRoleNames(): void {
    this.users.forEach(user => {
      user.roleName = user.role == 1 ? "ADMIN" : "CLIENT"
    });
  }

  public onSave(user: DashboardUserModel): void {
    this._userService.updateUser(user).subscribe(_ => {
      this.loadData();
    })
  }

  public onDelete(user: DashboardUserModel): void {
    this._userService.removeUser(user).subscribe(_ => {
      this.loadData();
    })
  }

  public onViewDevices(user: DashboardUserModel): void {
    this._router.navigate([RoutingConstants.DEVICES, {id: user.id, name: user.userName}]);
  }
}
