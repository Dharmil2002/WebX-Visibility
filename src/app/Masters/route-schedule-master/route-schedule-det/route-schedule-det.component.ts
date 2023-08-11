import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { forkJoin, map } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-route-schedule-det',
  templateUrl: './route-schedule-det.component.html'
})
export class RouteScheduleDetComponent implements OnInit {
  tableLoad: boolean;
  weekDay: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private masterService: MasterService,) { }
  // Define column headers for the table
  columnHeader =
    {
      "srNo": "Sr No.",
      "routeCode": "Route Code",
      "weekDay": "Week Days",
      "time": "Time",
      "vendor": "Vendor",
      "ftlType": "FTL Type",
      "vehicleNo": "Vehicle",
      "activeSchedule": "Active Schedule",
    };
  linkArray = [];
  toggleArray = [];
  menuItems = [];
  dynamicControls = {
    add: false,
    edit: false,
    csv: false
  };
  height = '100vw';
  width = '100vw';
  maxWidth: '232vw';
  ngOnInit(): void {
    this.getWeekData();
  }
  getWeekData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const { weekDayDropdown } = res;
      this.weekDay = weekDayDropdown;
      this.getRouteData();
    });
  }
  // Function to get data related to vehicles, vendors, and vehicle types
  getRouteData() {
    // Create the requests to fetch data
    const vehicleReq = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      type: "masters",
      collection: "vehicle_detail",
    };

    const vendorReq = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      type: "masters",
      collection: "vendor_detail",
    };

    const vehicleTypeReq = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      type: "masters",
      collection: "vehicleType_detail",
    };

    // Use forkJoin to make parallel requests and get all data at once
    forkJoin([
      this.masterService.masterPost('common/getall', vehicleReq),
      this.masterService.masterPost('common/getall', vendorReq),
      this.masterService.masterPost('common/getall', vehicleTypeReq),
    ]).pipe(
      map(([vehicleRes, vendorRes, vehicleTypeRes]) => {
        // Combine all the data into a single object
        return {
          vehicleData: vehicleRes?.data,
          vendorData: vendorRes?.data,
          vehicleTypeData: vehicleTypeRes?.data,
        };
      })
    ).subscribe((mergedData) => {
      // Access the merged data here
      const vehicleDet = mergedData.vehicleData.map(element => ({
        name: element.vehicleNo,
        value: element.id,
      }));

      const vendorDet = mergedData.vendorData.map(element => ({
        name: element.vendorName,
        value: element.vendorCode,
      }));

      const vehicleTypeDet = mergedData.vehicleTypeData.map(element => ({
        name: element.vehicleTypeName,
        value: element.vehicleTypeCode,
      }));

      // Function to transform array properties
      function transformArrayProperties(data) {
        const transformedData = [];
        const len = Math.max(
          data.routeCode.length,
          data.weekDay.length,
          data.time.length,
          data.vendor.length,
          data.ftlType.length,
          data.vehicleNo.length,
          data.activeSchedule.length,
        );

        for (let i = 0; i < len; i++) {
          transformedData.push({
            routeCode: data.routeCode[i],
            weekDay: data.weekDay[i],
            time: data.time[i],
            vendor: data.vendor[i],
            ftlType: data.ftlType[i],
            vehicleNo: data.vehicleNo[i],
            activeSchedule: data.activeSchedule[i] || false,
          });
        }
        return transformedData;
      }

      // Transform the array properties of 'this.data'
      const transformedData = transformArrayProperties(this.data);
      this.data = transformedData.map((obj, index) => {
        obj['srNo'] = index + 1;

        // Transform 'vendor', 'vehicleNo', 'ftlType', and 'weekDay' properties
        const matchingVendor = vendorDet.find((x) => x.value === obj.vendor);
        obj['vendor'] = matchingVendor ? `${matchingVendor.value} : ${matchingVendor.name}` : '';

        const matchingVehicle = vehicleDet.find((x) => x.value === obj.vehicleNo);
        obj['vehicleNo'] = matchingVehicle ? `${matchingVehicle.value} : ${matchingVehicle.name}` : '';

        const matchingVehicleType = vehicleTypeDet.find((x) => x.value === obj.ftlType);
        obj['ftlType'] = matchingVehicleType ? `${matchingVehicleType.value} : ${matchingVehicleType.name}` : '';

        const matchingWeekDay = this.weekDay.find((x) => x.value === obj.weekDay);
        obj['weekDay'] = matchingWeekDay ? `${matchingWeekDay.name}` : '';

        return obj;
      });

      this.tableLoad = false;
    });
  }

}
