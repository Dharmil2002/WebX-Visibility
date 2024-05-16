import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { add } from 'lodash';
import moment from 'moment';
import { Subject, take, takeUntil } from 'rxjs';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { FilterUtils } from 'src/app/Utility/Form Utilities/dropdownFilter';
import { setGeneralMasterData } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { RouteLocationService } from 'src/app/Utility/module/masters/route-location/route-location.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { AddHocControls } from 'src/assets/FormControls/add-hoc-controls';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-hoc-route',
  templateUrl: './add-hoc-route.component.html'
})
export class AddHocRouteComponent implements OnInit {
  addHocForm: UntypedFormGroup;
  jsonAddHocControl: FormControls[];
  tableLoad: boolean;
    /*.......End................*/
  /* here the varible declare for menu Item option Both is required */
  menuItems = [{ label: "Edit" }, { label: "Remove" }];
  containerWidth = '1024px';
  menuItemflag: boolean = true;
  tableLoadIn: boolean = true;
  loadIn: boolean = false;

  /*.......End................*/
  /*Here the Controls which Is Hide search or add Button in table*/
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  /*.......End................*/
  addAndEditPath = '';
  // menuItems = [{label:"Edit Docket"},{label:"View"}];
  products: any[];
  className = "col-xl-6 col-lg-6 col-md-6 col-sm-6 mb-2";
  columnHeader: any;
  staticField: string[];
  tableData:any=[];
  FilterButton = {
    name: "Add",
    functionName: "addHocRoute",
  };
  EventButton = {
    functionName: "AddNew",
    name: "Add New",
    iconName: "add",
  };

  constructor(
    private fb: UntypedFormBuilder,
    private generalService: GeneralService,
    private storage: StorageService,
    private filter: FilterUtils,
    private locationService: LocationService,
    private routeLocation: RouteLocationService,
    public dialogRef: MatDialogRef<GenericTableComponent>,
  ) { }

