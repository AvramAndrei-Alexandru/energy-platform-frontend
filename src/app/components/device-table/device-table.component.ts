import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SmartDeviceDashboardModel } from 'src/app/models/smart-device-models';
import { AuthService } from 'src/app/services/auth-service.service';
import { SmartDeviceService } from 'src/app/services/smart-device.service';
import { RoutingConstants } from 'src/app/utils/routes';

@Component({
  selector: 'app-device-table',
  templateUrl: './device-table.component.html',
  styleUrls: ['./device-table.component.scss']
})
export class DeviceTableComponent implements OnInit {

  public clientId: string;
  public devices: SmartDeviceDashboardModel[];
  public isUserAdmin: boolean = false;

  constructor(
    private _smartDeviceService: SmartDeviceService,
    private _authService: AuthService,
    private _activatedroute: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.isUserAdmin = this._authService.isUserAdmin();
    this.clientId = this._activatedroute.snapshot.paramMap.get("id");
    this.loadData();
  }

  public onSaveClick(device: SmartDeviceDashboardModel): void {
    if (device.id === null) {
      this._smartDeviceService.addDevice(device).subscribe(_ => { 
        this.loadData();
      })
    } else {
      this._smartDeviceService.updateDevice(device).subscribe(_ => {
        this.loadData();
      })
    }
  }

  public onViewMeasurements(device: SmartDeviceDashboardModel): void {
    this._router.navigate([RoutingConstants.MEASUREMENTS, { id: device.id, deviceName: device.description }]);
  }

  public onViewRPCMeasurements(device: SmartDeviceDashboardModel): void {
    this._router.navigate([RoutingConstants.RPC, { id: device.id, deviceName: device.description }]);
  }

  public onDelete(device: SmartDeviceDashboardModel): void {
    this._smartDeviceService.deleteDevice(device.id).subscribe(_ => {
      this.loadData();
    })
  }

  private loadData(): void {
    if (!this._authService.isUserAdmin()) {
      this._smartDeviceService.getAllDevicesForCurrentClient().subscribe(d => {
        this.devices = d;
      })
    } else {
      if (this.clientId != null) {
        this._smartDeviceService.getAllDevicesForClient(this.clientId).subscribe(d => {
          this.devices = d;
        })
      }
    }
  }

  public onAddDevice(): void {
    let newDevice = <SmartDeviceDashboardModel>{
      id: null,
      description: "",
      sensorDescription: "",
      address: "",
      maximumEnergyConsumption: 0,
      averageEnergyConsumption: 0,
      userId: this.clientId
    }
    this.devices.unshift(newDevice)
  }

}
