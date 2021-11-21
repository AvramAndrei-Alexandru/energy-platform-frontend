import { EventEmitter, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import * as signalR from "@microsoft/signalr";
import { HubConnection } from '@microsoft/signalr';
import { cwd } from 'process';
import { environment } from 'src/environments/environment';
import { DialogComponentComponent } from '../components/dialog-component/dialog-component.component';
import { PowerPeakMessage } from '../models/messaging-models';


@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  private _hubConnection: HubConnection | undefined
  public onMessageRecive: EventEmitter<any> = new EventEmitter();

  constructor(public dialog: MatDialog) { }

  public start(): void {
    this._hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(environment.baseUrl + "message")
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
    if (message.userName !== null && localUserName !== null) {
      if (localUserName.toLowerCase() === message.userName.toLowerCase()) {
        return true;
      }
    }
    return false;
  }

}
