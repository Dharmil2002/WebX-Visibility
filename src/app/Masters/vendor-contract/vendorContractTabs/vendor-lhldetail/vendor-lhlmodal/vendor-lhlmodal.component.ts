import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PayBasisdetailFromApi } from 'src/app/Masters/Customer Contract/CustomerContractAPIUtitlity';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { ContainerService } from 'src/app/Utility/module/masters/container/container.service';
import { RouteLocationService } from 'src/app/Utility/module/masters/route-location/route-location.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { SessionService } from 'src/app/core/service/session.service';
import { TERCharges } from 'src/assets/FormControls/VendorContractControls/standard-charges';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vendor-lhlmodal',
  templateUrl: './vendor-lhlmodal.component.html'
})
export class VendorLHLModalComponent implements OnInit {
  companyCode: number;
  TLHLForm: UntypedFormGroup;
  ContractTLHLControls: TERCharges;
  data: any;
  jsonControlArray: any;
  routeName: any;
  routestatus: any;
  capacityName: any;
  capacitystatus: any;
  rateTypeName: any;
  rateTypestatus: any;

  constructor(private fb: UntypedFormBuilder,
    private masterService: MasterService,
    private filter: FilterUtils,
    private sessionService: SessionService,
    private objRouteLocationService: RouteLocationService,
    private objContainerService: ContainerService,
    public dialogRef: MatDialogRef<VendorLHLModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public objResult: any) {
    this.companyCode = this.sessionService.getCompanyCode();

  }

  ngOnInit(): void {
    this.getRouteList();
    this.getContainerList();
    this.getDropDownData();
    this.initializeFormControl();
    // console.log(this.objResult);
  }
  //#region to send data to parent component using dialogRef
  async save(event) {
    try {
      const vendorContractCollection = "vendor_contract_lhl_rt";

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
          text: "Updated Transportation- Long Haul lane based",
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
          text: "Created Transportation- Long Haul lane based",
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
      rtTpID: this.TLHLForm.value.route.value,
      rtTpNM: this.TLHLForm.value.route.name,
      cpctyID: this.TLHLForm.value.capacity.value,
      cpctyNM: this.TLHLForm.value.capacity.name,
      rtID: this.TLHLForm.value.rateType.value,
      rtNM: this.TLHLForm.value.rateType.name,
      rate: parseInt(this.TLHLForm.value.rate),
      min: parseInt(this.TLHLForm.value.min),
      max: parseInt(this.TLHLForm.value.max),
      upDT: new Date(),
      upBY: this.TLHLForm.value.upBY,
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
    const lastVendorCode = lastContract ? parseInt(lastContract.vclbID.substring(4), 10) : 0;
    return `Vclb${(lastVendorCode + 1).toString().padStart(5, '0')}`;
  }

  prepareContractData(newVendorCode: string) {
    // Prepare data for creating a new contract
    return {
      _id: newVendorCode,
      vclbID: newVendorCode,
      cID: this.companyCode,
      rtTpID: this.TLHLForm.value.route.value,
      rtTpNM: this.TLHLForm.value.route.name,
      cpctyID: this.TLHLForm.value.capacity.value,
      cpctyNM: this.TLHLForm.value.capacity.name,
      rtID: this.TLHLForm.value.rateType.value,
      rtNM: this.TLHLForm.value.rateType.name,
      rate: parseInt(this.TLHLForm.value.rate),
      min: parseInt(this.TLHLForm.value.min),
      max: parseInt(this.TLHLForm.value.max),
      eDT: new Date(),
      eNBY: this.TLHLForm.value.ENBY,
    };
  }

  //#endregion

  cancel() {
    this.dialogRef.close()
  }
  Close() {
    this.dialogRef.close()
  }
  //#region to initialize form control
  initializeFormControl() {
    this.ContractTLHLControls = new TERCharges(this.data);
    this.jsonControlArray = this.ContractTLHLControls.getTERChargesArrayControls();
    this.TLHLForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
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
      this.TLHLForm.controls['rate'].setValue(this.objResult.Details.rate);
      this.TLHLForm.controls['min'].setValue(this.objResult.Details.min);
      this.TLHLForm.controls['max'].setValue(this.objResult.Details.max);
    }
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
    const routeList = await this.objRouteLocationService.getRouteLocationDetail()
    if (this.objResult.Details) {
      const updatedRoute = routeList.find((x) => x.name == this.objResult.Details.rtTpNM);
      this.TLHLForm.controls.route.setValue(updatedRoute);
    }
    this.filter.Filter(this.jsonControlArray, this.TLHLForm, routeList, this.routeName, this.routestatus);
  }
  //#endregion
  //#region to get container list
  async getContainerList() {
    const container = await this.objContainerService.getDetail();
    const containerData = container.filter((item) => item.activeFlag) // Filter based on the isActive property
      .map(e => ({
        name: e.loadCapacity, // Map the name to the specified nameKey
        value: e.containerCode // Map the value to the specified valueKey
      }));
    if (this.objResult.Details) {
      const updatedData = containerData.find((x) => x.name == this.objResult.Details.cpctyNM);
      this.TLHLForm.controls.capacity.setValue(updatedData);
    }
    this.filter.Filter(this.jsonControlArray, this.TLHLForm, containerData, this.capacityName, this.capacitystatus);
  }
  //#endregion
  //#region to get rateType list
  async getDropDownData() {
    const rateTypeDropDown = await PayBasisdetailFromApi(this.masterService, 'RTTYP')
    if (this.objResult.Details) {
      const updaterateType = rateTypeDropDown.find(item => item.name === this.objResult.Details.rtNM);
      this.TLHLForm.controls.rateType.setValue(updaterateType);
    }
    this.filter.Filter(this.jsonControlArray, this.TLHLForm, rateTypeDropDown, this.rateTypeName, this.rateTypestatus);
  }
  //#endregion
}