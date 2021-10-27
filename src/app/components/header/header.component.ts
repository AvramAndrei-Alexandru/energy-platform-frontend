import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth-service.service';
import { AdminRoutes, RoutingConstants } from 'src/app/utils/routes';
import {Location} from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

	@Output() onAddDevice: EventEmitter<any> = new EventEmitter();
	
  public loggedUser: string = "";
	public userNameForDevices: string;
	public deviceName: string;
  public pageName: string = "";
  public shouldDisplayAddUserButton: boolean = false;
  public shouldDisplayAddDeviceButton: boolean = false;
  public shouldDisplayAddMeasurementButton: boolean = false;
  

  constructor(private _authService: AuthService, private _router: Router, private _activatedroute: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
		this.setUpPageName();
		this.setUpVariables();
		this.setUpButtons();
  }

  public onLogOut(): void {
    this._authService.logOut();
  }

  public onAddUser(): void {
    this._router.navigate([RoutingConstants.REGISTER]);
  }

  public onAddDeviceClick(): void {
    this.onAddDevice.emit();
  }

  public onBack(): void {
    this.location.back();
	}
	
  private setUpPageName(): void {
    if (this._router.url.split(';')[0] == '/' + RoutingConstants.USERS) {
      this.pageName = "USERS";
    } else if (this._router.url.split(';')[0] == '/' + RoutingConstants.DEVICES) {
      this.pageName = "DEVICES"
    } else if (this._router.url.split(';')[0] == '/' + RoutingConstants.MEASUREMENTS) {
      this.pageName = "MEASUREMENTS"
    }
	}
	
	private setUpVariables(): void {
		this.loggedUser = localStorage.getItem("userName");
		this.userNameForDevices = this._activatedroute.snapshot.paramMap.get("name");
		this.deviceName = this._activatedroute.snapshot.paramMap.get("deviceName");
	}

	private setUpButtons(): void {
		if (this._router.url === AdminRoutes.Users && this._authService.isUserAdmin()) {
			this.shouldDisplayAddUserButton = true;
		} else if (this._router.url.split(';')[0] === '/' + RoutingConstants.DEVICES && this._authService.isUserAdmin()) {
			this.shouldDisplayAddDeviceButton = true;
		} else if (this._router.url.split(';')[0] === '/' + RoutingConstants.MEASUREMENTS && this._authService.isUserAdmin()) {
			this.shouldDisplayAddMeasurementButton = true;
		}
	}

}
