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
    const res=await this.dcrService.validateFromSeries(this.quickDocketTableForm.controls['docketNumber'].value);
    if(Object.keys(res).length>0){
      switch(res.aSNTO){
        case "E":
          if(res.aSNNM){
            if(this.storage.userName==res.aSNCD){
             this.validateDcr();
            }
            else{
              this.errorMessage();
            }
           
          }
          else{
            if(res.aLOTO=="L"){
              if(res.aLOCD==this.storage.branch){
                this.validateDcr();
              }
              else{
                this.errorMessage();
              }
            }
          }
          break
        case "B":
          if(res.aSNCD){
            if(this.storage.userName==res.aSNCD){
              this.validateDcr();
            }
            else{
              this.errorMessage();
            }
          }
          break
          case "C":
            if(res.aSNTO=="C" && res.aLOCD==this.storage.branch){
              const billingParty=this.quickDocketTableForm.controls['billingParty'].value?.value||"";
              if(billingParty){
                if(res.aSNCD==billingParty){
                  this.validateDcr();
                }
                else{
                  this.errorMessage();
                }
              }
              else{
                this.validateDcr();
                this.quickDocketTableForm.controls['billingParty'].setValue({name:res.aSNNM,value:res.aSNCD})
              }
              
            }
            else{
               this.errorMessage();
            }
            break;

        }
       
    }
    else{
      this.errorMessage();
    }
    this.dcrDetail=res;
    
  }
  /*check Dcr is use or not*/
  async validateDcr(){
    const res=await this.dcrService.getDCRDocument({dOCNO:this.quickDocketTableForm.controls['docketNumber'].value});
   
    if(Object.keys(res).length>0){
     
      Swal.fire({
        icon: 'error',
        title:'DCR No is already used',
        text:'DCR No is already used',
        showConfirmButton: true,
        confirmButtonText: 'OK',
        timer: 5000,
        timerProgressBar: true,
      });
      this.quickDocketTableForm.controls['docketNumber'].setValue("");
   
    }
    else{
      if(this.mseq){
        const mseq=await this.dcrService.getLastDocumentNo(this.dcrDetail);
        const nextCode=await nextKeyCode(mseq.dOCNO)
        if(nextCode==this.quickDocketTableForm.controls['docketNumber'].value){
          Swal.fire({
            icon: 'success',
            title:'Valid',
            text:' DCR number has been allocated. You may now proceed',
            showConfirmButton: true,
            confirmButtonText: 'OK',
            timer: 5000,
            timerProgressBar: true,
          });
        }
        else{
          Swal.fire({
            icon: 'error',
            title:'The DCR number is out of sequence',
            showConfirmButton: true,
            confirmButtonText: 'OK',
            timer: 5000,
            timerProgressBar: true,

          })
          this.quickDocketTableForm.controls['docketNumber'].setValue("");
        }
      }
      else{
        Swal.fire({
          icon: 'success',
          title:'Valid',
          text:' DCR number has been allocated. You may now proceed',
          showConfirmButton: true,
          confirmButtonText: 'OK',
          timer: 5000,
          timerProgressBar: true,
        });
      }
     
    }
  
  }
  /*end*/
  async errorMessage(){
    Swal.fire({
      icon: 'error',
      title:'DCR No is not valid',
      text:'DCR No is not valid',
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
      mODULE:"CNOTE"
    }
    const res=await this.controlPanel.getModuleRules(filter);
    if(res.length>0){
      this.rules=res;
      this.checkDocketRules();
    }
    
  }
  /*End*/
   checkDocketRules(){
      this.rules.forEach((x)=>{
        switch(x.rULENM){
          case "STYP":
            const isManual = x.vAL === "C";
            this.jsonControlDocketArray.forEach(control => {
                if (control.name === "docketNumber") {
                    control.disable = isManual;
                    this.quickDocketTableForm.controls['docketNumber'].setValue(isManual==false?"":"Computerized");
                }
            });
            this.isManual=isManual==false?true:false;
            break;
          case "ELOC":
           if(!x.vAL.includes(this.storage.branch)){
            Swal.fire({
              icon: "info", 
              title: "Missing Information",
              text: "this branch is not allowed to create docket.",
              showConfirmButton: true,
              confirmButtonText: 'OK',
              confirmButtonColor: '#d33',
              timer: 5000,
              timerProgressBar: true,
            
          });
            this._NavigationService.navigateTotab('DocketStock', "dashboard/Index");
           }
            break;

          case "NTYP":
           this.alpaNumber=x.vAL=="AN";
          break;
          case "SL":
            this.sequence=x.vAL=="S";
            break;
          case "BCD":
            this.isBrachCode=x.vAL=="Y";
            break;
          case "YEAR":
            this.fyear=x.vAL=="F";
            break;
          case "LENGTH":
            this.length=x.vAL;
            break;
          case "MSEQ":
          this.mseq=x.vAL=="Y";
          //  this.mseq=true;
            break;

        }
      })
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
