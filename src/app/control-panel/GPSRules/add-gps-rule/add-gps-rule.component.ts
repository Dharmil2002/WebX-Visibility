import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { AddGpsRuleControls } from "src/assets/FormControls/ControlPanel/AddGpsRuleControls";
import Swal from "sweetalert2";

@Component({
  selector: "app-add-gps-rule",
  templateUrl: "./add-gps-rule.component.html",
})
export class AddGpsRuleComponent implements OnInit {
  breadScrums = [
    {
      title: "Add API Configuration",
      items: ["GPS Rule"],
      active: "API Configuration",
    },
  ];
  isShow = true;
  prevPageData: any;
  backPath = "/ControlPanel/gps-rule";
  isView = false;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  branch = localStorage.getItem("Branch");
  user = localStorage.getItem("UserName");
  AddGpsRuleTableForm: UntypedFormGroup;
  addGpsRuleControls: AddGpsRuleControls;
  jsonControlArray: any;
  isUpdate = false;
  constructor(
    private route: Router,
    private fb: UntypedFormBuilder,
    private masterService: MasterService
  ) {
    const navigationState = this.route.getCurrentNavigation()?.extras?.state;
    this.prevPageData = navigationState?.data;
    if (this.prevPageData?.command == "View") {
      this.isView = true;
      this.isShow = false;
    }
    if (this.prevPageData?.command == "Edit") {
      this.isUpdate = true;
    }
    this.intializeFormControls();
  }

  ngOnInit(): void {}
  intializeFormControls() {
    this.prevPageData;
    let data;

    if (this.prevPageData?.command == "Add") {
      data = {
        lOGICCD: this.prevPageData?.apiCred?.lOGICCD,
        uNM: this.prevPageData?.apiCred?.uNM,
        pWD: this.prevPageData?.apiCred?.pWD,
      };
    } else if (this.prevPageData?.command == "Edit") {
      data = this.prevPageData.tableData;
    } else if (this.prevPageData?.command == "View") {
      data = this.prevPageData.tableData;
    }
    this.addGpsRuleControls = new AddGpsRuleControls(data, this.isView);
    this.jsonControlArray = this.addGpsRuleControls.getGPSRuleFormControls();
    this.AddGpsRuleTableForm = formGroupBuilder(this.fb, [
      this.jsonControlArray,
    ]);
  }
  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  activeAPI(data) {
    this.AddGpsRuleTableForm.controls["iSACTIVE"].setValue(
      data.eventArgs.checked
    );
  }
  async save() {
    const formValue = this.AddGpsRuleTableForm.value;
    let data: any = {
      aPIURL: formValue.aPIURL,
      aPIKEY: formValue?.aPIKEY || "",
      iSACTIVE: formValue?.iSACTIVE || false,
      gPSPID: formValue?.gPSPID || 0,
      tID: formValue?.tID || 0,
      mODBY: this.user,
      mODDT: new Date(),
      mODLOC: this.branch,
    };
    if (this.isUpdate) {
      const req = {
        companyCode: this.companyCode,
        collectionName: "logi_api_config",
        filter: {
          lOGICCD: formValue?.lOGICCD,
          aPITYP: formValue?.aPITYP,
        },
        update: data,
      };
      //API FOR UPDATE
      let res = await firstValueFrom(
        this.masterService.masterMongoPut("generic/update", req)
      );
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.route.navigateByUrl("/ControlPanel/gps-rule");
      }
    } else {
      data = {
        ...data,
        _id: `${this.companyCode}-${formValue?.lOGICCD}-${formValue?.aPITYP}`,
        aPITYP: formValue?.aPITYP,
        cID: this.companyCode,
        lOGICCD: formValue?.lOGICCD,
        uNM: formValue?.uNM,
        pWD: formValue?.pWD,
        eNTDT: new Date(),
        eNTLOC: this.branch,
        eNTBY: this.user,
      };
      const req = {
        companyCode: this.companyCode,
        collectionName: "logi_api_config",
        data: data,
      };
      let res = await firstValueFrom(
        this.masterService.masterPost("generic/create", req)
      );
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.route.navigateByUrl("/ControlPanel/gps-rule");
      }
    }
  }
}
