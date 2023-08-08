import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { ClusterMaster } from 'src/app/core/models/Masters/cluster-master';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { ClusterControl } from 'src/assets/FormControls/cluster-master';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import Swal from 'sweetalert2';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cluster-master-add',
  templateUrl: './cluster-master-add.component.html',
})
export class ClusterMasterAddComponent implements OnInit {
  breadScrums: { title: string; items: string[]; active: string; }[];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  clusterTabledata: ClusterMaster;
  clusterTableForm: UntypedFormGroup;
  clusterFormControls: ClusterControl;
  //#region Variable Declaration
  jsonControlArray: any;
  pincodeStatus: any;
  pincodeList: any;
  action: string;
  isUpdate = false;
  newClusterCode: string;
  data: any;
  //#endregion

  ngOnInit() {
    this.getPincodeData()
  }
  constructor(private Route: Router, private fb: UntypedFormBuilder,
    private masterService: MasterService, private filter: FilterUtils,
  ) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.data = Route.getCurrentNavigation().extras.state.data;
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
  //#region Pincode Dropdown
  getPincodeData() {
    const pincodeValue = this.clusterTableForm.controls['pincode'].value;

    if (pincodeValue !== null && pincodeValue !== "") {
      let req = {
        "companyCode": this.companyCode,
        "type": "masters",
        "collection": "pincode_detail"
      };
      this.masterService.masterPost('common/getall', req).subscribe({
        next: (res: any) => {
          // Assuming the API response contains an array named 'pincodeList'
          const pincodeList = res.data.map(element => ({
            name: element.pincode,
            value: element.pincode,
          }));
          let filteredPincodeList = [];
          if (Array.isArray(pincodeValue)) {
            const stringifiedPincodeValue = pincodeValue.map(val => val.toString()); // Convert to array of strings
            filteredPincodeList = pincodeList.filter(item => stringifiedPincodeValue.includes(item.name));
          } else if (typeof pincodeValue === 'string' && pincodeValue.length >= 2) {
            filteredPincodeList = pincodeList.filter(item => item.name.includes(pincodeValue));
          }
          if (this.isUpdate) {
            var filter = [];
            this.clusterTabledata.pincode.forEach(item => {
              filter.push(filteredPincodeList.find(element => element.value == item));
            });
          }
          this.clusterTableForm.controls['pincodeDropdown'].patchValue(filter);
          this.filter.Filter(
            this.jsonControlArray,
            this.clusterTableForm,
            filteredPincodeList,
            this.pincodeList,
            this.pincodeStatus
          );
        }
      });
    } else {
      // Handle case when pincodeValue is null or blank
      console.log('Pincode value is null or blank. API call skipped.');
      // You might want to reset or clear some form fields or values here
    }
  }

  //#endregion

  //#region Save Function
  save() {
    const pincodeDropdown = this.clusterTableForm.value.pincodeDropdown == "" ? [] : this.clusterTableForm.value.pincodeDropdown.map((item: any) => item.name);
    this.clusterTableForm.controls["pincode"].setValue(pincodeDropdown);
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
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        "type": "masters",
        "collection": "cluster_detail"
      }
      this.masterService.masterPost('common/getall', req).subscribe({
        next: (res: any) => {
          if (res) {
            // Generate srno for each object in the array
            const lastCode = res.data[res.data.length - 1];
            const lastClusterCode = lastCode ? parseInt(lastCode.clusterCode.substring(1)) : 0;
            // Function to generate a new route code
            function generateClusterCode(initialCode: number = 0) {
              const nextClusterCode = initialCode + 1;
              const clusterNumber = nextClusterCode.toString().padStart(4, '0');
              const clusterCode = `C${clusterNumber}`;
              return clusterCode;
            }
            this.newClusterCode = generateClusterCode(lastClusterCode);
            this.clusterTableForm.controls["id"].setValue(this.newClusterCode);
            this.clusterTableForm.controls["clusterCode"].setValue(this.newClusterCode);
            this.clusterTableForm.removeControl("pincodeDropdown");
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
      })
    }
  }
  //#endregion

  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  protected _onDestroy = new Subject<void>();
  // function handles select All feature of all multiSelect fields of one form.
  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonControlArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonControlArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.clusterTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  //#endregion
  checkClusterExists() {
    let req = {
      "companyCode": this.companyCode,
      "type": "masters",
      "collection": "cluster_detail"
    }
    this.masterService.masterPost('common/getall', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          const count = res.data.filter(item => item.clusterName == this.clusterTableForm.controls.clusterName.value)
          if (count.length > 0) {
            Swal.fire({
              title: 'Cluster Name already exists! Please try with another',
              toast: true,
              icon: "error",
              showCloseButton: false,
              showCancelButton: false,
              showConfirmButton: true,
              confirmButtonText: "OK"
            });
            this.clusterTableForm.controls['clusterName'].reset();
          }
        }
      }
    })
  }
}