  ngOnInit(): void {
    this.IntializeFormControl();
  }
  IntializeFormControl() {
    const addHocForm = new AddHocControls();
    this.jsonAddHocControl = addHocForm.addHoc;
    this.addHocForm = formGroupBuilder(this.fb, [this.jsonAddHocControl]);
    this.columnHeader=addHocForm.columnHeader;
    this.staticField=addHocForm.staticField;
    this.tableLoad=false;
    this.getDropDownDetails();
  }
  async getDropDownDetails() {
    this.products = await this.generalService.getDataForAutoComplete("product_detail", { companyCode: this.storage.companyCode }, "ProductName", "ProductID");
    setGeneralMasterData(this.jsonAddHocControl, this.products, "routeMode");
  }
  /*below is the function form handler which is used when any event fire on any form*/
  async functionCallHandler($event) {
    const field = $event.field; //what is use of this variable
    const functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  /*End*/
  /*  Below the function for the Getting a Location */
  async getLocation() {
    if (this.addHocForm.controls.loc.value.length >= 3) {
      let destinationMapping = await this.locationService.locationFromApi({
        locCode: {
          D$regex: `^${this.addHocForm.controls.loc.value}`,
          D$options: "i",
        },
      });
      this.filter.Filter(
        this.jsonAddHocControl,
        this.addHocForm,
        destinationMapping,
        'loc',
        false
      );
    }
  }
  /*End*/
  async save() {
    const controls = this.addHocForm.getRawValue();
    const routeMode = this.products.find((x) => x.value == controls.routeMode)?.name || "";
    controls.routeMode = routeMode;

    const route = await this.routeLocation.getRouteOne({
      D$or: [{ companyCode: this.storage.companyCode, routeName: controls.route }, { cID: this.storage.companyCode, rUTNM: controls.route }]
    });
    if (route) {
      Swal.fire({
        title: 'Route already exist',
        text: 'Route already exist',
        icon: 'error',
        confirmButtonText: 'Ok'
      });
      return false;
    }
    const res = await this.routeLocation.addRouteLocation(controls,this.tableData);
    if (res) {
      Swal.fire({
        title: 'Route Details',
        html: `
          <style>
            .swal2-html-container {
              max-width: 100%;
            }
            .alert{
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              font-size: 0.9em;
              min-width: 400px;
              border-radius: 5px 5px 0 0;
              overflow: hidden;
              box-shadow: 0 0 20px rgba(0,0,0,0.15);
            }
            th, td {
              padding: 12px 15px;
              text-align: left;
              border-bottom: 1px solid #dddddd;
            }
            th {
              background-color:#2F7EC0;
              color: #ffffff;
              text-align: center;
            }
            tr:nth-of-type(even) {
              background-color:#2F7EC0;
            }
            tr:last-of-type {
              border-bottom: 2px solid #2F7EC0;
            }
          }
          </style>
          <table class="alert">
            <thead>
              <tr>
                <th>RtCat</th>
                <th>CtrlBr</th>
                <th>SchDepT</th>
                <th>RtType</th>
                <th>SchType</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${res.routeCat}</td>
                <td>${res.contBranch}</td>
                <td>${moment(res.scheduleTime).format("DD/MM/YYYY HH:MM")}</td>
                <td>${res.routeType}</td>
                <td>${res.ScheduleType}</td>
              </tr>
            </tbody>
          </table>`,
        showCloseButton: true,
        focusConfirm: false,
        width: 623,
        confirmButtonText: 'Close',
        customClass: {
          popup: 'custom-swal'
        }
      });
    }
    this.dialogRef.close();
  }
  Close() {
    this.dialogRef.close();
  }

  async AddNew(){
    if (this.tableData.length > 0) {
      const exist = this.tableData.find(
        (x) => x.loc === this.addHocForm.value?.loc.value
      );
      if (exist) {
        this.addHocForm.controls["loc"].setValue("");
        Swal.fire({
          icon: "info", // Use the "info" icon for informational messages
          title: "Information",
          text: "Please avoid entering duplicate location.",
          showConfirmButton: true,
        });
        return false;
      }
    }
    this.loadIn = true;
    this.tableLoad = true;
    const delayDuration = 1000;
    // Create a promise that resolves after the specified delay
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // Use async/await to introduce the delay
    await delay(delayDuration);
    const json={
      "loc":this.addHocForm.value?.loc.value||"",
      "distance":this.addHocForm.value?.distance||0,
      "transitHrs":this.addHocForm.value?.transitHrs||0,
      'actions': ["Edit", "Remove"]
    }
    this.tableData.push(json);
    const routeCode=this.tableData.map((x) => x.loc);
    const routeName=routeCode.join('-');
    this.tableLoad = false;
    this.loadIn = false;
    this.addHocForm.controls['loc'].setValue("");
    this.addHocForm.controls['distance'].setValue("");
    this.addHocForm.controls['transitHrs'].setValue("");
    this.tableData.length > 0 ? this.addHocForm.controls['routeMode'].disable() :"";
    this.addHocForm.controls['route'].setValue(routeName);
  }
  handleMenuItemClick(data) {
    this.autoFill(data);
  }
  autoFill(data: any) {
    if (data.label.label === "Remove") {
      this.tableData = this.tableData.filter((x) => x.loc !== data.data.loc);
      this.tableData.length <= 0 ? this.addHocForm.controls['routeMode'].enable() :"";
    } else {
      const atLeastOneValuePresent = Object.keys(this.addHocForm.controls)
        .some(key => {
          const control = this.addHocForm.get(key);
          return control && (control.value !== null && control.value !== undefined && control.value !== '');
        });

      if (atLeastOneValuePresent) {
        Swal.fire({
          title: 'Are you sure?',
          text: 'Data is already present and being edited. Are you sure you want to discard the changes?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, proceed!',
          cancelButtonText: 'No, cancel'
        }).then((result) => {
          if (result.isConfirmed) {
            this.fillDetails(data)
          }
        });
      }
      else {
        this.fillDetails(data)
      }
    }
  }
    /*AutoFiill Invoice data*/
    fillDetails(data) {
      // Define a mapping of form control names to their respective keys in the incoming data
      const formFields = {
      "distance":this.addHocForm.value?.distance||0,
      "transitHrs":this.addHocForm.value?.transitHrs||0,
      };
      // Loop through the defined form fields and set their values from the incoming data
      Object.keys(formFields).forEach(field => {
        this.addHocForm.controls[field].setValue(data.data?.[formFields[field]] || "");
      });
      this.addHocForm.controls['loc'].setValue({ name: data.data['loc'], value: data.data['loc'] })
      this.tableData = this.tableData.filter(x => x.loc !== data.data.loc);
      this.tableData.length <= 0 ? this.addHocForm.controls['routeMode'].enable() :"";
    }
    /*End*/
}
