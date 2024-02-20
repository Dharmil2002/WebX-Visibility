import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { Subject, firstValueFrom } from "rxjs";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { EwayBillControls } from "src/assets/FormControls/ewayBillControl";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { OperationService } from "src/app/core/service/operations/operation.service";
import Swal from "sweetalert2";
import { Router } from "@angular/router";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
import {calculateInvoiceTotalCommon} from "./docket.utility";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { setGeneralMasterData } from "src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction";
import { AutoComplete } from "src/app/Models/drop-down/dropdown";
import { CustomerService } from "src/app/Utility/module/masters/customer/customer.service";
import { PinCodeService } from "src/app/Utility/module/masters/pincode/pincode.service";
import { LocationService } from "src/app/Utility/module/masters/location/location.service";
import { DocketService } from "src/app/Utility/module/operation/docket/docket.service";
import { StorageService } from "src/app/core/service/storage.service";
import { financialYear} from "src/app/Utility/date/date-utils";
@Component({
  selector: "app-eway-example",
  templateUrl: "./eway-bill-docket-booking-v2.html",
})
export class EwayBillDocketBookingV2Component implements OnInit {
  breadscrums = [
    {
      title: "EwayBillDocket",
      items: ["Masters"],
      active: "CNoteGeneration",
    },
  ];
  ewayBillTab: EwayBillControls; // a example of model , whose form we have to display
  docketControlArray: FormControls[]; // array to hold form controls
  consignorControlArray: FormControls[]; // array to hold form controls
  consigneeControlArray: FormControls[]; // array to hold form controls
  containerControlArray: FormControls[];
  appointmentControlArray: FormControls[];
  contractControlArray: FormControls[];
  totalSummaryControlArray: FormControls[];
  ewayBillControlArray: FormControls[];
  // array to hold form controls
  tabData: any;
  contractData: any;
  sampleDropdownData: any[];
  protected _onDestroy = new Subject<void>();
  tabForm: UntypedFormGroup;
  contractForm: UntypedFormGroup;
  location: any;
  locationStatus: any;
  RouteStatus: any;
  tableData: any = [];
  // Action buttons configuration
  actionObject = {
    addRow: true,
    submit: false,
    search: true,
  };
  DocketField: any;
  isLinear = true;
  showSaveAndCancelButton = true;
  error: any;
  quickdocketDetaildata: any;
  fromCity: string;
  fromCityStatus: any;
  ewayData: any;
  userName = localStorage.getItem("Username");
  // Displayed columns configuration
  displayedColumns1 = {
    srNo: {
      name: "#",
      key: "index",
     style: "",
    },
    INVNO: {
      name: "Invoice No.",
      key: "inputString",
      style: "min-width:150px",
    },
    INVDT: {
      name: "Invoice Date",
      key: "date",
      additionalData: {
        maxDate: new Date(),
      },
      style: "max-width:350px",
    },
    LENGTH: {
      name: "Length (CM)",
      key: "inputnumber",
      style: "min-width:150px",
      functions: {
        onChange: "calculateInvoiceTotal",
      },
    },
    BREADTH: {
      name: "Breadth (CM)",
      key: "inputnumber",
     style: "min-width:150px",
      functions: {
        onChange: "calculateInvoiceTotal",
      },
    },
    HEIGHT: {
      name: "Height (CM)",
      key: "inputnumber",
      functions: {
        onChange: "calculateInvoiceTotal",
      },
     style: "min-width:150px",
    },
    DECLVAL: {
      name: "Declared Value",
      key: "inputnumber",
      functions: {
        onChange: "calculateInvoiceTotal",
      },
     style: "min-width:150px",
    },
    NO_PKGS: {
      name: "No. of Pkgs.",
      key: "inputnumber",
      functions: {
        onChange: "calculateInvoiceTotal",
      },
     style: "min-width:150px",
    },
    CUB_WT: {
      name: "Cubic Weight",
      key: "inputnumber",
      functions: {
        onChange: "calculateInvoiceTotal",
      },
     style: "min-width:150px",
    },
    ACT_WT: {
      name: "Actual Weight (KG)",
      key: "inputnumber",
      functions: {
        onChange: "calculateInvoiceTotal",
      },
     style: "min-width:150px",
    },
    Invoice_Product: {
      name: "Product",
      key: "inputString",
     style: "min-width:150px",
    },
    HSN_CODE: {
      name: "HSN Code",
      key: "inputString",
     style: "min-width:150px",
    },
    action: {
      name: "Action",
      key: "Action",
     style: "min-width:150px",
    },
  };
  /*below the varible for the
   dropdow biding*/

