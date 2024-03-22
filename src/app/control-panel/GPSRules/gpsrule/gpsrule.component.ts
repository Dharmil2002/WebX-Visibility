import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { firstValueFrom } from "rxjs";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { GPSRuleControls } from "src/assets/FormControls/ControlPanel/GPSRuleControls";
import { columnHeader, staticField } from "./gpsrule-utility";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-gpsrule",
  templateUrl: "./gpsrule.component.html",
})
export class GPSRuleComponent implements OnInit {
  gpsRuleFormControls: GPSRuleControls;
  jsonControlgpsRuleArray: any;
  gpsRuleCrend: any;
  isUpdate = false;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  branch = localStorage.getItem("Branch");
  user = localStorage.getItem("UserName");
  gpsRuleTableForm: UntypedFormGroup;
  crend: {
    user: string;
    pwd: string;
  };
  breadScrums = [
    {
      title: "GPS Rules",
      items: ["Control Panel"],
      active: "GPS Rules",
    },
  ];

  //#region TABLE PROPERTIES
  EventButton = {
    functionName: "AddNew",
    name: "Add Confuguration",
    iconName: "add",
  };
  menuItemflag = true;
  filterColumn: boolean = true;
  addAndEditPath = "";
  toggleArray = ["iSACTIVE"];
  allColumnFilter: any;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  staticField = staticField;
  menuItems = [{ label: "Edit" }, { label: "View" }];
  tableLoad = false;
  columnHeader = columnHeader;
  tableData: any = [];
  metaData = {
    checkBoxRequired: true,
    noColumnSort: Object.keys(this.columnHeader),
  };
  //#endregion TABLE PROPERTIES
  constructor(
    private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private router: Router
  ) {
    this.addAndEditPath = "/ControlPanel/gps-rule/add-gps-rule";
    this.initializeFormControl();
  }

  ngOnInit(): void {}

  //#region
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  //#endregion

  async initializeFormControl() {
    const req = {
      companyCode: this.companyCode,
      collectionName: "logicloud_customer_mapping",
      filter: {
        cID: this.companyCode,
      },
    };
    this.gpsRuleCrend = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    if (this.gpsRuleCrend?.data?.length > 0) {
      this.isUpdate = true;
      this.crend = {
        pwd: this.gpsRuleCrend?.data[0]?.LCpassword,
        user: this.gpsRuleCrend?.data[0]?.LCuserId,
      };
      this.tableLoad = false;
      this.displayConfig(this.gpsRuleCrend?.data[0]?.LCTenantId);
    } else {
      this.isUpdate = false;
    }
    this.gpsRuleFormControls = new GPSRuleControls(
      this.gpsRuleCrend?.data[0],
      this.isUpdate
    );
    this.jsonControlgpsRuleArray =
      this.gpsRuleFormControls.getGPSRuleFormControls();
    this.gpsRuleTableForm = formGroupBuilder(this.fb, [
      this.jsonControlgpsRuleArray,
    ]);
  }
  async save() {
    let res;
    const formValue = this.gpsRuleTableForm.value;
    if (this.isUpdate) {
      const data = {
        LCuserId: formValue?.LCuserId,
        LCpassword: formValue?.LCpassword,
        iSACTIVED: formValue?.iSACTIVED,
        mODBY: this.user,
        mODDT: new Date(),
        mODLOC: this.branch,
      };
      const req = {
        companyCode: this.companyCode,
        collectionName: "logicloud_customer_mapping",
        filter: { LCtenantId: formValue?.LCtenantId },
        update: data,
      };
      //API FOR UPDATE
      res = await firstValueFrom(
        this.masterService.masterMongoPut("generic/update", req)
      );
      if (res?.success) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.tableLoad = false;
        this.displayConfig(this.gpsRuleCrend?.data[0]?.LCTenantId);
      }
    } else {
      const data = {
        _id: `${this.companyCode}-${formValue?.LCtenantId}`,
        cID: this.companyCode,
        LCtenantId: formValue?.LCtenantId,
        LCuserId: formValue?.LCuserId,
        LCpassword: formValue?.LCpassword,
        iSACTIVED: formValue?.iSACTIVED,
        eNTDT: new Date(),
        eNTLOC: this.branch,
        eNTBY: this.user,
        mODBY: this.user,
        mODDT: new Date(),
        mODLOC: this.branch,
      };
      const req = {
        companyCode: this.companyCode,
        collectionName: "logicloud_customer_mapping",
        data: data,
      };
      //API FOR UPDATE
      res = await firstValueFrom(
        this.masterService.masterPost("generic/create", req)
      );
      if (res?.isSuccess) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.tableLoad = false;
        this.displayConfig(this.gpsRuleCrend?.data[0]?.LCTenantId);
      }
    }
  }
  async displayConfig(LCTenantId) {
    const request = {
      companyCode: this.companyCode,
      collectionName: "logi_api_config",
      filter: {
        cID: this.companyCode,
        lOGICCD: LCTenantId,
      },
    };
    let response = await firstValueFrom(
      this.masterService.masterPost("generic/get", request)
    );
    this.tableData = response?.data.map((x, index) => {
      return {
        ...x,
        Srno: index + 1,
        actions: ["Edit", "View"],
        // active: x.iSACTIVE
      };
    });
    this.tableLoad = true;
  }
  async changeActive(event) {
    const data = {
      iSACTIVE: event?.iSACTIVE || false,
      mODBY: this.user,
      mODDT: new Date(),
      mODLOC: this.branch,
    };
    const req = {
      companyCode: this.companyCode,
      collectionName: "logi_api_config",
      filter: { lOGICCD: event?.lOGICCD, aPITYP: event?.aPITYP },
      update: data,
    };
    //API FOR UPDATE
    let res = await firstValueFrom(
      this.masterService.masterMongoPut("generic/update", req)
    );
    if (res?.success) {
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
      this.tableLoad = false;
      this.displayConfig(this.gpsRuleCrend?.data[0]?.LCTenantId);
    }
  }
  async handleMenuItemClick(data) {
    const formValue = this.gpsRuleTableForm.value;
    let passData = {
      apiCred: {
        lOGICCD: formValue.LCtenantId,
        uNM: formValue.LCuserId,
        pWD: formValue.LCpassword,
      },
      command: "Edit",
      tableData: data.data,
    };
    if (data.label.label == "Edit") {
      passData.command = "Edit";
    } else if (data.label.label == "View") {
      passData.command = "View";
    }

    this.router.navigateByUrl(this.addAndEditPath, {
      state: { data: passData },
    });
  }
  AddNew() {
    const formValue = this.gpsRuleTableForm.value;
    let data = {
      apiCred: {
        lOGICCD: formValue.LCtenantId,
        uNM: formValue.LCuserId,
        pWD: formValue.LCpassword,
      },
      command: "Add",
    };
    this.router.navigateByUrl(this.addAndEditPath, {
      state: { data: data },
    });
  }
  activeAPI(data) {
    this.gpsRuleTableForm.controls["iSACTIVED"].setValue(
      data.eventArgs.checked
    );
  }
}
