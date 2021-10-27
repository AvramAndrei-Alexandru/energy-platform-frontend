import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SmartDeviceDashboardModel } from '../models/smart-device-models';
import { SmartDeviceEndpoints } from '../utils/endpoints';

@Injectable({
  providedIn: 'root'
})
export class SmartDeviceService {

  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }

  public getAllDevicesForClient(clientId: string): Observable<SmartDeviceDashboardModel[]> {
    let url = this.baseUrl + SmartDeviceEndpoints.GetDevicesForUser + '/' + clientId;
    return this.http.get<SmartDeviceDashboardModel[]>(url);
  }

  public getAllDevicesForCurrentClient(): Observable<SmartDeviceDashboardModel[]> {
    let url = this.baseUrl + SmartDeviceEndpoints.GetDevicesForCurrentUser;
    return this.http.get<SmartDeviceDashboardModel[]>(url);
  }

  public addDevice(device: SmartDeviceDashboardModel): Observable<any> {
    let url = this.baseUrl + SmartDeviceEndpoints.AddDevice;
    return this.http.post<any>(url, device);
  }

  public updateDevice(device: SmartDeviceDashboardModel): Observable<any> {
    let url = this.baseUrl + SmartDeviceEndpoints.UpdateDevice;
    return this.http.put<any>(url, device);
  }

  public deleteDevice(deviceId: string): Observable<any> {
    let url = this.baseUrl + SmartDeviceEndpoints.DeleteDevice + '/' + deviceId;
    return this.http.delete<any>(url);
  }
}