  toCity: string;
  toCityStatus: any;
  customer: string;
  customerStatus: any;
  consigneePincode: any;
  consigneePincodeStatus: any;
  consignorPinCode: any;
  consignorPinCodeStatus: any;
  consignorName: string;
  consignorStatus: any;
  consignorCity: string;
  consignorCityStatus: any;
  consigneeCity: string;
  consigneeCityStatus: any;
  consigneeName: string;
  consigneeNameStatus: any;
  /*End*/
  genralMaster: any;
  containerSize1: any;
  containerSize2: any;
  containerType: any;
  containerSize1Size: boolean;
  destination: any;
  destinationStatus: boolean;
  quickDocket: boolean;
  companyCode = parseInt(localStorage.getItem("companyCode"));
  branch = localStorage.getItem("Branch");
  dockNo: string;
  DocketDetails: any;
  vehicleNo: string;
  docketId: string;
  prqFlag: boolean;
  paymentType:AutoComplete[];
  svcType: AutoComplete[];
  riskType: AutoComplete[];
  pkgsType: AutoComplete[];
  tranType: AutoComplete[];
  constructor(
   private locationService:LocationService,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private generalService: GeneralService,
    private operationService: OperationService,
    private pinCodeService: PinCodeService,
    private route: Router,
    private docketService:DocketService,
    private _NavigationService: NavigationService,
    private customerService:CustomerService,
    private storage:StorageService
  ) {
    const navigationState = this.route.getCurrentNavigation()?.extras?.state?.data;
    if (navigationState != null) {
      this.quickdocketDetaildata = navigationState.columnData || navigationState;

      if ('prqNo' in this.quickdocketDetaildata) {
        this.prqFlag = true;
      } else {
        this.quickDocket = true;
      }
    }

    this.bindQuickdocketData();
  }


  ngOnInit(): void {
    this.loadTempData();
    this.initializeFormControl();
    this.getDataFromGeneralMaster();
  }

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

  // Initialize form control
  initializeFormControl() {
    this.ewayBillTab = new EwayBillControls();
    // Get control arrays for different sections
    this.docketControlArray = this.ewayBillTab.getDocketFieldControls();
    this.consignorControlArray = this.ewayBillTab.getConsignorFieldControls();
    this.consigneeControlArray = this.ewayBillTab.getConsigneeFieldControls();
    this.appointmentControlArray =
      this.ewayBillTab.getAppointmentFieldControls();
    this.containerControlArray = this.ewayBillTab.getContainerFieldControls();
    this.contractControlArray = this.ewayBillTab.getContractFieldControls();
    this.totalSummaryControlArray =
      this.ewayBillTab.getTotalSummaryFieldControls();
    this.ewayBillControlArray = this.ewayBillTab.getEwayBillFieldControls();

    // Set up data for tabs and contracts
    this.tabData = {
      "Cnote Details": this.docketControlArray,
      "Consignor Details": this.consignorControlArray,
      "Consignee Details": this.consigneeControlArray,
      "Appointment Based Delivery": this.appointmentControlArray
    };

    this.contractData = {
      "Contract Details": this.contractControlArray,
      "Total Summary": this.totalSummaryControlArray,
      "E-Way Bill Details": this.ewayBillControlArray,
    };
    // Perform common drop-down mapping
    this.commonDropDownMapping();
    // Build form groups
    this.tabForm = formGroupBuilder(this.fb, Object.values(this.tabData));
    this.contractForm = formGroupBuilder(
      this.fb,
      Object.values(this.contractData)
    );
    // Set initial values for the form controls
    this.tabForm.controls["appoint"].setValue("N");
    this.bindQuickdocketData();
  }
  async getDataFromGeneralMaster() {
    this.paymentType = await this.generalService.getGeneralMasterData("PAYTYP");
    this.svcType = await this.generalService.getGeneralMasterData("BUSVERT");
    this.riskType = await this.generalService.getGeneralMasterData("RSKTYP");
    this.pkgsType = await this.generalService.getGeneralMasterData("PKGS");
    this.tranType = await this.generalService.getGeneralMasterData("tran_mode");
    setGeneralMasterData(this.contractControlArray, this.paymentType, "payType");
    setGeneralMasterData(this.contractControlArray, this.svcType, "svcType");
    setGeneralMasterData(this.contractControlArray, this.riskType, "rskty");
    setGeneralMasterData(this.contractControlArray, this.pkgsType, "pkgsType");
    setGeneralMasterData(this.contractControlArray, this.tranType, "tranType");
  }

