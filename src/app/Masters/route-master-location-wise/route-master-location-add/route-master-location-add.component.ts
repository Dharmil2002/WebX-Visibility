import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { RouteLocationControl } from "src/assets/FormControls/routeLocationControl";
import { DatePipe } from "@angular/common";
import {
  columnHeader,
  generateRouteCode,
  staticField,
} from "./route-location-utility";
import { firstValueFrom } from "rxjs";
import { nextKeyCode } from "src/app/Utility/commonFunction/stringFunctions";
import { StorageService } from "src/app/core/service/storage.service";
import { RouteLocationService } from "src/app/Utility/module/masters/route-location/route-location.service";
import { SnackBarUtilityService } from "../../../Utility/SnackBarUtility.service";

@Component({
  selector: "app-route-master-location-add",
  templateUrl: "./route-master-location-add.component.html",
})
export class RouteMasterLocationAddComponent implements OnInit {
  companyCode: any = 0;
  routeMasterLocationForm: UntypedFormGroup;
  RouteDetailTableForm: UntypedFormGroup;
  jsonControlArray: any;
  submit = "save";
  routeMasterLocationFormControls: RouteLocationControl;
  breadScrums: {
    title: string;
    items: string[];
    active: string;
    generatecontrol: boolean;
    toggle: boolean;
  }[];
  controlLoc: any;
  controlLocStatus: any;
  tableLoad: boolean = true;
  locationData: any[];
  branchData: any[];
  action: string;
  data: any;
  isUpdate: any;
  menuItemflag = true;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  menuItems = [{ label: "Edit" }, { label: "Remove" }];
  tableData: any = [];
  columnHeader = columnHeader;
  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };
  staticField = staticField;
  tableView: boolean;
  filteredData: any;
  newRouteCode: string;
  datePipe: DatePipe = new DatePipe("en-US");
  jsonControlRouteDetailArray: any;
  EditTable: any;
  backPath: string;
  TableEdit: boolean = false;
  TableEditData: any;
  loccd: any;
  loccdStatus: any;
  allData: { locationData: any; branchData: any };
  locationDet: any;
  branchDet: any;
  isSubmit: boolean = false;

  constructor(
    private fb: UntypedFormBuilder,
    private route: Router,
    private masterService: MasterService,
    private filter: FilterUtils,
    private storage: StorageService,
    private routeLocation: RouteLocationService,
    private snackBarUtilityService: SnackBarUtilityService
  ) {
    this.companyCode = this.storage.companyCode;
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.data = route.getCurrentNavigation().extras.state.data;
      if (
        this.data &&
        this.data.routeDetails &&
        Array.isArray(this.data.routeDetails)
      ) {
        this.tableData = this.data.routeDetails.map((x, index) => {
          return {
            ...x,
            actions: ["Edit", "Remove"],
            Srno: index + 1,
          };
        });
      }
      this.action = "edit";
      this.isUpdate = true;
      this.submit = "Modify";
    } else {
      this.action = "Add";
      this.tableData = [];
    }
    this.breadScrums = [
      {
        title: "Route Location Wise Master",
        items: ["Masters"],
        active:
          this.action === "edit"
            ? "Modify Route Location Wise Master"
            : "Add Route Location Wise Master",
        generatecontrol: true,
        toggle: this.action === "edit" ? this.data.isActive : true,
      },
    ];
  }
  ngOnInit(): void {
    this.intializeFormControls();
    this.initializeRouteFormControl();
    this.getAllMastersData();
    this.backPath = "/Masters/RouteLocationWise/RouteList";
    this.toggleControls(true);
  }
  getlocationValidation() {
    const loc = this.RouteDetailTableForm.controls.loccd.value.value;
    if (loc && loc == this.storage.branch) {
      this.toggleControls(false);
    } else {
      this.toggleControls(true);
    }
  }
  intializeFormControls() {
    this.routeMasterLocationFormControls = new RouteLocationControl(this.data);
    this.jsonControlArray =
      this.routeMasterLocationFormControls.getFormControls();
    this.jsonControlRouteDetailArray =
      this.routeMasterLocationFormControls.getFormControlsR();
    this.routeMasterLocationForm = formGroupBuilder(this.fb, [
      this.jsonControlArray,
    ]);
    this.RouteDetailTableForm = formGroupBuilder(this.fb, [
      this.jsonControlRouteDetailArray,
    ]);
    this.routeMasterLocationForm.controls["routeType"].setValue(
      this.data?.routeType
    );
    this.routeMasterLocationForm.controls["routeCat"].setValue(
      this.data?.routeCat
    );
    this.routeMasterLocationForm.controls["routeMode"].setValue(
      this.data?.routeMode
    );
    this.routeMasterLocationForm.controls["scheduleType"].setValue(
      this.data?.scheduleType
    );
    if (!this.isUpdate) {
      this.breadScrums[0].toggle = true;
      this.onToggleChange(true);
    }
  }

  initializeRouteFormControl() {
    const customerFormControls = new RouteLocationControl(this.EditTable);
    this.jsonControlRouteDetailArray = customerFormControls.getFormControlsR();

    this.jsonControlArray.forEach((data) => {
      if (data.name === "controlLoc") {
        this.controlLoc = data.name;
        this.controlLocStatus = data.additionalData.showNameAndValue;
      }
    });

    this.jsonControlRouteDetailArray.forEach((data) => {
      if (data.name === "loccd") {
        this.loccd = data.name;
        this.loccdStatus = data.additionalData.showNameAndValue;
      }
    });

    this.RouteDetailTableForm = formGroupBuilder(this.fb, [
      this.jsonControlRouteDetailArray,
    ]);
  }
  //#region
  async getAllMastersData() {
    try {
      let locationReq = {
        companyCode: this.companyCode,
        filter: { companyCode: this.storage.companyCode },
        collectionName: "location_detail",
      };
      const locationRes = await firstValueFrom(
        this.masterService.masterPost("generic/get", locationReq)
      );
      const mergedData = {
        locationData: locationRes?.data,
        branchData: locationRes?.data,
      };
      this.allData = mergedData;

      const locationDet = mergedData.locationData.map((element) => ({
        name: element.locName,
        value: element.locCode,
      }));

      this.locationDet = locationDet;

      this.filter.Filter(
        this.jsonControlArray,
        this.routeMasterLocationForm,
        locationDet,
        this.controlLoc,
        this.controlLocStatus
      );
      this.filter.Filter(
        this.jsonControlRouteDetailArray,
        this.RouteDetailTableForm,
        locationDet,
        this.loccd,
        this.loccdStatus
      );
      this.tableLoad = true;
      this.autofillDropdown();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
  //#endregion

  //#region
  autofillDropdown() {
    if (this.isUpdate) {
      this.locationData = this.locationDet.find(
        (x) => x.value == this.data.controlLoc
      );
      this.routeMasterLocationForm.controls.controlLoc.setValue(
        this.locationData
      );

      this.locationData = this.locationDet.find(
        (x) => x.value == this.data.loccd
      );
      this.RouteDetailTableForm.controls.loccd.setValue(this.locationData);
    }
  }
  //#endregion

  //#region
  calRouteKm() {
    // Initialize a variable to store the total distance
    let totalDistKm = 0;
    // Loop through each row in the tableData
    for (let i = 0; i < this.tableData.length; i++) {
      // Extract the distance value from each row
      const distKm = parseInt(this.tableData[i].distKm);
      // Check if the value is a valid number
      if (!isNaN(distKm)) {
        // Add the valid distance to the total distance
        totalDistKm += distKm;
      }
      // Set the 'routeKm' control in the 'routeMasterLocationForm' to the total distance
      this.routeMasterLocationForm.controls["routeKm"].setValue(totalDistKm);
    }
  }
  //#region

  //#region
  async AddRowData() {
    // Set tableLoad to false to indicate data processing
    this.tableLoad = false;
    // Determine the index for the new row based on existing data or editing mode
    const Index = this.TableEdit
      ? this.TableEditData.Srno
      : this.tableData.length == 0
      ? 1
      : this.tableData.slice(-1)[0].Srno + 1;
    // Prepare the new row data
    const Body = {
      loccd: this.RouteDetailTableForm.value.loccd.value,
      distKm: this.RouteDetailTableForm.value?.distKm || 0,
      trtimeHr: this.RouteDetailTableForm.value?.trtimeHr || 0,
      sttimeHr: this.RouteDetailTableForm.value?.sttimeHr || 0,
      speedLightVeh: this.RouteDetailTableForm.value?.speedLightVeh || 0,
      speedHeavyVeh: this.RouteDetailTableForm.value?.speedHeavyVeh || 0,
      nightDrivingRestricted:
        this.RouteDetailTableForm.value?.nightDrivingRestricted || 0,
      restrictedHoursFrom:
        this.RouteDetailTableForm.value?.restrictedHoursFrom || 0,
      restrictedHoursTo:
        this.RouteDetailTableForm.value?.restrictedHoursTo || 0,
      actions: ["Edit", "Remove"], // Define actions available for the new row
    };
    // Add the new row data to the tableData
    this.tableData.push(Body);
    // Reset the form for the Route Detail Table
    this.RouteDetailTableForm.reset();
    // Introduce a delay of 1000 milliseconds (1 second)
    const delayDuration = 1000;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(delayDuration);
    // Set tableLoad to true after the delay, indicating data processing is complete
    this.tableLoad = true;
    // Fetch all master data
    this.calRouteKm();
    this.getAllMastersData();
  }
  //#endregion
  /*below function is for disbled and enbled*/
  toggleControls(enable: boolean) {
    const controls = [
      "distKm",
      "trtimeHr",
      "sttimeHr",
      "speedHeavyVeh",
      "nightDrivingRestricted",
      "restrictedHoursFrom",
      "restrictedHoursTo",
      "speedLightVeh",
    ];

    controls.forEach((control) => {
      if (enable) {
        this.RouteDetailTableForm.controls[control].enable();
      } else {
        this.RouteDetailTableForm.controls[control].disable();
      }
    });
  }

  /*End*/
  //#region
  async handleMenuItemClick(data) {
    // Trigger the fillTableValue function and pass the provided data
    this.fillTableValue(data);
  }
  //#endregion

  //#region
  fillTableValue(data: any) {
    // Checking if the operation is 'Remove'
    if (data.label.label === "Remove") {
      // If the operation is 'Remove', filter the tableData to exclude the specified Srno
      this.tableData = this.tableData.filter(
        (x) => x.loccd !== data.data.loccd
      );
    } else {
      // Find the location data that matches the specified name or value
      const updatedData = this.locationDet.find(
        (x) => x.name === data.data.loccd || x.value === data.data.loccd
      );
      // Set form control values based on the retrieved or default values
      this.RouteDetailTableForm.controls.loccd.setValue(updatedData);
      this.RouteDetailTableForm.controls["distKm"].setValue(
        data.data?.distKm || ""
      );
      this.RouteDetailTableForm.controls["trtimeHr"].setValue(
        data.data?.trtimeHr || ""
      );
      this.RouteDetailTableForm.controls["sttimeHr"].setValue(
        data.data?.sttimeHr || ""
      );
      this.RouteDetailTableForm.controls["speedLightVeh"].setValue(
        data.data?.speedLightVeh || ""
      );
      this.RouteDetailTableForm.controls["speedHeavyVeh"].setValue(
        data.data?.speedHeavyVeh || ""
      );
      this.RouteDetailTableForm.controls["nightDrivingRestricted"].setValue(
        data.data?.nightDrivingRestricted || ""
      );
      this.RouteDetailTableForm.controls["restrictedHoursFrom"].setValue(
        data.data?.restrictedHoursFrom || ""
      );
      this.RouteDetailTableForm.controls["restrictedHoursTo"].setValue(
        data.data?.restrictedHoursTo || ""
      );
      // Filter the tableData to exclude the specified Srno
      this.tableData = this.tableData.filter(
        (x) => x.loccd !== data.data.loccd
      );
    }
    this.calRouteKm();
  }
  //#endregion

  //#region
  async save() {
    if (
      !this.routeMasterLocationForm.valid ||
      (!this.RouteDetailTableForm.valid && this.tableData.length <= 1) ||
      this.isSubmit
    ) {
      this.routeMasterLocationForm.markAllAsTouched();
      this.RouteDetailTableForm.markAllAsTouched();
      Swal.fire({
        icon: "error",
        title: "Missing Information",
        text: "Please ensure all required fields are filled out.",
        showConfirmButton: true,
        confirmButtonText: "OK",
        confirmButtonColor: "#d33",
        timer: 5000,
        timerProgressBar: true,
      });
      return false;
    }
    if (this.tableData.length <= 1) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Please add atleast one Leg to the Route.",
        showConfirmButton: true,
      });
      return false;
    }
    this.snackBarUtilityService.commonToast(async () => {
      try {
        this.isSubmit = true;
        const lastRt = await this.getListId();
        const lastCode =
          lastRt?.routeId ||
          this.routeLocation.routeCodeMaster[
            this.routeMasterLocationForm.value.routeMode
          ];
        if (this.isUpdate) {
          this.newRouteCode = this.data._id;
        } else {
          this.newRouteCode = nextKeyCode(lastCode);
        }
        const routeCode = this.tableData.map((x) => x.loccd);
        const routeName = routeCode.join("-");
        if (!this.isUpdate) {
          const route = await this.routeLocation.getRouteOne({
            D$or: [
              {
                companyCode: this.storage.companyCode,
                routeName: routeName,
                routeMode: {
                  D$regex: `^${this.routeMasterLocationForm.value.routeMode}$`,
                  D$options: "i",
                },
              },
              {
                cID: this.storage.companyCode,
                rUTNM: routeName,
                rUTMODE: {
                  D$regex: `^${this.routeMasterLocationForm.value.routeMode}$`,
                  D$options: "i",
                },
              },
            ],
          });
          if (route) {
            Swal.fire({
              title: "Route already exist",
              text: "Route already exist",
              icon: "error",
              confirmButtonText: "Ok",
            });
            return false;
          }
        }
        let Body = {
          ...this.routeMasterLocationForm.value,
          cID: this.storage.companyCode,
          routeId: this.newRouteCode,
          routeMode: this.routeMasterLocationForm.value.routeMode,
          routeCat: this.routeMasterLocationForm.value.routeCat,
          routeKm: this.routeMasterLocationForm.value.routeKm,
          departureTime: parseFloat(
            this.datePipe.transform(new Date(), "HH:mm")
          ),
          controlLoc: this.routeMasterLocationForm.value.controlLoc.value,
          routeType: this.routeMasterLocationForm.value.routeType,
          scheduleType: this.routeMasterLocationForm.value.scheduleType,
          isActive: this.routeMasterLocationForm.value.isActive,
          routeName: routeName,
          updatedBy: this.storage.userName,
          _id: this.newRouteCode,
          companyCode: this.storage.companyCode,
          routeDetails: this.tableData.map((x) => {
            return {
              loccd: x.loccd,
              distKm: x.distKm,
              trtimeHr: x.trtimeHr,
              sttimeHr: x.sttimeHr,
              speedHeavyVeh: x.speedHeavyVeh,
              speedLightVeh: x.speedLightVeh,
              nightDrivingRestricted: x.nightDrivingRestricted,
              restrictedHoursFrom: x.restrictedHoursFrom,
              restrictedHoursTo: x.restrictedHoursTo,
            };
          }),
        };

        // this.customerTableForm.removeControl("customerLocationsDrop")
        if (this.isUpdate) {
          Body["mODDT"] = new Date();
          Body["mODLOC"] = this.storage.branch;
          Body["mODBY"] = this.storage.userName;
          Body["aDHOC"] = false;

          delete Body["_id"];
          delete Body["id"];
          let req = {
            companyCode: this.companyCode,
            collectionName: "routeMasterLocWise",
            filter: { routeId: this.routeMasterLocationForm.value.routeId },
            update: Body,
          };

          const res = await firstValueFrom(
            this.masterService.masterPut("generic/update", req)
          );
          this.route.navigateByUrl("/Masters/RouteLocationWise/RouteList");
          if (res) {
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
          }
        } else {
          Body["eNTDT"] = new Date();
          Body["eNTLOC"] = this.storage.branch;
          Body["eNTBY"] = this.storage.userName;
          Body["aDHOC"] = false;
          let req = {
            companyCode: this.companyCode,
            collectionName: "routeMasterLocWise",
            data: Body,
            filter:{companyCode: this.storage.companyCode,}
          };
          const res = await firstValueFrom(
            this.masterService.masterPost("generic/create", req)
          );
          if (res) {
            this.route.navigateByUrl("/Masters/RouteLocationWise/RouteList");
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
          }
        }
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", error.message);
      }
    }, "Saving Route Wise Location Master..!");
  }
  //#endregion

  cancel() {
    this.route.navigateByUrl("/Masters/RouteLocationWise/RouteList");
  }

  //#region
  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.routeMasterLocationForm.controls["isActive"].setValue(event);
    // console.log("Toggle value :", event);
  }
  //#endregion

  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  async getListId() {
    try {
      const route =
        this.routeLocation.routeCodeMaster[
          this.routeMasterLocationForm.value.routeMode
        ];
      let query = {
        companyCode: this.companyCode,
        routeMode: this.routeMasterLocationForm.value.routeMode,
        routeId: {
          D$regex: `^${route.substr(0, 1)}`,
          D$options: "i",
        },
      };
      const req = {
        companyCode: this.companyCode,
        collectionName: "routeMasterLocWise",
        filter: query,
        sorting: { routeId: -1 },
      };
      const response = await firstValueFrom(
        this.masterService.masterPost("generic/findLastOne", req)
      );
      return response?.data;
    } catch (error) {
      console.error("Error fetching user list:", error);
      throw error;
    }
  }
}
