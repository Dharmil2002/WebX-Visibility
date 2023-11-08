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
  Close() {
    this.dialogRef.close()
  }
  //#region to send data to parent component using dialogRef
  save(event) {
    const data = this.TERForm.value;
    this.dialogRef.close(data)
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
 
  async getRouteList() {
    this.routeList = await this.objRouteLocationService.getRouteLocationDetail()
    if (this.objResult.Details) {
      const updatedRoute = this.routeList.find((x) => x.name == this.objResult.Details.route);
      this.TERForm.controls.route.setValue(updatedRoute);
    }
    this.filter.Filter(this.jsonControlArray, this.TERForm, this.routeList, this.routeName, this.routestatus);
  }
  async getContainerList() {
    const container = await this.objContainerService.getDetail();
    this.containerData = container.filter((item) => item.activeFlag) // Filter based on the isActive property
      .map(e => ({
        name: e.loadCapacity, // Map the name to the specified nameKey
        value: e.containerCode // Map the value to the specified valueKey
      }));
    if (this.objResult.Details) {
      const updatedData = this.containerData.find((x) => x.name == this.objResult.Details.capacity);
      this.TERForm.controls.capacity.setValue(updatedData);
    }
    this.filter.Filter(this.jsonControlArray, this.TERForm, this.containerData, this.capacityName, this.capacitystatus);
  }
  
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const { rateTypeDropDown } = res;
      if (this.objResult.Details) {
        const updaterateType = rateTypeDropDown.find(item => item.name === this.objResult.Details.rateType);
        this.TERForm.controls.rateType.setValue(updaterateType);
      }
      this.filter.Filter(this.jsonControlArray, this.TERForm, rateTypeDropDown, this.rateTypeName, this.rateTypestatus);
    });
  }
}