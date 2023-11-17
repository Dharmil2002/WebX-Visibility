import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ContainerService } from 'src/app/Utility/module/masters/container/container.service';
import { RouteLocationService } from 'src/app/Utility/module/masters/route-location/route-location.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { SessionService } from 'src/app/core/service/session.service';
import { TERCharges } from 'src/assets/FormControls/VendorContractControls/standard-charges';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-termodal',
  templateUrl: './vendor-termodal.component.html'
})
export class VendorTERModalComponent implements OnInit {
  companyCode: any;
  jsonControlArray: any;
  ContractTERControls: TERCharges;
  data: any;
  TERForm: UntypedFormGroup;
  routeName: any;
  routestatus: any;
  capacitystatus: any;
  capacityName: any;
  containerData: any;
  routeList: any;
  rateTypeDropDown: any;
  rateTypeName: any;
  rateTypestatus: any;

  constructor(private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    private sessionService: SessionService,
    private objRouteLocationService: RouteLocationService,
    private objContainerService: ContainerService,
    public dialogRef: MatDialogRef<VendorTERModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any) {
    this.companyCode = this.sessionService.getCompanyCode();

  }

  ngOnInit(): void {
    this.getRouteList();
    this.getRouteList();
    this.getContainerList();
    this.getDropDownData();
    this.initializeFormControl();
    console.log(this.objResult);
  }
  //#region to initialize form control
  initializeFormControl() {
    this.ContractTERControls = new TERCharges(this.data);
    this.jsonControlArray = this.ContractTERControls.getTERChargesArrayControls();
    this.TERForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.jsonControlArray.forEach(element => {
      if (element.name === 'route') {
        this.routeName = element.name,
          this.routestatus = element.additionalData.showNameAndValue
      }
      if (element.name === 'capacity') {
        this.capacityName = element.name,
          this.capacitystatus = element.additionalData.showNameAndValue
      }
      if (element.name === 'rateType') {
        this.rateTypeName = element.name,
          this.rateTypestatus = element.additionalData.showNameAndValue
      }
    });
    if (this.objResult.Details) {
      this.TERForm.controls['rate'].setValue(this.objResult.Details.rate);
      this.TERForm.controls['min'].setValue(this.objResult.Details.min);
      this.TERForm.controls['max'].setValue(this.objResult.Details.max);
    }
  }
  //#endregion
  Close() {
    this.dialogRef.close()
  }
  cancel() {
    this.dialogRef.close()
  }
  //#region to send data to parent component using dialogRef
  // async save(event) {
  //   try {

  //     // clearValidatorsAndValidate(this.TERForm);

  //     const vendorContractCollection = "vendor_contract_xprs_rt";
  //     if (this.objResult.Details) {
  //       const data = {

  //         rtTpID: this.TERForm.value.route.value,
  //         rtTpNM: this.TERForm.value.route.name,
  //         cpctyID: this.TERForm.value.capacity.value,
  //         cpctyNM: this.TERForm.value.capacity.name,
  //         rtID: this.TERForm.value.rateType.value,
  //         rtNM: this.TERForm.value.rateType.name,
  //         rate: parseInt(this.TERForm.value.rate),
  //         min: parseInt(this.TERForm.value.min),
  //         max: parseInt(this.TERForm.value.max),
  //         upDT: new Date(),
  //         upBY: this.TERForm.value.upBY
  //       };
  //       console.log(data);
  //       const id = this.objResult.Details.vcxrID;
  //       // Prepare request for creating a new vendor contract
  //       let req = {
  //         companyCode: this.companyCode,
  //         collectionName: vendorContractCollection,
  //         filter: {
  //           _id: id
  //         },
  //         update: data
  //       };
  //       console.log(req);

  //       // Create a new vendor contract
  //       const createResponse = await this.masterService.masterPut("generic/update", req).toPromise()

  //       if (createResponse) {
  //         // Display success message
  //         Swal.fire({
  //           icon: "success",
  //           title: "Success",
  //           text: 'Transportation- Express Route',
  //           showConfirmButton: true,
  //         });
  //       }

  //     } else { // Fetch existing data
  //       const req = {
  //         companyCode: this.companyCode,
  //         collectionName: vendorContractCollection,
  //         filter: {}
  //       };
  //       const res = await this.masterService.masterPost("generic/get", req).toPromise();
  //       const existingData = res.data;

  //       if (existingData) {
  //         // Generate a new vendor code
  //         const lastContract = existingData[existingData.length - 1];
  //         const lastVendorCode = lastContract ? parseInt(lastContract.vendorCode.substring(2), 10) : 0;
  //         const newVendorCode = `Vcxr${(lastVendorCode + 1).toString().padStart(5, '0')}`;

  //         // Prepare data for the new vendor contract
  //         const data = {
  //           _id: newVendorCode,
  //           vcxrID: newVendorCode,
  //           cID: this.companyCode,
  //           rtTpID: this.TERForm.value.route.value,
  //           rtTpNM: this.TERForm.value.route.name,
  //           cpctyID: this.TERForm.value.capacity.value,
  //           cpctyNM: this.TERForm.value.capacity.name,
  //           rtID: this.TERForm.value.rateType.value,
  //           rtNM: this.TERForm.value.rateType.name,
  //           rate: parseInt(this.TERForm.value.rate),
  //           min: parseInt(this.TERForm.value.min),
  //           max: parseInt(this.TERForm.value.max),
  //           eDT: new Date(),
  //           eNBY: this.TERForm.value.ENBY
  //         };
  //         console.log(data);

  //         // Prepare request for creating a new vendor contract
  //         const createVendorContractRequest = {
  //           companyCode: this.companyCode,
  //           collectionName: vendorContractCollection,
  //           data: data,
  //         };
  //         console.log(createVendorContractRequest);

