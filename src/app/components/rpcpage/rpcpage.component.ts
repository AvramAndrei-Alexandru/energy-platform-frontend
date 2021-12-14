import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChartDataSets } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { GetMeasurementsForDeviceInIntervalModel } from 'src/app/models/rpc-models';
import { SensorMeasurementDashboardModel } from 'src/app/models/sensor-measurement-models';
import { MessagingService } from 'src/app/services/messaging.service';

@Component({
  selector: 'app-rpcpage',
  templateUrl: './rpcpage.component.html',
  styleUrls: ['./rpcpage.component.scss']
})
export class RPCPageComponent implements OnInit {

  //Chart data

  lineChartData: ChartDataSets[] = [
    { data: [], label: 'Energy consumption' },
  ];

  lineChartDataBaseline: ChartDataSets[] = [
    { data: [], label: 'Energy consumption' },
  ];

  lineChartDataTimeToStart: ChartDataSets[] = [
    { data: [], label: 'Energy consumption' },
  ];

  lineChartLabelsTimeToStart: Label[] = [];
  lineChartLabelsBaseline: Label[] = [];
  lineChartLabels: Label[] = [];

  lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false
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
  public sensorMeasurements: SensorMeasurementDashboardModel[];
  public sensorMeasurementsBaseline: SensorMeasurementDashboardModel[];
  public sensorMeasurementsTimeToStart: SensorMeasurementDashboardModel[];
  public numberOfDaysInPast: number = 20;
  public programDuration: number = 1;
  public timeToStart: string;
  public timeToEnd: string;

  constructor(
    private _messagingService: MessagingService,
    private _activatedroute: ActivatedRoute,
    private _datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    if (!this._messagingService.isConectionValid()) {
      this._messagingService.start();
    }
    this.deviceId = this._activatedroute.snapshot.paramMap.get("id");
    this.loadHistoricDataTable();
    this.loadBaseline();
    this.loadProgramAndGetTime();
  }

  public onDaysValueChange(newVal: number): void {
    this.numberOfDaysInPast = newVal;
    this.loadHistoricDataTable();
  }

  public onDurationValueChange(newVal: number): void {
    this.programDuration = newVal;
    this.loadProgramAndGetTime();
  }

  private loadProgramAndGetTime(): void {
    let startDate: Date = new Date();
    let endDate: Date = new Date();
    endDate.setDate(endDate.getDate() - 1);
    startDate.setDate(endDate.getDate() - 7);
    this.resetHoursMinutesSecondsToZero(startDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    let model = <GetMeasurementsForDeviceInIntervalModel>{
      deviceID: this.deviceId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
    let promise = this._messagingService.GetBestTimeToStartAndMeasurements(this.programDuration, model);
    if (promise !== null) {
      promise.then((res) => {
        this.timeToStart = this._datePipe.transform(res.startTime, "dd/MM/YYYY HH:mm");
        this.timeToEnd = this._datePipe.transform(res.endTime, "dd/MM/YYYY HH:mm");
        this.sensorMeasurementsTimeToStart = res.sensorMeasurements;
        let data: number[] = [];
        let label: string[] = [];
        this.sensorMeasurementsTimeToStart.forEach(s => {
          data.push(s.measurement);
          label.push(this._datePipe.transform(s.timestamp, "dd/MM/YYYY HH:mm"));
        })
          this.lineChartDataTimeToStart[0].data = data;
          this.lineChartDataTimeToStart[0].label = "Energy consumption";
          this.lineChartLabelsTimeToStart = label;
        })
      }
  }

  private loadHistoricDataTable(): void {
    let startDate: Date = new Date();
    let endDate: Date = new Date();
    endDate.setDate(endDate.getDate() - 1);
    startDate.setDate(endDate.getDate() - this.numberOfDaysInPast);
    this.resetHoursMinutesSecondsToZero(startDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    let model = <GetMeasurementsForDeviceInIntervalModel>{
      deviceID: this.deviceId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
    let promise = this._messagingService.GetMeasurements(model);
    if (promise !== null) {
      promise.then((res) => {
        this.sensorMeasurements = res;
        let data: number[] = [];
        let label: string[] = [];
        this.sensorMeasurements.forEach(s => {
          data.push(s.measurement);
          label.push(this._datePipe.transform(s.timestamp, "dd/MM/YYYY HH:mm"));
        })
          this.lineChartData[0].data = data;
          this.lineChartData[0].label = "Energy consumption";
          this.lineChartLabels = label;
        })
      }
  }

  private resetHoursMinutesSecondsToZero(date: Date): void {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
  }

  private loadBaseline(): void {
    let startDate: Date = new Date();
    let endDate: Date = new Date();
    endDate.setDate(endDate.getDate() - 1);
    startDate.setDate(endDate.getDate() - 7);
    this.resetHoursMinutesSecondsToZero(startDate);
    endDate.setHours(23);
    endDate.setMinutes(59);
    let model = <GetMeasurementsForDeviceInIntervalModel>{
      deviceID: this.deviceId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }
    let promise = this._messagingService.GetWeekBaseline(model);
    if (promise !== null) {
      promise.then((res) => {
        this.sensorMeasurementsBaseline = res;
        let data: number[] = [];
        let label: string[] = [];
        this.sensorMeasurementsBaseline.forEach(s => {
          data.push(s.measurement);
          label.push(this._datePipe.transform(s.timestamp, "HH:mm"));
        })
          this.lineChartDataBaseline[0].data = data;
          this.lineChartDataBaseline[0].label = "Energy consumption";
          this.lineChartLabelsBaseline = label;
        })
      }
  }

}
