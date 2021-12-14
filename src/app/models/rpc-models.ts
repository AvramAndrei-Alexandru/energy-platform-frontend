import { SensorMeasurementDashboardModel } from "./sensor-measurement-models";

export class GetMeasurementsForDeviceInIntervalModel {
    deviceID: string;
    startDate: string;
    endDate: string;
}

export class TimeToStartMeasurementModel {
    startTime: string;
    endTime: string;
    sensorMeasurements: SensorMeasurementDashboardModel[];
}