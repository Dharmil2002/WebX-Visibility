import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { getShortName } from 'src/app/Utility/commonFunction/random/generateRandomNumber';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { ClusterMaster } from 'src/app/core/models/Masters/cluster-master';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { ClusterControl } from 'src/assets/FormControls/cluster-master';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
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
  jsonControlArray: any;
  pincodeStatus: any;
  pincodeList: any;
  routeDet: any;
  ngOnInit() {
    this.getPincodeData()
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
    private masterService: MasterService, private filter: FilterUtils,
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
    this.jsonControlArray = this.clusterFormControls.getClusterFormControls();
    this.jsonControlArray.forEach(data => {
      if (data.name === 'pincode') {
        // Set Pincode category-related variables
        this.pincodeList = data.name;
        this.pincodeStatus = data.additionalData.showNameAndValue;
      }
    });
    this.clusterTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  cancel() {
    window.history.back();
  }
  getPincodeData() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "pincode_detail"
    };
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        // Assuming the API response contains an array named 'pincodeList'
        const pincodeList = res.data;
        let pincode = pincodeList
          .filter(element => element.pincode != null && element.pincode !== '') // Filter out items with null and empty 'name' values
          .map(element => {
            let pincodeValue = element.pincode;
            if (typeof pincodeValue === 'object') {
              // If 'pincodeValue' is an object, extract the specific property representing the 'pincode' value
              pincodeValue = pincodeValue.name; // Replace 'name' with the correct property name representing the 'pincode' value
            }
            return { name: String(pincodeValue), value: String(pincodeValue) }; // Convert the 'pincode' value to a string
          });
        if (this.isUpdate) {
          var filter = [];
          this.data.pincode.forEach(item => {
            filter.push(pincode.find(element => element.value == item));
          });
        }
        this.clusterTableForm.controls['pincodeDropdown'].patchValue(filter);
        this.filter.Filter(
          this.jsonControlArray,
          this.clusterTableForm,
          pincode,
          this.pincodeList,
          this.pincodeStatus
        );
      }
    });
  }
  save() {
    const pincodeDropdown = this.clusterTableForm.value.pincodeDropdown.map((item: any) => item.name);
    this.clusterTableForm.controls["pincode"].setValue(pincodeDropdown);
    this.clusterTableForm.controls["activeFlag"].setValue(this.clusterTableForm.value.activeFlag == true ? "Y" : "N");
    if (this.isUpdate) {
      let id = this.clusterTableForm.value.id;
      this.clusterTableForm.removeControl("id");
      let req = {
        companyCode: this.companyCode,
        type: "masters",
        collection: "cluster_detail",
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
        collection: "cluster_detail",
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
