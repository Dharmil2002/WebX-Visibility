import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getShortName } from 'src/app/Utility/commonFunction/random/generateRandomNumber';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { ClusterMaster } from 'src/app/core/models/Masters/cluster-master';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { ClusterControl } from 'src/assets/FormControls/cluster-master';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cluster-master-add',
  templateUrl: './cluster-master-add.component.html',
})
export class ClusterMasterAddComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; }[];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  countryCode: any;
  action: string;
  isUpdate = false;
  clusterTabledata: ClusterMaster;
  clusterTableForm: UntypedFormGroup;
  clusterFormControls: ClusterControl;
  jsonControlGroupArray: any;
  ngOnInit() {
  }
  functionCallHandler($event) {
    // console.log("fn handler called" , $event);

    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private Route: Router, private fb: UntypedFormBuilder,
    private masterService: MasterService
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.data = Route.getCurrentNavigation().extras.state.data;
      this.countryCode = this.data.countryName;
      this.action = 'edit'
      this.isUpdate = true;
    } else {
      this.action = "Add";
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      this.clusterTabledata = this.data;
      this.breadScrums = [
        {
          title: "Cluster Master",
          items: ["Home"],
          active: "Edit Cluster Master",
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Cluster Master",
          items: ["Home"],
          active: "Add Cluster Master",
        },
      ];
      this.clusterTabledata = new ClusterMaster({});
    }
    this.initializeFormControl();
  }
  initializeFormControl() {
    this.clusterFormControls = new ClusterControl(this.clusterTabledata, this.isUpdate);
    this.jsonControlGroupArray = this.clusterFormControls.getClusterFormControls();
    this.clusterTableForm = formGroupBuilder(this.fb, [this.jsonControlGroupArray]);
  }
  cancel() {
    window.history.back();
  }
  save() {
    this.clusterTableForm.controls["activeFlag"].setValue(this.clusterTableForm.value.activeFlag == true ? "Y" : "N");
    if (this.isUpdate) {
      let id = this.clusterTableForm.value.id;
      this.clusterTableForm.removeControl("id");
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "cluster",
        id: id,
        updates: this.clusterTableForm.value
      };
      this.masterService.masterPut('common/update', req).subscribe({
        next: (res: any) => {
          if (res) {
            // Display success message
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
            this.Route.navigateByUrl('/Masters/ClusterMaster/ClusterMasterList');
          }
        }
      });
    } else {
      const randomNumber = getShortName(this.clusterTableForm.value.clusterCode);
      this.clusterTableForm.controls["id"].setValue(randomNumber);
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "cluster",
        data: this.clusterTableForm.value
      };
      this.masterService.masterPost('common/create', req).subscribe({
        next: (res: any) => {
          if (res) {
            // Display success message
            Swal.fire({
              icon: "success",
              title: "Successful",
              text: res.message,
              showConfirmButton: true,
            });
            this.Route.navigateByUrl('/Masters/ClusterMaster/ClusterMasterList');
          }
        }
      });
    }
  }
}
