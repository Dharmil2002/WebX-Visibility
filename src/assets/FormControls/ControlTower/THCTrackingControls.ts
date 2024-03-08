import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { vehicleModel } from "src/app/core/models/Masters/vehicle-master";
export class THCTrackingControls {
  private thcTrackingControlArray: FormControls[];
  constructor(vehicleTable) {
    this.thcTrackingControlArray = [
      {
        name: "vehicleNo",
        label: "Vehicle Number",
        placeholder: "",
        type: "text",
        value: vehicleTable?.vehicleNo,
        Validations: [],
        generatecontrol: true,
        disable: true,
      },
      {
        name: "gpsDeviceEnabled",
        label: "GPS Device Enabled",
        placeholder: "",
        type: "toggle",
        value: vehicleTable.gpsDeviceEnabled,
        Validations: [],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "gpsDeviceId",
        label: "Device Id",
        placeholder: "",
        type: "text",
        value: vehicleTable.gpsDeviceId,
        Validations: [
          {
            name: "required",
            message: "Please Enter DevideId",
          },
        ],
        generatecontrol: true,
        disable: false,
      },
      {
        name: "providerId",
        label: "GPS Provider",
        placeholder: "",
        type: "dropdown",
        value: vehicleTable.vehicleType,
        Validations: [
          {
            name: "required",
            message: "Vehicle Type is required",
          },
          {
            name: "autocomplete",
          },
        ],
        additionalData: {
          showNameAndValue: false,
        },
        generatecontrol: true,
        disable: false,
      },
    ];
  }
  getTHCTrackingControls(){
    return this.thcTrackingControlArray;
  }
}
