export class SensorMeasurementDashboardModel {
    id: string;
    timestamp: string;
    measurement: number;
    smartDeviceId: string;
}

export class GetMeasurementModel {
    deviceId: string;
    startDate: string;
    endDate: string;
}