  /*get City From PinCode Master*/
  async getCityDetail(event) {
    const controlMap = new Map([
      ['fromCity', this.docketControlArray],
      ['toCity', this.docketControlArray],
      ['consignorCity', this.consignorControlArray],
      ['consigneeCity', this.consigneeControlArray]
    ]);
    const { name } = event.field;
    const jsonControls = controlMap.get(name);
    const cityMapping = event.field.name == "fromCity" ? this.fromCityStatus : this.toCityStatus;
    await this.pinCodeService.getCity(
      this.tabForm,
      jsonControls,
      event.field.name,
      cityMapping
    );
  }
  /*end*/
    /*get PinCode From PinCode Master*/
    async getPinCodeDetail(event) {
      
      const controlMap = new Map([
        ['consignorPinCode', this.consignorControlArray],
        ['consigneePinCode', this.consigneeControlArray],
      ]);
      const controlCity = new Map([
        ['consignorPinCode','consignorCity'],
        ['consigneePinCode','consigneeCity'],
      ]);
      const { name } = event.field;
      const jsonControls = controlMap.get(name);
      const city = controlCity.get(name);
      const cityMapping = this.consignorPinCodeStatus;
      await this.pinCodeService.getPincodes(
        this.tabForm,
        jsonControls,
        event.field.name,
        cityMapping,
        this.tabForm.controls[city]?.value.value
      );
    }
    /*end*/
  async getCustomer(event) {
    const controlMap = new Map([
      ['billingParty', this.docketControlArray],
      ['consignorName', this.consignorControlArray],
      ['consigneeName', this.consigneeControlArray]
    ]);
    const { name } = event.field;
    const jsonControls = controlMap.get(name);
  
    if (!jsonControls) {
      console.error(`Invalid field name: ${name}`);
      return;
    }
    try {
      // Assuming the method returns a value you need
      await this.customerService.getCustomerForAutoComplete(this.tabForm, jsonControls, name, this.customerStatus);
      // Handle the response or additional logic here
    } catch (error) {
      // Additional error handling logic here
    }
  }
  
  async bindQuickdocketData() {
    if (this.quickDocket) {
          this.DocketDetails=this.quickdocketDetaildata?.docketsDetails||{};
          const contract=this.contractForm.value;
          this.contractForm.controls["payType"].setValue(this.DocketDetails?.pAYTYP || "");
          this.vehicleNo = this.DocketDetails?.vEHNO;
          this.contractForm.controls["totalChargedNoOfpkg"].setValue(this.DocketDetails?.pKGS || "");
          this.contractForm.controls["actualwt"].setValue(this.DocketDetails?.aCTWT || "");
          this.contractForm.controls["chrgwt"].setValue(this.DocketDetails?.cHRWT || "");
          this.tabForm.controls["docketNumber"].setValue(this.DocketDetails?.dKTNO || "");
          this.tabForm.controls["docketDate"].setValue(this.DocketDetails?.dKTDT || "");
          const billingParties={
            name:this.DocketDetails?.bPARTYNM||"",
            value:this.DocketDetails?.bPARTY||""
          }
          this.tabForm.controls["billingParty"].setValue(billingParties);
          const fCity={
            name:this.DocketDetails?.fCT||"",
            value:this.DocketDetails?.fCT||""
          }
          this.tabForm.controls["fromCity"].setValue(fCity);
          const tCity={
            name:this.DocketDetails?.tCT||"",
            value:this.DocketDetails?.tCT||""
          }
          this.tabForm.controls["toCity"].setValue(tCity);
          const destionation={
            name:this.DocketDetails?.dEST||"",
            value:this.DocketDetails?.dEST||""
          }
          this.contractForm.controls["destination"].setValue(destionation);
          this.tableData[0].NO_PKGS = this.DocketDetails?.pKGS || "";
          this.tableData[0].ACT_WT = this.DocketDetails?.aCTWT || "";
        }    
    //this.getCity();
    //this.customerDetails();
    //this.destionationDropDown();

  }
  // Load temporary data
  loadTempData() {
    this.tableData = [
      {
        documentType: [], // Array to store document types
        srNo: 0, // Serial number
        INVNO: "", // Invoice number
        INVDT: "", // Invoice date
        LENGTH: "", // Length
        BREADTH: "", // Breadth
        HEIGHT: "", // Height
        DECLVAL: "", // Declaration value
        NO_PKGS: "", // Number of packages
        CUB_WT: "", // Cubic weight
        ACT_WT: "", // Actual weight
        Invoice_Product: "", // Invoice product
        HSN_CODE: "", // HSN code
      },
    ];
  }
  // Add a new item to the table
  addItem() {
    const AddObj = {
      documentType: [], // Array to store document types
      srNo: 0, // Serial number
      INVNO: "", // Invoice number
      INVDT: "", // Invoice date
      LENGTH: "", // Length
      BREADTH: "", // Breadth
      HEIGHT: "", // Height
      DECLVAL: "", // Declaration value
      NO_PKGS: "", // Number of packages
      CUB_WT: "", // Cubic weight
      ACT_WT: "", // Actual weight
      Invoice_Product: "", // Invoice product
      HSN_CODE: "", // HSN code
    };
    this.tableData.splice(0, 0, AddObj); // Insert the new object at the beginning of the tableData array
  }

