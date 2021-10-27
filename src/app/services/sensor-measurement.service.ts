import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { GetMeasurementModel, SensorMeasurementDashboardModel } from '../models/sensor-measurement-models';
import { SensorMeasurementEnpoints } from '../utils/endpoints';

@Injectable({
  providedIn: 'root'
})
export class SensorMeasurementService {

  private baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient
  ) { }
    
  public getMeasurementsForDeviceForGivenDay(model: GetMeasurementModel): Observable<SensorMeasurementDashboardModel[]> {
    let url = this.baseUrl + SensorMeasurementEnpoints.GetMeasurementsForGivenDay;
    return this.http.post<SensorMeasurementDashboardModel[]>(url, model);
  }

  public addMeasurement(measurement: SensorMeasurementDashboardModel): Observable<any> {
    let url = this.baseUrl + SensorMeasurementEnpoints.AddMeasurement;
    return this.http.post<any>(url, measurement);
  }
}
