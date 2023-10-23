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
  action: string;
  addFlag = true;
  data: any;
  isUpdate: any;
  updateState: any;
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

  constructor(private fb: UntypedFormBuilder, private route: Router, private masterService: MasterService, private filter: FilterUtils,) {
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
      this.tableData = this.data.GSTdetails.map((x, index) => {
        return {
          ...x,
          actions: ["Edit", "Remove"],
          Srno: index + 1,
        };
      });
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
    this.getControlBranchDropdown();
    this.bindDropdown();
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
    // this.jsonControlCustomerArray = customerFormControls.getFormControls();
    this.jsonControlRouteDetailArray = customerFormControls.getFormControlsR();

    // Build the form group using formGroupBuilder function and the values of accordionData
    this.RouteDetailTableForm = formGroupBuilder(this.fb, [
      this.jsonControlRouteDetailArray,
    ]);
  }

  //#region 
  bindDropdown() {
    this.jsonControlArray.forEach((data) => {
      if (data.name === 'controlLoc') {
        this.controlLoc = data.name;
        this.controlLocStatus = data.additionalData.showNameAndValue;
      }
    });
  }
  //#region 

  //#region 
  getControlBranchDropdown() {
    let req = {
      companyCode: this.companyCode,
      collectionName: "location_detail",
      filter: {},
    };
    this.masterService.masterPost("generic/get", req).subscribe({
      next: (res: any) => {
        if (res && res.success) {
          const dropdownData = res.data.map((x) => {
            return {
              name: x.locName,
              value: x.locCode,
            };
          });
          if (this.isUpdate) {
            res.data.forEach((x) => {
              if (x.locName == this.data.controlLoc) {
                this.routeMasterLocationForm.controls["controlLoc"].setValue({
                  name: x.locName,
                  value: x.locCode,
                });
              }
            });
          }
          this.filter.Filter(
            this.jsonControlArray,
            this.routeMasterLocationForm,
            dropdownData,
            this.controlLoc,
            this.controlLocStatus
          );
        }
      },
    });
  }
  //#region 

  //#region 
  calRouteKm() {
    let totalDistKm = 0;
    for (let i = 0; i < this.tableData.length; i++) {
      const distKm = parseInt(this.tableData[i].distKm);
      if (!isNaN(distKm)) {
        totalDistKm += distKm;
      }
      this.routeMasterLocationForm.controls["routeKm"].setValue(totalDistKm);
    }
  }
  //#region 

  //#region 
  async AddRowData() {
    this.tableLoad = false;
    const Index = this.TableEdit ? this.TableEditData.Srno :
      this.tableData.length == 0 ? 1 : this.tableData.slice(-1)[0].Srno + 1;
    const Body = {
      Srno: parseInt(Index),
      loccd: this.RouteDetailTableForm.value.loccd,
      distKm: this.RouteDetailTableForm.value.distKm,
      trtimeHr: this.RouteDetailTableForm.value.trtimeHr,
      sttimeHr: this.RouteDetailTableForm.value.sttimeHr,
      speedLightVeh: this.RouteDetailTableForm.value.speedLightVeh,
      speedHeavyVeh: this.RouteDetailTableForm.value.speedHeavyVeh,
      nightDrivingRestricted: this.RouteDetailTableForm.value.nightDrivingRestricted,
      restrictedHoursFrom: this.RouteDetailTableForm.value.restrictedHoursFrom,
      restrictedHoursTo: this.RouteDetailTableForm.value.restrictedHoursTo,
      actions: ["Edit", "Remove"],
    };
    this.tableData.push(Body);
    // Create a promise that resolves after the specified delay
    const delayDuration = 1000;
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(delayDuration);
    await this.addRemoveValue(null);
    this.tableLoad = true;
  }
  //#endregion

  //#region 
  addRemoveValue(data) {
    this.RouteDetailTableForm.controls["loccd"].setValue(
      this.TableEdit ? data?.loccd : ""
    );
    this.RouteDetailTableForm.controls["distKm"].setValue(
      this.TableEdit ? data?.distKm : ""
    );
    this.RouteDetailTableForm.controls["trtimeHr"].setValue(
      this.TableEdit ? data?.trtimeHr : ""
    );
    this.RouteDetailTableForm.controls["sttimeHr"].setValue(
      this.TableEdit ? data?.sttimeHr : ""
    );
    this.RouteDetailTableForm.controls["speedLightVeh"].setValue(
      this.TableEdit ? data?.speedLightVeh : ""
    );
    this.RouteDetailTableForm.controls["speedHeavyVeh"].setValue(
      this.TableEdit ? data?.speedHeavyVeh : ""
    );
    this.RouteDetailTableForm.controls["nightDrivingRestricted"].setValue(
      this.TableEdit ? data?.nightDrivingRestricted : ""
    );
    this.RouteDetailTableForm.controls["restrictedHoursFrom"].setValue(
      this.TableEdit ? data?.restrictedHoursFrom : ""
    );
    this.RouteDetailTableForm.controls["restrictedHoursTo"].setValue(
      this.TableEdit ? data?.restrictedHoursTo : ""
    );

    if (!this.TableEdit) {
      this.initializeRouteFormControl();
    }
  }
  //#endregion

  //#region 
  async handleMenuItemClick(data) {
    this.tableLoad = false;
    if (data.label.label == "Edit") {
      this.TableEdit = true;
      this.TableEditData = data.data;
      const index = this.tableData.indexOf(data.data);
      if (index > -1) {
        this.tableData.splice(index, 1); // 2nd parameter means remove one item only
      }
      this.addRemoveValue(data.data);
      const delayDuration = 1000;
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(delayDuration);
    } else {
      const index = this.tableData.indexOf(data.data);
      if (index > -1) {
        this.tableData.splice(index, 1); // 2nd parameter means remove one item only
      }
      const delayDuration = 1000;
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      await delay(delayDuration);
    }
    this.tableLoad = true;
  }
  //#endregion

  //#region 
  async save() {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      filter: {},
      "collectionName": "routeMasterLocWise"
    }
    const res = await this.masterService.masterPost('generic/get', req).toPromise();
    // Generate srno for each object in the array
    const lastRoute = res.data[res.data.length - 1];
    const lastRouteCode = lastRoute ? parseInt(lastRoute.routeId.substring(1)) : 0;
    // Function to generate a new route code

    if (this.isUpdate) {
      this.newRouteCode = this.data._id
    } else {
      this.newRouteCode = generateRouteCode(lastRouteCode);
    }
    const Body = {
      ...this.routeMasterLocationForm.value,
      routeId: this.newRouteCode,
      routeMode: this.routeMasterLocationForm.value.routeMode,
      routeCat: this.routeMasterLocationForm.value.routeCat,
      routeKm: this.routeMasterLocationForm.value.routeKm,
      departureTime: parseFloat(this.datePipe.transform(this.routeMasterLocationForm.value.departureTime, "HH:mm")),
      controlLoc: this.routeMasterLocationForm.value.controlLoc.name,
      routeType: this.routeMasterLocationForm.value.routeType,
      scheduleType: this.routeMasterLocationForm.value.scheduleType,
      isActive: this.routeMasterLocationForm.value.isActive,
      updatedBy: localStorage.getItem("UserName"),
      _id: this.newRouteCode,
      companyCode: localStorage.getItem("companyCode"),
      updatedDate: new Date(),
      GSTdetails: this.tableData.map((x) => {
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
      let id = this.routeMasterLocationForm.value.routeId
      delete Body.id;
      // delete Body.customerCode;
      let req = {
        companyCode: this.companyCode,
        collectionName: "routeMasterLocWise",
        filter: { routeId: id },
        update: Body,
      };
      //API FOR UPDATE
      this.masterService.masterPut("generic/update", req).subscribe({
        next: (res) => {
          this.route.navigateByUrl(
            "/Masters/RouteLocationWise/RouteList"
          );
          if (res.success) {
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
          }
          //
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      let req = {
        companyCode: this.companyCode,
        collectionName: "routeMasterLocWise",
        data: Body,
      };
      await this.masterService.masterPost("generic/create", req).subscribe({
        next: (res) => {
          if (res.success) {
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
        },
        error: (err) => {
          console.log("err", err);
        },
      });
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

}