  // Display appointment
  displayAppointment($event) {
    const generateControl = $event.eventArgs.value === "Y"; // Check if value is "Y" to generate control
    this.appointmentControlArray.forEach((data) => {
      if (data.name !== "appoint") {
        data.generatecontrol = generateControl; // Set generatecontrol property based on the generateControl value
      }
    });
  }

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
    mapControlArray(this.docketControlArray, docketMappings); // Map docket control array
    mapControlArray(this.consignorControlArray, consignorMappings); // Map consignor control array
    mapControlArray(this.consigneeControlArray, consigneeMappings); // Map consignee control array
    mapControlArray(this.contractControlArray, destinationMapping);
  }
  //End
  //destionation
  //destionation
     /*here i  created a Function for the destination*/
  async destionationDropDown() {
    if (this.contractForm.controls.destination.value.length > 2) {
      const destinationMapping = await this.locationService.locationFromApi({
        locCode: { 'D$regex': `^${this.contractForm.controls.destination.value}`, 'D$options': 'i' },
      });
      this.filter.Filter(
        this.contractControlArray,
        this.contractForm,
        destinationMapping,
        this.destination,
        this.destinationStatus
      );
    }
  }
  /*End*/
  async saveData() {
    // Remove all form errors
    const tabcontrols = this.tabForm;
    clearValidatorsAndValidate(tabcontrols);
    const contractcontrols = this.contractForm;
    clearValidatorsAndValidate(contractcontrols);
    /*End*/
    const controlNames = ["svcType", "payType", "rskty", "pkgs", "trn"];
    controlNames.forEach((controlName) => {
      if (Array.isArray(this.contractForm.value[controlName])) {
        this.contractForm.controls[controlName].setValue("");
      }
    });
    let invoiceDetails = {
      invoiceDetails: this.tableData,
    };

    let dockDetails = {
        ...this.tabForm.value,
        ...this.contractForm.value,
        ...invoiceDetails,
      };
      dockDetails['payTypeName']=this.paymentType.find((x)=>x.value==dockDetails['payType'])?.name||'';
      dockDetails['rsktyName']=this.riskType.find((x)=>x.value==dockDetails['rskty'])?.name||'';
      dockDetails['pkgsTypeName']=this.pkgsType.find((x)=>x.value==dockDetails['pkgsType'])?.name||'';
      dockDetails['svcTypeName']=this.svcType.find((x)=>x.value==dockDetails['svcType'])?.name||'';
      dockDetails['tranTypeName']=this.tranType.find((x)=>x.value==dockDetails['tranType'])?.name||'';
      dockDetails['vehNo']= this.vehicleNo?this.vehicleNo:"";
     const res=await this.docketService.docketLTLFieldMapping(dockDetails,this.quickDocket);
     let docketDetails={}
     docketDetails=res?.docketsDetails||{};
     docketDetails['invoiceDetails']=res?.invoiceDetails||[];
     
    //here the function is calling for add docket Data in docket Tracking.
    if (this.quickDocket) {
      delete docketDetails['_id'];
      delete docketDetails['invoiceDetails'];
      //await addTracking(this.companyCode, this.operationService, docketDetails)
      let reqBody = {
        companyCode: this.companyCode,
        collectionName: "dockets_ltl",
        filter: { docNo: this.tabForm.controls["docketNumber"].value },
        update: {
          ...res?.docketsDetails,
        },
      };
      const resUpdate= await firstValueFrom(this.operationService.operationMongoPut("generic/update", reqBody));
      await this.docketService.operationsFieldMapping(res.docketsDetails,res.invoiceDetails);
      if(resUpdate){
        this.Addseries();
      }
    } else {
      let reqBody = {
        companyCode: this.storage.companyCode,
        collectionName: "dockets_ltl",
        docType: "CN",
        branch: this.storage.branch,
        finYear: financialYear,
        data: docketDetails,
        party: docketDetails["bPARTYNM"],
      };
      const res= await firstValueFrom(this.operationService.operationMongoPost("operation/docket/ltl/create", reqBody));
      if(res.data){
        this.tabForm.controls["docketNumber"].setValue(res.data);
        await this.Addseries();
      }
    }
  }
  async Addseries() {
    try {
      // Generate the array with required data.
      const resultArray = await this.generateArray(
        this.companyCode,
        this.tabForm.controls["docketNumber"].value,
        this.contractForm.controls["totalChargedNoOfpkg"].value
      );
  
      // Prepare the request body.
      const reqBody = {
        companyCode: this.companyCode,
        collectionName: "docket_pkgs_ltl",
        data: resultArray
      }
      // Make the POST request and wait for the response.
      const res = await firstValueFrom(this.operationService.operationMongoPost("generic/create", reqBody));
  
      // Check if response is successful.
      if (res) {
        // Display success message.
        const result = await Swal.fire({
          icon: "success",
          title: "Booked Successfully",
          text: "DocketNo: " + this.tabForm.controls["docketNumber"].value,
          showConfirmButton: true,
        });
  
        // Redirect after confirmation.
        if (result.isConfirmed) {
          this._NavigationService.navigateTotab('DocketStock', "dashboard/Index");
        }
        else{
          this._NavigationService.navigateTotab('DocketStock', "dashboard/Index");
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to Book",
        text: "An error occurred: " + error.message,
      });
    }
  }
  
  async generateArray(companyCode, dockno, pkg) {
    return new Promise((resolve, reject) => {
      const array = Array.from({ length: pkg }, (_, index) => {
        const serialNo = (index + 1).toString().padStart(4, "0");
        const bcSerialNo = `${dockno}-${serialNo}`;
        const bcDockSf = "0";
        return {
          _id:`${companyCode}-${bcSerialNo}`,
          cID: companyCode,
          dKTNO: dockno,
          pKGSNO: bcSerialNo,
          sFX: bcDockSf,
          lOC:this.storage.branch,
          cLOC:this.storage.branch,
          eNTBY:this.storage.userName,
          eNTLOC:this.storage.branch,
          eNTDT:new Date()
        };
      });

      resolve(array);
    });
  }

  async delete(event) {
    const index = event.index;
    const row = event.element;

    const swalWithBootstrapButtons = await Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success msr-2",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `<h4><strong>Are you sure you want to delete ?</strong></h4>`,
        // color: "#03a9f3",
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        showLoaderOnConfirm: true,
        preConfirm: (Remarks) => {
          var Request = {
            CompanyCode: localStorage.getItem("CompanyCode"),
            ID: row.id,
          };
          if (row.id == 0) {
            return {
              isSuccess: true,
              message: "City has been deleted !",
            };
          } else {
            console.log("Request", Request);
            //return this.VendorContractService.updateMileStoneRequest(Request);
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.tableData.splice(index, 1);
          this.tableData = this.tableData;
          swalWithBootstrapButtons.fire("Deleted!", "Your Message", "success");
          event.callback(true);
        } else if (result.isConfirmed) {
          swalWithBootstrapButtons.fire("Not Deleted!", "Your Message", "info");
          event.callback(false);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your item is safe :)",
            "error"
          );
          event.callback(false);
        }
      });

    return true;
  }

  calculateInvoiceTotal() {
    calculateInvoiceTotalCommon(this.tableData, this.contractForm);
  }
}
