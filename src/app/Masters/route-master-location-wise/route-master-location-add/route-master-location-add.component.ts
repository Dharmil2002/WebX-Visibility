import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { RouteLocationControl } from 'src/assets/FormControls/routeLocationControl';
import { DatePipe } from '@angular/common';
import { columnHeader, generateRouteCode, staticField } from './route-location-utility';
import { firstValueFrom } from 'rxjs';
import { nextKeyCode } from 'src/app/Utility/commonFunction/stringFunctions';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-route-master-location-add',
  templateUrl: './route-master-location-add.component.html'
})
export class RouteMasterLocationAddComponent implements OnInit {
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  routeMasterLocationForm: UntypedFormGroup;
  RouteDetailTableForm: UntypedFormGroup;
  jsonControlArray: any;
  submit = 'save';
  routeMasterLocationFormControls: RouteLocationControl;
  breadScrums: { title: string; items: string[]; active: string; generatecontrol: boolean; toggle: any; }[];
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
  allData: { locationData: any; branchData: any; };
  locationDet: any;
  branchDet: any;

  constructor
  (private fb: UntypedFormBuilder,
   private route: Router,
   private masterService: MasterService,
   private filter: FilterUtils,
   private storage:StorageService
  ) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.data = route.getCurrentNavigation().extras.state.data;
      this.action = 'edit'
      this.isUpdate = true;
      this.submit = 'Modify';
    } else {
      this.action = "Add";
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      if (this.data && this.data.routeDetails && Array.isArray(this.data.routeDetails)) {
        this.tableData = this.data.routeDetails.map((x, index) => {
          return {
            ...x,
            actions: ["Edit", "Remove"],
            Srno: index + 1,
          };
        });
      } else {
        this.tableData = [];
      }
      this.breadScrums = [
        {
          title: "Modify Route Location Wise Master",
          items: ["Home"],
          active: "Modify Route Location Wise Master",
          generatecontrol: true,
          toggle: this.data.isActive
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Route Location Wise Master",
          items: ["Home"],
          active: "Add Route Location Wise Master",
          generatecontrol: true,
          toggle: false
        },
      ];
    }
  }
  ngOnInit(): void {
    this.intializeFormControls();
    this.initializeRouteFormControl();
    this.getAllMastersData();
    this.backPath = "/Masters/RouteLocationWise/RouteList";
  }

  intializeFormControls() {
    this.routeMasterLocationFormControls = new RouteLocationControl(this.data);
    this.jsonControlArray = this.routeMasterLocationFormControls.getFormControls();
    this.jsonControlRouteDetailArray = this.routeMasterLocationFormControls.getFormControlsR();
    this.routeMasterLocationForm = formGroupBuilder(
      this.fb,
      [
        this.jsonControlArray
      ]);
    this.RouteDetailTableForm = formGroupBuilder(
      this.fb,
      [
        this.jsonControlRouteDetailArray
      ]);
    this.routeMasterLocationForm.controls["routeType"].setValue(this.data?.routeType);
    this.routeMasterLocationForm.controls["routeCat"].setValue(this.data?.routeCat);
    this.routeMasterLocationForm.controls["routeMode"].setValue(this.data?.routeMode);
    this.routeMasterLocationForm.controls["scheduleType"].setValue(this.data?.scheduleType);
  }

  initializeRouteFormControl() {
    const customerFormControls = new RouteLocationControl(
      this.EditTable
    );
    this.jsonControlRouteDetailArray = customerFormControls.getFormControlsR();

    this.jsonControlArray.forEach((data) => {
      if (data.name === "controlLoc") {
        this.controlLoc = data.name;
        this.controlLocStatus = data.additionalData.showNameAndValue;
      }
    });

    this.jsonControlRouteDetailArray.forEach((data) => {
      if (data.name === 'loccd') {
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
        filter: {},
        collectionName: "location_detail",
      };
      const locationRes = await firstValueFrom(this.masterService
        .masterPost("generic/get", locationReq))
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
      this.routeMasterLocationForm.controls.controlLoc.setValue(this.locationData);

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
    const Index = this.TableEdit ? this.TableEditData.Srno :
      this.tableData.length == 0 ? 1 : this.tableData.slice(-1)[0].Srno + 1;
    // Prepare the new row data
    const Body = {
      loccd: this.RouteDetailTableForm.value.loccd.value,
      distKm: this.RouteDetailTableForm.value.distKm,
      trtimeHr: this.RouteDetailTableForm.value.trtimeHr,
      sttimeHr: this.RouteDetailTableForm.value.sttimeHr,
      speedLightVeh: this.RouteDetailTableForm.value.speedLightVeh,
      speedHeavyVeh: this.RouteDetailTableForm.value.speedHeavyVeh,
      nightDrivingRestricted: this.RouteDetailTableForm.value.nightDrivingRestricted,
      restrictedHoursFrom: this.RouteDetailTableForm.value.restrictedHoursFrom,
      restrictedHoursTo: this.RouteDetailTableForm.value.restrictedHoursTo,
      actions: ["Edit", "Remove"],// Define actions available for the new row
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
    this.getAllMastersData();
  }
  //#endregion

  //#region
  async handleMenuItemClick(data) {
    // Trigger the fillTableValue function and pass the provided data
    this.fillTableValue(data);
  }
  //#endregion

  //#region 
  fillTableValue(data: any) {
    // Checking if the operation is 'Remove'
    if (data.label.label === 'Remove') {
      // If the operation is 'Remove', filter the tableData to exclude the specified Srno
      this.tableData = this.tableData.filter((x) => x.Srno !== data.data.Srno);
    }
    else {
      // Find the location data that matches the specified name or value
      const updatedData = this.locationDet.find((x) => x.name === data.data.loccd || x.value === data.data.loccd);
      // Set form control values based on the retrieved or default values
      this.RouteDetailTableForm.controls.loccd.setValue(updatedData);
      this.RouteDetailTableForm.controls['distKm'].setValue(data.data?.distKm || "");
      this.RouteDetailTableForm.controls['trtimeHr'].setValue(data.data?.trtimeHr || "");
      this.RouteDetailTableForm.controls['sttimeHr'].setValue(data.data?.sttimeHr || "");
      this.RouteDetailTableForm.controls['speedLightVeh'].setValue(data.data?.speedLightVeh || "");
      this.RouteDetailTableForm.controls['speedHeavyVeh'].setValue(data.data?.speedHeavyVeh || "");
      this.RouteDetailTableForm.controls['nightDrivingRestricted'].setValue(data.data?.nightDrivingRestricted || "");
      this.RouteDetailTableForm.controls['restrictedHoursFrom'].setValue(data.data?.restrictedHoursFrom || "");
      this.RouteDetailTableForm.controls['restrictedHoursTo'].setValue(data.data?.restrictedHoursTo || "");
      // Filter the tableData to exclude the specified Srno
      this.tableData = this.tableData.filter((x) => x.Srno !== data.data.Srno);
    }
  }
  //#endregion

  //#region 
  async save() {
    const lastRt = await this.getListId();    
    const lastCode = lastRt?.routeId || "R0000";
    if (this.isUpdate) {
      this.newRouteCode = this.data._id;
    } else {
      this.newRouteCode = nextKeyCode(lastCode);
    }
    const routeCode=this.tableData.map((x) => x.loccd);
    const routeName=routeCode.join('-');
    let Body = {
      ...this.routeMasterLocationForm.value,
      cID:this.storage.companyCode,
      routeId: this.newRouteCode,
      routeMode: this.routeMasterLocationForm.value.routeMode,
      routeCat: this.routeMasterLocationForm.value.routeCat,
      routeKm: this.routeMasterLocationForm.value.routeKm,
      departureTime: parseFloat(this.datePipe.transform(new Date(), "HH:mm")),
      controlLoc: this.routeMasterLocationForm.value.controlLoc.value,
      routeType: this.routeMasterLocationForm.value.routeType,
      scheduleType: this.routeMasterLocationForm.value.scheduleType,
      isActive: this.routeMasterLocationForm.value.isActive,
      routeName:routeName,
      updatedBy: localStorage.getItem("UserName"),
      _id: this.newRouteCode,
      companyCode: localStorage.getItem("companyCode"),
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
  
   let routeMasterLocWise ={
      "_id":`${this.storage.companyCode}-${this.newRouteCode}`,
      "cID": this.storage.companyCode,
      "tHC": "",
      "rUTCD":this.newRouteCode,
      "rUTNM":routeName,
      "sTM": new Date(),
      "cTM": "",
      "vEHNO": "",
      "sTS": 1,
      "sTSNM": "Route Added",
      "cLOC":this.storage.branch,
      "oRG":this.storage.branch,
      "iSACT": this.routeMasterLocationForm.value.isActive,
      "dEST": "",
      "nXTLOC": "",
      "nXTETA": ""
    }
    // this.customerTableForm.removeControl("customerLocationsDrop")
    if (this.isUpdate) {
      Body['mODDT']= new Date();
      Body['mODLOC']=this.storage.branch;
      Body['mODBY']=this.storage.userName;
      routeMasterLocWise['mODDT']= new Date();
      routeMasterLocWise['mODLOC']=this.storage.branch;
      routeMasterLocWise['mODBY']=this.storage.userName;
      
      let req = {
        companyCode: this.companyCode,
        collectionName: "routeMasterLocWise",
        filter: { routeId:  this.routeMasterLocationForm.value.routeId },
        update: Body,
      };
      let reqloc = {
        companyCode: this.companyCode,
        collectionName: "trip_Route_Schedule",
        filter: { rUTCD:  this.routeMasterLocationForm.value.routeId },
        update: Body,
      };
      const res= await firstValueFrom(this.masterService.masterPut("generic/update", req));
      await firstValueFrom(this.masterService.masterPut("generic/update", reqloc));
          this.route.navigateByUrl(
            "/Masters/RouteLocationWise/RouteList"
          );
          if (res) {
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
          }
    } else {
      Body['eNTDT']= new Date();
      Body['eNTLOC']=this.storage.branch;
      Body['eNTBY']=this.storage.userName;
      routeMasterLocWise['eNTDT']= new Date();
      routeMasterLocWise['eNTLOC']=this.storage.branch;
      routeMasterLocWise['eNTBY']=this.storage.userName;
      let req = {
        companyCode: this.companyCode,
        collectionName: "routeMasterLocWise",
        data: Body,
      };
      let reqloc = {
        companyCode: this.companyCode,
        collectionName: "trip_Route_Schedule",
        data:routeMasterLocWise
      };
      const res=await firstValueFrom(this.masterService.masterPost("generic/create", req))
      await firstValueFrom(this.masterService.masterPost("generic/create", reqloc))
          if (res) {
            this.route.navigateByUrl(
              "/Masters/RouteLocationWise/RouteList"
            );
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
          }
    }
  }
  //#endregion

  cancel() {
    this.route.navigateByUrl("/Masters/RouteLocationWise/RouteList");
  }

  //#region 
  onToggleChange(event: boolean) {
    // Handle the toggle change event in the parent component
    this.routeMasterLocationForm.controls['isActive'].setValue(event);
    // console.log("Toggle value :", event);
  }
  //#endregion

  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  async getListId() {
    try {
      let query = { companyCode: this.companyCode };
      const req = { companyCode: this.companyCode, collectionName: "routeMasterLocWise", filter: query, sorting: {routeId:-1} };
      const response = await firstValueFrom(this.masterService.masterPost("generic/findLastOne", req));
      return response?.data;
    } catch (error) {
      console.error("Error fetching user list:", error);
      throw error;
    }
  }
}
