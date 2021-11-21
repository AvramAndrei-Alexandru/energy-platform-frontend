import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Subscription } from 'rxjs';
import { GetMeasurementModel, SensorMeasurementDashboardModel } from 'src/app/models/sensor-measurement-models';
import { AuthService } from 'src/app/services/auth-service.service';
import { MessagingService } from 'src/app/services/messaging.service';
import { SensorMeasurementService } from 'src/app/services/sensor-measurement.service';

@Component({
  selector: 'app-measurements-table',
  templateUrl: './measurements-table.component.html',
  styleUrls: ['./measurements-table.component.scss']
})
export class MeasurementsTableComponent implements OnInit, OnDestroy {


  //Chart data

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Energy consumption' },
  ];

  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,255,0,0.28)',
    },
  ];

  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = 'line';

  ///


  private deviceId: string;
  private subscription: Subscription;
  public shouldDisplayAddMeasurementSection: boolean = false;
  public form: FormGroup = new FormGroup({
    measurement: new FormControl(),
    date: new FormControl(new Date()),
  });
  public format = "dd/MM/yyyy HH:mm";
  public selectedDate: Date = new Date();
  public selectedDateFormat = "dd/MM/yyyy";
  public sensorMeasurements: SensorMeasurementDashboardModel[];

  constructor(
    private _activatedroute: ActivatedRoute,
    private _authService: AuthService,
    private _sensorMeasurementService: SensorMeasurementService,
    private _datePipe: DatePipe,
    private _messagingService: MessagingService
  ) { }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.deviceId = this._activatedroute.snapshot.paramMap.get("id");
    if (this._authService.isUserAdmin()) {
      this.shouldDisplayAddMeasurementSection = true;
    }
    this.onDateSelectedChange(this.selectedDate)
    this.subscription = this._messagingService.onMessageRecive.subscribe(_ => {
      this.onDateSelectedChange(this.selectedDate);
    })
  }

  public onAddMeasurement(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    let measurement = <SensorMeasurementDashboardModel>{
      measurement: this.form.controls.measurement.value,
      timestamp: this.form.controls.date.value.toISOString(),
      smartDeviceId: this.deviceId
    };

    this._sensorMeasurementService.addMeasurement(measurement).subscribe(_ => {
      this.clearForm();
      if (this.selectedDate !== null) {
        this.onDateSelectedChange(this.selectedDate);
      }
    });
  }

  public onDateSelectedChange(newDate: Date): void {
    this.selectedDate = newDate;
    let startDate: Date = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate() - 1, 24, 0, 0, 0);
    let endDate: Date = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), 23, 59, 59, 999);
    let model = <GetMeasurementModel>{
      deviceId: this.deviceId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
    this._sensorMeasurementService.getMeasurementsForDeviceForGivenDay(model).subscribe(v => {
      this.sensorMeasurements = v;
      let data: number[] = [];
      let label: string[] = [];
      this.sensorMeasurements.forEach(s => {
        data.push(s.measurement);
        label.push(this._datePipe.transform(s.timestamp, "HH:mm"));
      })
      this.lineChartData[0].data = data;
      this.lineChartData[0].label = "Energy consumption -- " + this._datePipe.transform(this.selectedDate, "dd/MM/yyyy");
      this.lineChartLabels = label;
    })
  }

  public clearForm(): void {
    this.form.reset();
    this.form.controls.date.setValue(new Date());
  }

}
