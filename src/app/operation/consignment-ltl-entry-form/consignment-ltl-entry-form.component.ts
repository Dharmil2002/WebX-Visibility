import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormControls } from 'src/app/Models/FormControl/formcontrol';
import { AutoComplete } from 'src/app/Models/drop-down/dropdown';
import { setGeneralMasterData } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { PinCodeService } from 'src/app/Utility/module/masters/pincode/pincode.service';
import { PrqService } from 'src/app/Utility/module/operation/prq/prq.service';
import { ControlPanelService } from 'src/app/core/service/control-panel/control-panel.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { DocCalledAsModel } from 'src/app/shared/constants/docCalledAs';
import { ConsignmentLtl } from 'src/assets/FormControls/consgiment-ltl-controls';

@Component({
  selector: 'app-consignment-ltl-entry-form',
  templateUrl: './consignment-ltl-entry-form.component.html'
})
export class ConsignmentLTLEntryFormComponent implements OnInit {
  breadscrums = [];
  DocCalledAs : DocCalledAsModel;
  quickdocketDetaildata: any;
  prqFlag: boolean;
  quickDocket: boolean;
  backPath: string;
  consigmentControls: ConsignmentLtl;
  allFormControls:FormControls[];
  basicFormControls:FormControls[];
  consigneeControlArray:FormControls[];
  consignorControlArray:FormControls[];
  customeControlArray:FormControls[];
  invoiceControlArray:FormControls[];
  freightControlArray:FormControls[];
  prqNoDetail: any[];
  paymentType:AutoComplete[];
  svcType: AutoComplete[];
  riskType: AutoComplete[];
  pkgsType: AutoComplete[];
  tranType: AutoComplete[];
  consignmentForm:UntypedFormGroup;
  invoiceForm:UntypedFormGroup;
  freightForm:UntypedFormGroup;
  deliveryType: AutoComplete[];
  wtUnits: AutoComplete[];
  constructor(
    private controlPanel:ControlPanelService,
    private prqService: PrqService,
    private route: Router,
    private generalService: GeneralService,
    private storage:StorageService,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private pinCodeService: PinCodeService,
    private locationService: LocationService
  ) { 
    const navigationState = this.route.getCurrentNavigation()?.extras?.state?.data;
    this.DocCalledAs = controlPanel.DocCalledAs;
    
    this.breadscrums = [
      {
        title: `${this.DocCalledAs.Docket} Generation`,
        items: ["Masters"],
        active: `${this.DocCalledAs.Docket} Generation`,
      },
    ];

    if (navigationState != null) {
      this.quickdocketDetaildata = navigationState.columnData || navigationState;

      if ('prqNo' in this.quickdocketDetaildata) {
        this.prqFlag = true;
      } else {
        this.quickDocket = true;
      }
    }
    this.consigmentControls = new ConsignmentLtl(this.generalService);
    
    this.consigmentControls.applyFieldRules(this.storage.companyCode).then(() => {
      this.initializeFormControl();
      this.getDataFromGeneralMaster();
      this.bindQuickdocketData();     
    });
  }

