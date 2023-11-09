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
  selector: 'app-vendor-lhlmodal',
  templateUrl: './vendor-lhlmodal.component.html'
})
export class VendorLHLModalComponent implements OnInit {
  companyCode: number;
  TLHLForm: UntypedFormGroup;
  ContractTLHLControls: any;
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
    this.getRouteList();
    this.getContainerList();
    this.getDropDownData();
    this.initializeFormControl();
   // console.log(this.objResult);
  }
  //#region to send data to parent component using dialogRef
  save(event) {
    const data = this.TLHLForm.value;
    this.dialogRef.close(data)
  }
  cancel() {
    this.dialogRef.close()
  }
  Close() {
    this.dialogRef.close()
  }
  //#endregion
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
      const updatedRoute = routeList.find((x) => x.name == this.objResult.Details.route);
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
      const updatedData = containerData.find((x) => x.name == this.objResult.Details.capacity);
      this.TLHLForm.controls.capacity.setValue(updatedData);
    }
    this.filter.Filter(this.jsonControlArray, this.TLHLForm, containerData, this.capacityName, this.capacitystatus);
  }
  //#endregion
  //#region to get rateType list
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      const { rateTypeDropDown } = res;
      if (this.objResult.Details) {
        const updaterateType = rateTypeDropDown.find(item => item.name === this.objResult.Details.rateType);
        this.TLHLForm.controls.rateType.setValue(updaterateType);
      }
      this.filter.Filter(this.jsonControlArray, this.TLHLForm, rateTypeDropDown, this.rateTypeName, this.rateTypestatus);
    });
  }
  //#endregion

}
