export enum UserEndpoints {
    "GetAllUsers" = "User/Users",
    "Login" = "User/Login",
    "Register" = "User/Register",
    "Update" = "User/User",
    "Remove" = "User/User"
}

export enum SensorMeasurementEnpoints {
    "GetAllSensorMeasurementsForDevice" = "SensorMeasurement/SensorMeasurements",
    "AddMeasurement" = "SensorMeasurement/SensorMeasurement",
    "GetMeasurementsForGivenDay" = "SensorMeasurement/SensorMeasurements/Day"
}

export enum SmartDeviceEndpoints {
    "GetDevicesForUser" = "SmartDevice/Devices",
    "AddDevice" = "SmartDevice/Device",
    "UpdateDevice" = "SmartDevice/Device",
    "DeleteDevice" = "SmartDevice/Device",
    "GetDevicesForCurrentUser" = "SmartDevice/Devices",
}