  ngOnInit(): void {
    
  }
  /*below function is for intailize the form controls */
  initializeFormControl() {
    this.allFormControls = this.consigmentControls.getDocketFieldControls();
    this.basicFormControls = this.allFormControls.filter((control) => control.additionalData.metaData=="Basic");
    this.customeControlArray =  this.allFormControls.filter((control) => control.additionalData.metaData=="custom");
    this.consignorControlArray =  this.allFormControls.filter((control) => control.additionalData.metaData=="consignor");
    this.consigneeControlArray =  this.allFormControls.filter((control) => control.additionalData.metaData=="consignee");
    this.invoiceControlArray =  this.consigmentControls.getInvoiceDetail();
    this.freightControlArray =  this.consigmentControls.getFreightDetail();
    // Perform common drop-down mapping
    // Build form groups
    this.consignmentForm = formGroupBuilder(this.fb,[this.allFormControls]);
    this.invoiceForm = formGroupBuilder(
      this.fb,
      [this.invoiceControlArray]
    );
    this.freightForm = formGroupBuilder(
      this.fb,
      [this.freightControlArray]
    );
    // Set initial values for the form controls
    this.bindQuickdocketData();
    this.commonDropDownMapping();

}
/*end*/

// Common drop-down mapping
  commonDropDownMapping() {
    const mapControlArray = (controlArray, mappings) => {
      controlArray.forEach((data) => {
        const mapping = mappings.find((mapping) => mapping.name === data.name);
        if (mapping) {
          this[mapping.target] = data.name; // Set the target property with the value of the name property
          this[`${mapping.target}Status`] =
            data.additionalData.showNameAndValue; // Set the targetStatus property with the value of additionalData.showNameAndValue
        }
      });
    };

    const docketMappings = [
      { name: "fromCity", target: "fromCity" },
      { name: "toCity", target: "toCity" },
      { name: "billingParty", target: "customer" },
    ];

    const consignorMappings = [
      { name: "consignorName", target: "consignorName" },
      { name: "consignorCity", target: "consignorCity" },
      { name: "consignorPinCode", target: "consignorPinCode" },
    ];

    const consigneeMappings = [
      { name: "consigneeCity", target: "consigneeCity" },
      { name: "consigneeName", target: "consigneeName" },
      { name: "consigneePincode", target: "consigneePincode" },
    ];
    const destinationMapping = [{ name: "destination", target: "destination" }];
    mapControlArray(this.allFormControls, docketMappings); // Map docket control array
    mapControlArray(this.allFormControls, consignorMappings); // Map consignor control array
    mapControlArray(this.allFormControls, consigneeMappings); // Map consignee control array
    mapControlArray(this.allFormControls, destinationMapping);
  }
  //End
  async bindQuickdocketData() {
    
    if (this.quickDocket) {
          // this.DocketDetails=this.quickdocketDetaildata?.docketsDetails||{};
          // const contract=this.contractForm.value;
          // this.contractForm.controls["payType"].setValue(this.DocketDetails?.pAYTYP || "");
          // this.vehicleNo = this.DocketDetails?.vEHNO;
          // this.contractForm.controls["totalChargedNoOfpkg"].setValue(this.DocketDetails?.pKGS || "");
          // this.contractForm.controls["actualwt"].setValue(this.DocketDetails?.aCTWT || "");
          // this.contractForm.controls["chrgwt"].setValue(this.DocketDetails?.cHRWT || "");
          // this.tabForm.controls["docketNumber"].setValue(this.DocketDetails?.dKTNO || "");
          // this.tabForm.controls["docketDate"].setValue(this.DocketDetails?.dKTDT || "");
          // const billingParties={
          //   name:this.DocketDetails?.bPARTYNM||"",
          //   value:this.DocketDetails?.bPARTY||""
          // }
          // this.tabForm.controls["billingParty"].setValue(billingParties);
          // const fCity={
          //   name:this.DocketDetails?.fCT||"",
          //   value:this.DocketDetails?.fCT||""
          // }
          // this.tabForm.controls["fromCity"].setValue(fCity);
          // const tCity={
          //   name:this.DocketDetails?.tCT||"",
          //   value:this.DocketDetails?.tCT||""
          // }
          // this.tabForm.controls["toCity"].setValue(tCity);
          // const destionation={
          //   name:this.DocketDetails?.dEST||"",
          //   value:this.DocketDetails?.dEST||""
          // }
          // this.contractForm.controls["destination"].setValue(destionation);
          // this.tableData[0].NO_PKGS = this.DocketDetails?.pKGS || "";
          // this.tableData[0].ACT_WT = this.DocketDetails?.aCTWT || "";
        }    
    //this.getCity();
    //this.customerDetails();
    //this.destionationDropDown();

  }
  async getDataFromGeneralMaster() {
    this.paymentType = await this.generalService.getGeneralMasterData("PAYTYP");
    this.riskType = await this.generalService.getGeneralMasterData("RSKTYP");
    this.pkgsType = await this.generalService.getGeneralMasterData("PKGS");
    this.deliveryType = await this.generalService.getGeneralMasterData("PKPDL");
    this.wtUnits = await this.generalService.getGeneralMasterData("WTUNIT");
    this.tranType = await this.generalService.getDataForAutoComplete("product_detail", { companyCode: this.storage.companyCode }, "ProductName", "ProductID");
    setGeneralMasterData(this.allFormControls, this.paymentType, "payType");
    setGeneralMasterData(this.allFormControls, this.riskType, "risk");
    setGeneralMasterData(this.allFormControls, this.pkgsType, "pkgsType");
    setGeneralMasterData(this.allFormControls, this.tranType, "transMode");
    setGeneralMasterData(this.allFormControls, this.wtUnits, "weight_in");
    setGeneralMasterData(this.allFormControls, this.deliveryType, "delivery_type");
  }
    //#region functionCallHandler
    functionCallHandler($event) {
      // console.log("fn handler called" , $event);
      let field = $event.field; // the actual formControl instance
      let functionName = $event.functionName; // name of the function , we have to call
  
      // we can add more arguments here, if needed. like as shown
      // $event['fieldName'] = field.name;
  
      // function of this name may not exists, hence try..catch
      try {
        this[functionName]($event);
      } catch (error) {
        // we have to handle , if function not exists.
        console.log("failed");
      }
    }
    //#endregion
  /*below function is call when the prq based data we required*/
  async getPrqDetail(){
    const prqNo = await this.prqService.getPrqForBooking(
      this.storage.branch,
      this.consignmentForm.value.billingParty.value,
      this.consignmentForm.get("payType")?.value
    );
    this.prqNoDetail = prqNo.allPrqDetail;

    const prqDetail = prqNo.allPrqDetail.map((x) => ({
      name: x.prqNo,
      value: x.prqNo,
    }));

    this.filter.Filter(this.allFormControls, this.consignmentForm, prqDetail,"prqNo",false);
  }
  /*End*/
  /*pincode based city*/
  async getPincodeDetail(event) {
    await this.pinCodeService.getCity(
      this.consignmentForm,
      this.allFormControls,
      event.field.name,
      false
    );
  }
  /*end*/
  /*below is function for the get Pincode Based on city*/
  async getPinCodeBasedOnCity(event) {
    const fieldName=event.field.name=="fromCity"?"fromPinCode":"toPinCode"
    const pincode = await this.pinCodeService.pinCodeDetail({CT:event.eventArgs.option.value.value});
    if(pincode.length>0){
      const pincodeMapping=pincode.map((x) => ({
        name: `${x.PIN}`,
        value: `${x.PIN}`
      }));
      this.filter.Filter(this.allFormControls,this.consignmentForm,pincodeMapping,fieldName,false);
    }
  }
  /*End*/
  /*below function is for the get city based on pincode*/
  async getDestinationBasedOnPincode(event) {
     const locations = await this.locationService.locationFromApi({D$or:[{locPincode:parseInt(event.eventArgs.option.value.value),mappedPinCode:{D$in:[parseInt(event.eventArgs.option.value.value)]}}]});
     this.filter.Filter(this.allFormControls,this.consignmentForm,locations,"destination",true);
  }
   
  /*End*/
}
