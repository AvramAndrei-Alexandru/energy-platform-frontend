import { HttpContextToken } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as signalR from "@microsoft/signalr";
import { HubConnection, IHttpConnectionOptions } from '@microsoft/signalr';
import { cwd } from 'process';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DialogComponentComponent } from '../components/dialog-component/dialog-component.component';
import { PowerPeakMessage } from '../models/messaging-models';
import { GetMeasurementsForDeviceInIntervalModel, TimeToStartMeasurementModel } from '../models/rpc-models';
import { SensorMeasurementDashboardModel } from '../models/sensor-measurement-models';
import { AuthService } from './auth-service.service';


@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private _hubConnection: HubConnection | undefined
  public onMessageRecive: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog,
    private _authService: AuthService
  ) { }

  public start(): void {
    const options: IHttpConnectionOptions = {
      accessTokenFactory: () => {
        return localStorage.getItem("jwt");
      }
    };
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.baseUrl + "message", options)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Debug)
      .build();
    this._hubConnection.start();

    this._hubConnection.on("Send", (data: any) => {
      this.handleMessage(data.message);
    })
    this._hubConnection.on("Update", (data: any) => {
      this.onMessageRecive.emit();
    })
  }

  public isConectionValid(): boolean {
    if (this._hubConnection === null || this._hubConnection === undefined) {
      return false;
    }
    return true;
  }

  public GetMeasurements(model: GetMeasurementsForDeviceInIntervalModel): Promise<SensorMeasurementDashboardModel[]> {
    if (this._hubConnection !== null && this._hubConnection !== undefined && this._hubConnection.connectionId !== null) {
      return this._hubConnection.invoke("GetMeasurements", model);
    }
    return null;
  }

  public GetWeekBaseline(model: GetMeasurementsForDeviceInIntervalModel): Promise<SensorMeasurementDashboardModel[]> {
    if (this._hubConnection !== null && this._hubConnection !== undefined && this._hubConnection.connectionId !== null) {
      return this._hubConnection.invoke("GetWeekBaseline", model);
    }
    return null;
  }

  public GetBestTimeToStartAndMeasurements(duration: number, model: GetMeasurementsForDeviceInIntervalModel): Promise<TimeToStartMeasurementModel> {
    if (this._hubConnection !== null && this._hubConnection !== undefined && this._hubConnection.connectionId !== null) {
      return this._hubConnection.invoke("GetBestTimeToStartAndMeasurements", duration, model);
    }
    return null;
  }

  public stop(): void {
    if (this._hubConnection !== null && this._hubConnection !== undefined) {
      this._hubConnection.stop();
    }
  }

  private handleMessage(message: PowerPeakMessage): void {
    if (this.shouldShowNotification(message)) {
      this.dialog.open(DialogComponentComponent, {
        data: message
      });
    }
  }

  private shouldShowNotification(message: PowerPeakMessage): boolean {
    var localUserName = localStorage.getItem("userName");
    if (message.userName !== null && localUserName !== null && this._authService.isUserAdmin() || this._authService.isUserClient()) {
      if (localUserName.toLowerCase() === message.userName.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

}
