import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { RouteScheduleControl } from "src/assets/FormControls/route-schedule-control";
import { forkJoin, map } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-route-schedule-master',
  templateUrl: './add-route-schedule-master.component.html'
})
export class AddRouteScheduleMasterComponent implements OnInit {
  routeScheduleTableForm: UntypedFormGroup;
  jsonControlArray: any;
  routeScheduleFormControls: RouteScheduleControl;
  // Breadcrumbs
  breadScrums = [
    {
      title: "Route Schedule Master",
      items: ["Masters"],
      active: "Route Schedule Master",
    },
  ];
  newRouteCode: string;
  datePipe: DatePipe = new DatePipe("en-US");
  routeName: any;
  routeNameStatus: any;
  action: string;
  data: any;
  backPath:string;
  isUpdate: any;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  // Displayed columns configuration
  displayedColumns1 = {
    srNo: {
      name: "Sr No",
      key: "index",
      style: "min-width:100px;",
      Headerstyle: { 'min-width': '10px' },
    },
    routeCode: {
      name: "Route Code",
      key: "inputString",
      style: "",
    },
    weekDay: {
      name: "Week Day",
      key: "Dropdown",
      option: [],
      style: "",
    },
    time: {
      name: "Time",
      key: "time",
      style: "",
    },
    vendor: {
      name: "Vendor",
      key: "Dropdown",
      option: [],
      style: "",
    },
    ftlType: {
      name: "FTL Type",
      key: "Dropdown",
      option: [],
      style: "",
    },
    vehicleNo: {
      name: "Vehicle",
      key: "Dropdown",
      option: [],
      style: "",
    },
    activeSchedule: {
      name: "Active Schedule",
      key: "toggle",
      style: "min-width:100px;",
      Headerstyle: { 'min-width': '10px' },
    },
    action: {
      name: "Action",
      key: "Action",
      style: "",
    }
  };
  // Table data
  tableData: any = [];
  // Action buttons configuration
  actionObject = {
    addRow: true,
    submit: false,
    search: true
  };
  tableDet: boolean;
  tableLoad = false;
  allData: { routeData: any; vehicleData: any; vendorData: any; vehicleTypeData: any; };
  updateRoute: any;
  constructor(private fb: UntypedFormBuilder, private route: Router, private masterService: MasterService, private filter: FilterUtils,) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.data = route.getCurrentNavigation().extras.state.data;
      this.action = 'edit'
      this.isUpdate = true;
      this.getRouteDet();
    } else {
      this.action = "Add";
      this.loadTempData('');
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      this.breadScrums = [
        {
          title: "Route Schedule Master",
          items: ["Masters"],
          active: "Edit Route Schedule Master",
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Route Schedule Master",
          items: ["Masters"],
          active: "Add Route Schedule Master",
        },
      ];
    }
  }
  ngOnInit(): void {
    this.intializeFormControls();
    this.getDropDownData();
    this.getAllMastersData();
    this.backPath = "/Masters/RouteScheduleMaster/RouteScheduleMasterList";
  }
  intializeFormControls() {
    this.routeScheduleFormControls = new RouteScheduleControl(this.data, this.isUpdate);
    this.jsonControlArray = this.routeScheduleFormControls.getRouteScheduleFormControls();
    this.jsonControlArray.forEach(data => {
      if (data.name === 'routeName') {
        this.routeName = data.name;
        this.routeNameStatus = data.additionalData.showNameAndValue;
      }
    });
    this.routeScheduleTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.routeScheduleTableForm.controls["routeMode"].setValue(this.data?.routeMode);
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const { weekDayDropdown } = res;
      this.displayedColumns1.weekDay.option = weekDayDropdown;
    });
  }
  cancel() {
    this.route.navigateByUrl('/Masters/RouteScheduleMaster/RouteScheduleMasterList');
  }

  save() {
    const scheduleType = this.routeScheduleTableForm.value.scheduleType;
    const tableDataLength = this.tableData.length;

    // Check for schedule type and table data length
    if (scheduleType === "2 Days" && tableDataLength !== 2) {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: "Please Enter 2 Row items for 2 Days",
        showConfirmButton: true,
      });
      return; // Exit the function to prevent saving invalid data.
    }
    if (scheduleType === "3 Days" && tableDataLength !== 3) {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: "Please Enter 3 Row items for 3 Days",
        showConfirmButton: true,
      });
      return; // Exit the function to prevent saving invalid data.
    }
    if (scheduleType === "4 Days" && tableDataLength !== 4) {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: "Please Enter 4 Row items for 4 Days",
        showConfirmButton: true,
      });
      return; // Exit the function to prevent saving invalid data.
    }
    if (scheduleType === "5 Days" && tableDataLength !== 5) {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: "Please Enter 5 Row items for 5 Days",
        showConfirmButton: true,
      });
      return; // Exit the function to prevent saving invalid data.
    }
    if (scheduleType === "6 Days" && tableDataLength !== 6) {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: "Please Enter 6 Row items for 6 Days",
        showConfirmButton: true,
      });
      return; // Exit the function to prevent saving invalid data.
    }
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      filter: {},
      "collectionName": "route_schedule_details"
    }
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          const lastRoute = res.data[res.data.length - 1];
          const lastRouteCode = lastRoute ? parseInt(lastRoute.scheduleCode.substring(3)) : 0;
          // Function to generate a new route code
          function generateRouteCode(initialCode: number = 0) {
            const nextRouteCode = initialCode + 1;
            const routeNumber = nextRouteCode.toString().padStart(4, '0');
            const routeCode = `SCH${routeNumber}`;
            return routeCode;
          }
          if (this.isUpdate) {
            this.newRouteCode = this.data._id
          } else {
            this.newRouteCode = generateRouteCode(lastRouteCode);
          }
          const options = { hour: 'numeric', minute: 'numeric', hour12: false };
          const transformedData = {
            scheduleCode: this.newRouteCode,
            routeMode: this.routeScheduleTableForm.value.routeMode,
            routeName: this.routeScheduleTableForm.value.routeName.value,
            routeId: this.routeScheduleTableForm.value.routeName.name,
            applyDate: this.datePipe.transform(this.routeScheduleTableForm.value.applyFrom, "dd-MM-yyyy"),
            scheduleType: this.routeScheduleTableForm.value.scheduleType,
            isActive: this.routeScheduleTableForm.value.isActive,
            _id: this.newRouteCode,
            routeCode: this.tableData.map((item) => item.routeCode),
            weekDay: this.tableData.map((item) => parseInt(item.weekDay)),
            time: this.tableData.map((item) => new Date(item.time).toLocaleTimeString(undefined, options as Intl.DateTimeFormatOptions)),
            vendor: this.tableData.map((item) => item.vendor),
            ftlType: this.tableData.map((item) => item.ftlType),
            vehicleNo: this.tableData.map((item) => item.vehicleNo),
            activeSchedule: this.tableData.map((item) => item.activeSchedule != "" ? true : false),
            entryBy: localStorage.getItem('Username'),
            entryDate: new Date().toISOString()
          };

          if (this.isUpdate) {
            let id = transformedData._id;
            // Remove the "id" field from the form controls
            delete transformedData._id;
            let req = {
              companyCode: parseInt(localStorage.getItem("companyCode")),
              collectionName: "route_schedule_details",
              filter: { _id: id },
              update: transformedData
            };
            this.masterService.masterPut('generic/update', req).subscribe({
              next: (res: any) => {
                if (res) {
                  // Display success message
                  Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: res.message,
                    showConfirmButton: true,
                  });
                  this.route.navigateByUrl('/Masters/RouteScheduleMaster/RouteScheduleMasterList');
                }
              }
            });
          } else {
            let req = {
              companyCode: parseInt(localStorage.getItem("companyCode")),
              collectionName: "route_schedule_details",
              data: transformedData
            };
            this.masterService.masterPost('generic/create', req).subscribe({
              next: (res: any) => {
                if (res) {
                  // Display success message
                  Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: res.message,
                    showConfirmButton: true,
                  });
                  this.route.navigateByUrl('/Masters/RouteScheduleMaster/RouteScheduleMasterList');
                }
              }
            });
          }
        }
      }
    })
  }
  // Load temporary data
  loadTempData(det) {
    this.tableData = det ? det : [];
    if (this.tableData.length === 0) {
      this.addItem();
    }
  }

  // Add a new item to the table
  addItem() {
    const AddObj = {
      srNo: 0,
      routeCode: "",
      weekDay: [],
      time: "",
      vendor: [],
      ftlType: [],
      vehicle: [],
      handoverTakeover: "",
      activeSchedule: "",
      action: "",
    };
    this.tableData.splice(0, 0, AddObj);
  }
  // Delete a row from the table
  async delete(event) {
    const index = event.index;
    const row = event.element;

    const swalWithBootstrapButtons = await Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success msr-2",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `<h4><strong>Are you sure you want to delete ?</strong></h4>`,
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        showLoaderOnConfirm: true,
        preConfirm: (Remarks) => {
          var request = {
            companyCode: localStorage.getItem("CompanyCode"),
            id: row.id,
          };
          if (row.id == 0) {
            return {
              isSuccess: true,
              message: "City has been deleted !",
            };
          } else {
            console.log("Request", request);
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then((result) => {

        if (result.isConfirmed) {
          this.tableData.splice(index, 1);
          this.tableData = this.tableData;
          swalWithBootstrapButtons.fire("Deleted!", "Your Message", "success");
          event.callback(true);
        } else if (result.isConfirmed) {
          swalWithBootstrapButtons.fire("Not Deleted!", "Your Message", "info");
          event.callback(false);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your item is safe :)",
            "error"
          );
          event.callback(false);
        }
      });

    return true;
  }
  getRouteDet() {
    function convertTimeFormat(inputTime: string): string {
      if (!inputTime) {
        return "N/A"; // Handle empty input time here, you can return a default value
      }

      const [hours, minutes] = inputTime.split(':').map(Number);

      // Create a new date with the provided time
      const currentDateTime = new Date();
      currentDateTime.setHours(hours, minutes, 0, 0);

      // Format the date to the desired format
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      };

      return currentDateTime.toLocaleDateString('en-US', options);
    }
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
          time: convertTimeFormat(data.time[i]),//data.time[i],
          vendor: data.vendor[i],
          ftlType: data.ftlType[i],
          vehicleNo: data.vehicleNo[i],
          activeSchedule: data.activeSchedule[i] || false,
        });
      }
      return transformedData;
    }
    const transformedData = transformArrayProperties(this.data);
    this.loadTempData(transformedData);
  }
  // Get all dropdown data
  getAllMastersData() {
    // Prepare the requests for different collections
    let routeReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      filter: {},
      "collectionName": "routeMasterLocWise"
    };

    let vehicleReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      filter: {},
      "collectionName": "vehicle_detail"
    };

    let vendorReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      filter: {},
      "collectionName": "vendor_detail"
    };

    let vehicleTypeReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      filter: {},
      "collectionName": "vehicleType_detail"
    };

    // Use forkJoin to make parallel requests and get all data at once
    forkJoin([
      this.masterService.masterPost('generic/get', routeReq),
      this.masterService.masterPost('generic/get', vehicleReq),
      this.masterService.masterPost('generic/get', vendorReq),
      this.masterService.masterPost('generic/get', vehicleTypeReq)
    ]).pipe(
      map(([routeRes, vehicleRes, vendorRes, vehicleTypeRes]) => {
        // Combine all the data into a single object
        return {
          routeData: routeRes?.data,
          vehicleData: vehicleRes?.data,
          vendorData: vendorRes?.data,
          vehicleTypeData: vehicleTypeRes?.data
        };
      })
    ).subscribe((mergedData) => {
      this.allData = mergedData;
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
      this.displayedColumns1.vendor.option = vendorDet;
      this.displayedColumns1.vehicleNo.option = vehicleDet;
      this.displayedColumns1.ftlType.option = vehicleTypeDet;
      const catData = mergedData.routeData.filter(item => item.routeMode === this.routeScheduleTableForm.value.routeMode);
      const routeDet = catData.map(element => ({
        name: element.loccd.join('-'),
        value: element.routeId,
      }));
      if (this.isUpdate) {
        this.updateRoute = routeDet.find((x) => x.name == this.data.routeId);
        this.routeScheduleTableForm.controls.routeName.setValue(this.updateRoute);
        this.setScheduleType();
      }
      this.filter.Filter(
        this.jsonControlArray,
        this.routeScheduleTableForm,
        routeDet,
        this.routeName,
        this.routeNameStatus,
      );
      this.tableLoad = true;

    });

  }
  setScheduleType() {
    if (this.isUpdate) {
      this.routeScheduleTableForm.controls["scheduleType"].setValue(this.data.scheduleType);
    }
    else {
      const routeDetails = this.allData.routeData.find((route) => route.routeId === this.routeScheduleTableForm.value.routeName.value);
      this.routeScheduleTableForm.controls["scheduleType"].setValue(routeDetails.scheduleType)
    }

  }
}