  //         // Create a new vendor contract
  //         const createResponse = await this.masterService.masterPost("generic/create", createVendorContractRequest).toPromise();

  //         if (createResponse) {
  //           // Display success message
  //           Swal.fire({
  //             icon: "success",
  //             title: "Success",
  //             text: 'Transportation- Express Route',
  //             showConfirmButton: true,
  //           });
  //         }
  //       }
  //     }
  //     // Close the dialog regardless of success or failure
  //     this.dialogRef.close();

  //   } catch (error) {
  //     // Handle errors appropriately (e.g., log, display error message)
  //     console.error("An error occurred:", error);
  //   }
  // }
  async save(event) {
    try {
      const vendorContractCollection = "vendor_contract_xprs_rt";

      if (this.objResult.Details) {
        // Update existing vendor contract
        const updateData = this.extractFormData();
        const id = this.objResult.Details.vcxrID;
        const updateRequest = {
          companyCode: this.companyCode,
          collectionName: vendorContractCollection,
          filter: { _id: id },
          update: updateData,
        };

        const updateResponse = await this.masterService.masterPut("generic/update", updateRequest).toPromise();
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Updated Transportation-Express Route",
          showConfirmButton: true,
        });
      } else {
        // Create a new vendor contract
        const existingData = await this.fetchExistingData(vendorContractCollection);
        const newVendorCode = this.generateNewVendorCode(existingData);
        const newContractData = this.prepareContractData(newVendorCode);

        const createRequest = {
          companyCode: this.companyCode,
          collectionName: vendorContractCollection,
          data: newContractData,
        };

        const createResponse = await this.masterService.masterPost("generic/create", createRequest).toPromise();
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Created Transportation-Express Route",
          showConfirmButton: true,
        });
      }
      // Close the dialog regardless of success or failure
      this.dialogRef.close();
    } catch (error) {
      // Handle errors appropriately (e.g., log, display error message)
      console.error("An error occurred:", error);
    }
  }

  extractFormData() {
    // Extract form data for updating an existing contract
    return {
      rtTpID: this.TERForm.value.route.value,
      rtTpNM: this.TERForm.value.route.name,
      cpctyID: this.TERForm.value.capacity.value,
      cpctyNM: this.TERForm.value.capacity.name,
      rtID: this.TERForm.value.rateType.value,
      rtNM: this.TERForm.value.rateType.name,
      rate: parseInt(this.TERForm.value.rate),
      min: parseInt(this.TERForm.value.min),
      max: parseInt(this.TERForm.value.max),
      upDT: new Date(),
      upBY: this.TERForm.value.upBY,
    };
  }

  async fetchExistingData(collectionName: string) {
    // Fetch existing data for creating a new contract
    const request = {
      companyCode: this.companyCode,
      collectionName: collectionName,
      filter: {},
    };

    const response = await this.masterService.masterPost("generic/get", request).toPromise();
    return response.data;
  }

  generateNewVendorCode(existingData: any[]) {
    // Generate a new vendor code based on existing data
    const lastContract = existingData[existingData.length - 1];
    const lastVendorCode = lastContract ? parseInt(lastContract.vcxrID.substring(2), 10) : 0;
    return `Vcxr${(lastVendorCode + 1).toString().padStart(5, '0')}`;
  }

  prepareContractData(newVendorCode: string) {
    // Prepare data for creating a new contract
    return {
      _id: newVendorCode,
      vcxrID: newVendorCode,
      cID: this.companyCode,
      rtTpID: this.TERForm.value.route.value,
      rtTpNM: this.TERForm.value.route.name,
      cpctyID: this.TERForm.value.capacity.value,
      cpctyNM: this.TERForm.value.capacity.name,
      rtID: this.TERForm.value.rateType.value,
      rtNM: this.TERForm.value.rateType.name,
      rate: parseInt(this.TERForm.value.rate),
      min: parseInt(this.TERForm.value.min),
      max: parseInt(this.TERForm.value.max),
      eDT: new Date(),
      eNBY: this.TERForm.value.ENBY,
    };
  }

  //#endregion
  //#region to handle functionCallHandler
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  //#endregion
  //#region to get route list
  async getRouteList() {
    this.routeList = await this.objRouteLocationService.getRouteLocationDetail()
    if (this.objResult.Details) {
      const updatedRoute = this.routeList.find((TERForm) => TERForm.name == this.objResult.Details.rtTpNM);
      this.TERForm.controls.route.setValue(updatedRoute);
    }
    this.filter.Filter(this.jsonControlArray, this.TERForm, this.routeList, this.routeName, this.routestatus);
  }
  //#endregion
  //#region to get container list
  async getContainerList() {
    const container = await this.objContainerService.getDetail();
    this.containerData = container.filter((item) => item.activeFlag) // Filter based on the isActive property
      .map(e => ({
        name: e.loadCapacity, // Map the name to the specified nameKey
        value: e.containerCode // Map the value to the specified valueKey
      }));
    if (this.objResult.Details) {
      const updatedData = this.containerData.find((TERForm) => TERForm.name == this.objResult.Details.cpctyNM);
      this.TERForm.controls.capacity.setValue(updatedData);
    }
    this.filter.Filter(this.jsonControlArray, this.TERForm, this.containerData, this.capacityName, this.capacitystatus);
  }
  //#endregion
  //#region to get rateType list
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const { rateTypeDropDown } = res;
      if (this.objResult.Details) {
        const updaterateType = rateTypeDropDown.find(item => item.name === this.objResult.Details.rtNM);
        this.TERForm.controls.rateType.setValue(updaterateType);
      }
      this.filter.Filter(this.jsonControlArray, this.TERForm, rateTypeDropDown, this.rateTypeName, this.rateTypestatus);
    });
  }
  //#endregion

}