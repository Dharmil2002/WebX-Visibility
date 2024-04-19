import { Component,OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { QuickBookingControls } from "src/assets/FormControls/quick-docket-booking";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { setGeneralMasterData } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { CustomerService } from "src/app/Utility/module/masters/customer/customer.service";
import { StorageService } from "src/app/core/service/storage.service";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";
import { VehicleService } from "src/app/Utility/module/masters/vehicle-master/vehicle-master-service";
import { DocketService } from "src/app/Utility/module/operation/docket/docket.service";
import Swal from "sweetalert2";
import { firstValueFrom } from "rxjs";
import { DocCalledAsModel } from "src/app/shared/constants/docCalledAs";
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";
import { DCRService } from "src/app/Utility/module/masters/dcr/dcr.service";
import { nextKeyCode } from "src/app/Utility/commonFunction/stringFunctions";
import { ConvertToNumber } from "src/app/Utility/commonFunction/common";

@Component({
  selector: "app-quick-booking",
  templateUrl: "./quick-booking.component.html",
  providers: [FilterUtils],
})
export class QuickBookingComponent implements OnInit {
  docketControls: QuickBookingControls;
  quickDocketTableForm: UntypedFormGroup;
  jsonControlDocketArray: FormControls[];

  /*company code declare globly beacuse it's use multiple time in out code*/
  companyCode = 0;

  /*here the declare varible to bind the dropdown*/
  fromCity: string; //it's used in getCity() for the binding a fromCity
  fromCityStatus: boolean; //it's used in getCity() for binding fromCity
  toCity: string; //it's used in getCity() for binding ToCity
  toCityStatus: boolean; //it's used in getCity() for binding ToCity
  customer: string; //it's used in customerDetails() for binding billingParty
  customerStatus: boolean; //it's used in customerDetails() for binding billingParty
  destination: string;
  destinationStatus: boolean;
  vehNo: string;
  vehicleStatus: boolean;
  /*it's breadScrums to used in html you must delcare here */
  userName = "";
  DocCalledAs: DocCalledAsModel
  breadScrums = [
    {
      title: "CNote Quick Booking",
      items: ["Quick-Booking"],
      active: "CNote Quick Booking",
    },
  ];
  paymentType: AutoComplete[];
  rules: any[]=[];
  alpaNumber: boolean;
  sequence:boolean;
  isBrachCode:boolean;
  fyear:boolean;
  length:number=0;
  mseq: boolean;
  lastDoc:string;
  isManual: boolean;
  dcrDetail={};
  formTitle: string;
  constructor(
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private generalService: GeneralService,
    private customerService: CustomerService,
    private _NavigationService: NavigationService,
    private docketService:DocketService,
    private locationService: LocationService,
    private storage: StorageService,
    private pinCodeService: PinCodeService,
    private vehicleService:VehicleService,
    private controlPanel: ControlPanelService,
    private dcrService:DCRService
  ) {    
    this.companyCode = this.storage.companyCode;
    this.userName = this.storage.userName;
    this.DocCalledAs = controlPanel.DocCalledAs;
    this.breadScrums = [
      {
        title: `${this.DocCalledAs.Docket} Quick Booking`,
        items: ["Quick Booking"],
        active: `${this.DocCalledAs.Docket} Quick Booking`,
      }
    ]
    this.formTitle=`${this.DocCalledAs.Docket} Quick Booking`
    this.initializeFormControl();    
  }

  ngOnInit(): void {
    // Component initialization logic goes here
    this.getVehicleDetails();
  }

  initializeFormControl() {
    // Create an instance of QuickBookingControls to get form controls for different sections
    this.docketControls = new QuickBookingControls(this.generalService);    
    this.docketControls.applyFieldRules(this.companyCode).then(() => {
        // Get form controls for Quick Booking section
        this.jsonControlDocketArray = this.docketControls.getDocketFieldControls();
        this.commonDropDownMapping();
        this.getDataFromGeneralMaster();
        // Create the form group using the form builder and the form controls array
        this.quickDocketTableForm = formGroupBuilder(this.fb, [ this.jsonControlDocketArray ]);
    });
    this.getRules();
  }

  async getDataFromGeneralMaster() {
    this.paymentType = await this.generalService.getGeneralMasterData("PAYTYP");
    setGeneralMasterData(this.jsonControlDocketArray, this.paymentType, "payType");
    this.quickDocketTableForm.controls["payType"].setValue(this.paymentType.find((x)=>x.name=="TBB").value);
  }

  functionCallHandler($event) {
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

  integerOnly(event): boolean {    
    const charCode = event.eventArgs.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.eventArgs.preventDefault();
      return false;
    }
    return true;
  }

  /*here i initilize the function which used to bind dropdown Controls*/
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
      { name: "vehNo", target: "vehNo" },
      { name: "destination", target: "destination" },
      { name: "billingParty", target: "customer" },
    ];
    mapControlArray(this.jsonControlDocketArray, docketMappings); // Map docket control array
  }
  /*get City From PinCode Master*/
  async getPincodeDetail(event) {
    const cityMapping = event.field.name == "fromCity" ? this.fromCityStatus : this.toCityStatus;
    await this.pinCodeService.getCity(
      this.quickDocketTableForm,
      this.jsonControlDocketArray,
      event.field.name,
      cityMapping
    );
  }
  /*end*/
  // Customer details
  async getCustomer(event) {
    await this.customerService.getCustomerForAutoComplete(this.quickDocketTableForm, this.jsonControlDocketArray, event.field.name, this.customerStatus);
  }
  /*here i  created a Function for the destination*/
  async destionationDropDown() {
    if (this.quickDocketTableForm.controls.destination.value.length > 2) {
      const destinationMapping = await this.locationService.locationFromApi({
        locCode: { 'D$regex': `^${this.quickDocketTableForm.controls.destination.value}`, 'D$options': 'i' },
      });
      this.filter.Filter(this.jsonControlDocketArray, this.quickDocketTableForm, destinationMapping, this.destination, this.destinationStatus);
    }
  }
  /*End*/
  // get vehicleNo
  async getVehicleDetails() {
    const vehileList=await this.vehicleService.getVehicleNo(
      {
      currentLocation:this.storage.branch, status:"Available"}, true);
    this.filter.Filter(
      this.jsonControlDocketArray,
      this.quickDocketTableForm,
      vehileList,
      this.vehNo,
      this.vehicleStatus
    );
  }
  cancel() {
    this._NavigationService.navigateTotab(
      'DocketStock',
      "dashboard/Index"
    );
  }
  /*end*/
  async docketValidation(){
    const res = await this.dcrService.validateFromSeries(this.quickDocketTableForm.controls['docketNumber'].value);
    this.dcrDetail=res;
    if(res) {
      if(res.aLOTO == 'L' && res.aSNTO == 'E' && res.aSNCD && res.aLOCD==this.storage.branch) {
       await this.validateDcr(res);
      }
      else if(res.aLOTO == 'L' && res.aSNTO == 'B' && this.storage.userName == res.aSNCD) {
        await this.validateDcr(res);
      }
      else if(res.aLOTO == 'C' && res.aSNTO == 'C' && res.aSNCD) { 
        const billingParty=this.quickDocketTableForm.controls['billingParty'].value?.value||"";
        if(billingParty) {
          if(res.aSNCD==billingParty) {
            await this.validateDcr(res);
          }
          else{
            await this.errorMessage();
          }
        }
        else {
          if(await this.validateDcr(res)) {
            this.quickDocketTableForm.controls['billingParty'].setValue( { name:res.aSNNM,value:res.aSNCD } );
          }
          else{
            await this.errorMessage();
          }
        }
      }
      else{
        this.errorMessage();
      }
    }
    else{
      this.errorMessage();
    }
    
  }
  /*check Dcr is use or not*/
  async validateDcr(dcr: any): Promise<boolean> {   
    let isValid = false;
    const dktNo = this.quickDocketTableForm.controls['docketNumber'].value;
    const doc = await this.dcrService.getDCRDocument({dOCNO: dktNo});
    if(doc && doc.dOCNO == dktNo) {
      Swal.fire({
        icon: 'warning',
        title: `${this.DocCalledAs.Docket} No is ${ doc.sTS == 2 ? "declared void" : "already used"}`,
        text: `${this.DocCalledAs.Docket} No is ${ doc.sTS == 2 ? "declared void" : "already used"}`,
        showConfirmButton: true,
        confirmButtonText: 'OK',
        timer: 5000,
        timerProgressBar: true,
      });
      this.quickDocketTableForm.controls['docketNumber'].setValue("");
    }
    else{
      if(this.mseq) {
        const nextCode = await this.dcrService.getNextDocumentNo(this.dcrDetail);
        if (nextCode == "" || nextCode != dktNo) {
          Swal.fire({
            icon: 'warning',
            title:  `${this.DocCalledAs.Docket} No is out of sequence. Next no is sequence is ${nextCode}.`,
            showConfirmButton: true,
            confirmButtonText: 'OK',
            timer: 5000,
            timerProgressBar: true,

          })
          this.quickDocketTableForm.controls['docketNumber'].setValue("");         
        }
        else{
          isValid = true
          Swal.fire({
            icon: 'success',
            title:'Valid',
            text: `${this.DocCalledAs.Docket} No has been allocated. You may now proceed`,
            showConfirmButton: true,
            confirmButtonText: 'OK',
            timer: 5000,
            timerProgressBar: true,
          });
        }     
      }
      else{
        isValid = true
        Swal.fire({
          icon: 'success',
          title:'Valid',
          text: `${this.DocCalledAs.Docket} No has been allocated. You may now proceed`,
          showConfirmButton: true,
          confirmButtonText: 'OK',
          timer: 5000,
          timerProgressBar: true,
        });
      }     
    }

    return isValid;
  }
  /*end*/
  async errorMessage(){
    Swal.fire({
      icon: 'error',
      title:`${this.DocCalledAs.Docket} No is not valid`,
      text:`${this.DocCalledAs.Docket} No is not valid`,
      showConfirmButton: true,
      confirmButtonText: 'OK',
      timer: 5000,
      timerProgressBar: true,
    });
    this.quickDocketTableForm.controls['docketNumber'].setValue("");
  }
  /*get Rules*/
  async getRules(){
    const filter={
      cID:this.storage.companyCode,
      mODULE:"CNOTE",
      aCTIVE:true
    }
    const res=await this.controlPanel.getModuleRules(filter);
    if(res.length>0){
      this.rules=res;
      this.checkDocketRules();
    }
    
  }
  /*End*/
   checkDocketRules(){
      const STYP = this.rules.find(x=>x.rULEID=="STYP" && x.aCTIVE)
      if(STYP){
        const isManual = STYP.vAL === "M";
        this.jsonControlDocketArray.find(x=>x.name=="docketNumber").disable = !isManual;
        this.quickDocketTableForm.controls['docketNumber'].setValue(isManual?"":"Computerized");        
        this.isManual=isManual;
      }

      const ELOC = this.rules.find(x=>x.rULEID=="ELOC" && x.aCTIVE)
      if(ELOC){
        if(!ELOC.vAL.includes(this.storage.branch)) {
          // check exception for branch
        }
      }

      this.alpaNumber = this.rules.find(x=>x.rULEID=="NTYP" && x.aCTIVE)?.vAL=="AN";
      this.sequence = this.rules.find(x=>x.rULEID=="SL" && x.aCTIVE)?.vAL=="S";
      this.isBrachCode = this.rules.find(x=>x.rULEID=="BCD" && x.aCTIVE)?.vAL=="Y";
      this.fyear = this.rules.find(x=>x.rULEID=="YEAR" && x.aCTIVE)?.vAL=="F";
      this.length = ConvertToNumber(this.rules.find(x=>x.rULEID=="LENGTH" && x.aCTIVE)?.vAL);
      this.mseq = this.rules.find(x=>x.rULEID=="MSEQ" && x.aCTIVE)?.vAL=="Y";
  }
  async save() {
    // Clear form validators and revalidate the form
    const formControls = this.quickDocketTableForm;
    clearValidatorsAndValidate(formControls);
    // Prepare request data
    const requestData = { ...formControls.value, isComplete: false };
    // Set payment type name based on selected value
    const paymentTypeEntry = this.paymentType.find(entry => entry.value === requestData.payType);
    requestData.pAYTYPNM = paymentTypeEntry ? paymentTypeEntry.name : "";
    const fieldMapping = await this.docketService.quickDocketsMapping(requestData,this.isManual);
      if(this.isManual){
        await this.docketService.addDcrDetails(fieldMapping,this.dcrDetail);
      }
    await this.docketService.createDocket(fieldMapping,this.isManual);
  }
  
  preventNegative(event) {
    // Extract the field value directly using destructuring for cleaner access
    const { name } = event.field;
    const fieldValue = this.quickDocketTableForm.controls[name].value;
    // Use a more direct method to check for negative values
    if (Number(fieldValue) < 0) {
      // Display the error message using SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Negative values are not allowed.'
      });
      // Reset the field value to 0 to prevent negative input
      this.quickDocketTableForm.controls[name].setValue(0);
    }
  }
  

}
