import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
import { ConsignmentControl, FreightControl } from "src/assets/FormControls/consignment-control";
import Swal from "sweetalert2";
import { containerFromApi, customerFromApi, locationFromApi } from "../prq-entry-page/prq-utitlity";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { getCity } from "../quick-booking/quick-utility";
import { FilterUtils } from "src/app/Utility/Form Utilities/dropdownFilter";
import { getVendorDetails } from "../job-entry-page/job-entry-utility";
import { Router } from "@angular/router";
import { clearValidatorsAndValidate } from "src/app/Utility/Form Utilities/remove-validation";
import { OperationService } from "src/app/core/service/operations/operation.service";
import { pendingbilling } from "../pending-billing/pending-billing-utlity";


@Component({
  selector: "app-consignment-entry-form",
  templateUrl: "./consignment-entry-form.component.html",
})

export class ConsignmentEntryFormComponent implements OnInit {

  consignmentTableForm: UntypedFormGroup;
  FreightTableForm: UntypedFormGroup;
  tableData: any;
  tableData1: any;
  isTableLoad: boolean = true;
  jsonControlArray: any;
  TableStyle = "width:82%;"
  // TableStyle1 = "width:82%"
  ConsignmentFormControls: ConsignmentControl;
  FreightFromControl: FreightControl;
  breadscrums = [
    {
      title: "ConsignmentEntryForm",
      items: ["Operation"],
      active: "ConsignmentEntryForm",
    },
  ];
  actionObject = {
    addRow: true,
    submit: false,
    search: true,
  };
  fromCity: string;
  fromCityStatus: any;
  customer: string;
  customerStatus: any;
  toCity: string;
  toCityStatus: any;
  containerSize: string;
  containerSizeStatus: boolean;
  consignorName: string;
  consignorNameStatus: boolean;
  consigneeName: string;
  consigneeNameStatus: boolean;
  vendorName: string;
  vendorNameStatus: boolean;
  prqNo:string;
  prqNoStatus:boolean;
  userName = localStorage.getItem("Username");
  //#region columnHeader
  columnHeader = {
    containerNumber: "Container Number",
    containerType: "Container Type",
    containerCapacity: "Container Capacity",
    actions: "Actions",
  };
  //#endregion

  //#region columnHeader1
  columnHeader1 = {
    ewayBillNo: "Eway Bill No",
    expiryDate: "Expiry Date",
    invoiceNo: "Invoice No",
    invoiceAmount: "Invoice Amount",
    noofPkts: "No of Pkts",
    materialName: "Material Name",
    actualWeight: "Actual Weight",
    chargedWeight: "Charged Weight",
    actions: "Actions",
  };
  //#endregion

  //#region displayedColumns1
  displayedColumns1 = {
    containerNumber: {
      name: "Container Number",
      key: "inputString",
      Style: "",
      HeaderStyle: "",
    },
    containerType: {
      name: "Container Type",
      key: "Dropdown",
      option: [
        { name: "Incoming Invoice", value: "Incoming Invoice" },
        { name: "Goods Movement", value: "Goods Movement" },
        { name: "CFS Charges", value: "CFS Charges" },
      ],
      Style: "",
      HeaderStyle: "",
    },
    containerCapacity: {
      name: "Container Capacity",
      key: "inputString",
      Style: "",
    },
    action: {
      name: "Action",
      key: "Action",
      Style: "",
      HeaderStyle: "",
    },
  };
  //#endregion

  //#region displayedColumns2
  displayedColumns2 = {
    ewayBillNo: {
      name: "Eway Bill No",
      key: "inputString",
      Style: "",
      HeaderStyle: { "text-align": "center" },
    },
    expiryDate: {
      name: "Expiry Date",
      key: "date",
      additionalData: {
        minDate: new Date(),
      },
      style: "",
      HeaderStyle: { "text-align": "center" },
    },
    invoiceNo: {
      name: "Invoice No",
      key: "inputString",
      Style: "",
      HeaderStyle: { "text-align": "center" },
    },
    invoiceAmount: {
      name: "Invoice Amount",
      key: "inputString",
      Style: "",
      HeaderStyle: { "text-align": "center" },
    },
    noofPkts: {
      name: "No of Pkts",
      key: "inputString",
      Style: "",
      HeaderStyle: { "text-align": "center" },
    },
    materialName: {
      name: "Material Name",
      key: "inputString",
      Style: "",
      HeaderStyle: { "text-align": "center" },
    },
    actualWeight: {
      name: "Actual Weight",
      key: "inputString",
      Style: "",
      HeaderStyle: { "text-align": "center" },
    },
    chargedWeight: {
      name: "Charged Weight",
      key: "inputString",
      Style: "",
      HeaderStyle: { "text-align": "center" },
    },
    action: {
      name: "Action",
      key: "Action",
      Style: "",
      HeaderStyle: { "text-align": "center" },
    },
  };
  jsonControlArrayBasic: any;
  companyCode = parseInt(localStorage.getItem("companyCode"));
  prqFlag: boolean;
  prqData: any;
  billingParty: any;
  prqNoDetail: any[];
  //#endregion

  constructor(
    private fb: UntypedFormBuilder,
    private _NavigationService: NavigationService,
    private masterService: MasterService,
    private filter: FilterUtils,
    private route: Router,
    private operationService: OperationService,
  ) {

    const navigationState = this.route.getCurrentNavigation()?.extras?.state?.data;
    if (navigationState != null) {

      this.prqData = navigationState
      this.prqFlag = true;
    }
    this.initializeFormControl();
    this.loadTempData();
  }

  ngOnInit(): void {
    this.bindDataFromDropdown();
    this.isTableLoad = false;
  }
  //#region initializeFormControl
  initializeFormControl() {
    // Create LocationFormControls instance to get form controls for different sections
    this.ConsignmentFormControls = new ConsignmentControl();
    this.FreightFromControl = new FreightControl();

    // Get form controls for Driver Details section
    this.jsonControlArrayBasic = this.ConsignmentFormControls.getConsignmentControlControls();

    this.jsonControlArray = this.FreightFromControl.getFreightControlControls();


    // Build the form group using formGroupBuilder function and the values of accordionData
    this.consignmentTableForm = formGroupBuilder(this.fb, [
      this.jsonControlArrayBasic,
    ]);
    this.FreightTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.commonDropDownMapping();
  }
  //#endregion

  //#region Load temporary data
  loadTempData() {
    this.tableData = [
      {
        documentType: [], // Array to store document types
        containerNumber: "", // Invoice number
        containerType: "", // Invoice date
        containerCapacity: "", // Length
      },
    ];
    this.tableData1 = [
      {
        ewayBillNo: "",
        expiryDate: "",
        invoiceNo: "",
        invoiceAmount: 0,
        noofPkts: 0,
        materialName: "",
        actualWeight: 0,
        chargedWeight: 0
      }


    ];
  }
  //#endregion

  //#region Add a new item to the table
  addItem() {
    const AddObj = {
      documentType: [], // Array to store document types
      containerNumber: "", // Invoice number
      containerType: "", // Invoice date
      containerCapacity: "", // Length
    };
    this.tableData.splice(0, 0, AddObj); // Insert the new object at the beginning of the tableData array
  }
  //#endregion

  //#region  Add a new item to the table
  AddItem() {
    const AddObj = {
      documentType: [], // Array to store document types
      containerNumber: "", // Invoice number
      containerType: "", // Invoice date
      containerCapacity: "", // Length
    };
    this.tableData1.splice(0, 0, AddObj); // Insert the new object at the beginning of the tableData array
  }
  //#endregion

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

  //#region delete function
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
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.tableData.splice(index, 1);
          this.tableData1.splice(index, 1);
          this.tableData = this.tableData;
          this.tableData1 = this.tableData1;
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
  //#endregion
  prqDetail() {
    const fromCity = {
      name: this.prqData?.fromCity || "",
      value: this.prqData?.fromCity || ""
    }
    const toCity = {
      name: this.prqData?.toCity || "",
      value: this.prqData?.toCity || ""
    }
    const billingParty = this.billingParty.find((x) => x.name === this.prqData?.billingParty);
    this.consignmentTableForm.controls['billingParty'].setValue(billingParty);
    this.consignmentTableForm.controls['fromCity'].setValue(fromCity);
    this.consignmentTableForm.controls['toCity'].setValue(toCity);
    this.consignmentTableForm.controls['payType'].setValue(this.prqData?.payType);
    this.consignmentTableForm.controls['docketDate'].setValue(this.prqData?.pickupDate);
    this.consignmentTableForm.controls['transMode'].setValue(this.prqData?.transMode);
    this.consignmentTableForm.controls['pAddress'].setValue(this.prqData?.pAddress);
    this.consignmentTableForm.controls['containerSize'].setValue(this.prqData?.containerSize);

  }
  async bindDataFromDropdown() {
    const resCust = await customerFromApi(this.masterService);
    this.billingParty = resCust;
    const cityDetail = await getCity(this.companyCode, this.masterService);
    const resContainer = await containerFromApi(this.masterService);
    const vendorDetail = await getVendorDetails(this.masterService);
    const prqNo= await pendingbilling(this.masterService);
    this.prqNoDetail=prqNo;
    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      cityDetail,
      this.fromCity,
      this.fromCityStatus
    );
    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      resCust,
      this.customer,
      this.customerStatus
    );
    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      cityDetail,
      this.toCity,
      this.toCityStatus
    );
    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      resContainer,
      this.containerSize,
      this.containerSizeStatus
    );

    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      resCust,
      this.consignorName,
      this.consignorNameStatus
    );

    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      resCust,
      this.consigneeName,
      this.consigneeNameStatus
    );
    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      vendorDetail,
      this.vendorName,
      this.vendorNameStatus
    );
    this.filter.Filter(
      this.jsonControlArrayBasic,
      this.consignmentTableForm,
      prqNo.map((x)=>{return {name:x.prqNo,value:x.prqNo}}),
      this.prqNo,
      this.prqNoStatus
    );
    this.prqDetail();
  }
  //#region Save Function
  save() {
    // Remove all form errors
    const tabcontrols = this.consignmentTableForm;
    clearValidatorsAndValidate(tabcontrols);
    const contractcontrols = this.consignmentTableForm;
    clearValidatorsAndValidate(contractcontrols);
    /*End*/
    const dynamicValue = localStorage.getItem("Branch"); // Replace with your dynamic value
    const controlNames = ["containerSize", "transMode", "payType", "vendorType"];
    controlNames.forEach((controlName) => {
      if (Array.isArray(this.consignmentTableForm.value[controlName])) {
        this.consignmentTableForm.controls[controlName].setValue("");
      }
    });
    let invoiceDetails = {
      invoiceDetails: this.tableData1,
    };
    let containerDetail = {
      containerDetail: this.tableData,
    };
    const controltabNames = [
      "containerCapacity",
      "containerSize1",
      "containerSize2",
      "containerType",
    ];
    controltabNames.forEach((controlName) => {
      if (Array.isArray(this.consignmentTableForm.value[controlName])) {
        this.consignmentTableForm.controls[controlName].setValue("");
      }
    });
    this.consignmentTableForm.controls["fromCity"].setValue(
      this.consignmentTableForm.value.fromCity?.name || ""
    );
    this.consignmentTableForm.controls["containerSize"].setValue(
      this.consignmentTableForm.value.containerSize?.name || ""
    );
    this.consignmentTableForm.controls["vendorName"].setValue(
      this.consignmentTableForm.value.vendorName?.name || ""
    );
    this.consignmentTableForm.controls["toCity"].setValue(
      this.consignmentTableForm.value.toCity?.name || ""
    );
    this.consignmentTableForm.controls["billingParty"].setValue(
      this.consignmentTableForm.value?.billingParty.name || ""
    );
    this.consignmentTableForm.controls["consignorName"].setValue(
      this.consignmentTableForm.value?.consignorName.name || ""
    );
    this.consignmentTableForm.controls["consigneeName"].setValue(
      this.consignmentTableForm.value?.consigneeName.name || ""
    );
    const dynamicNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
    const paddedNumber = dynamicNumber.toString().padStart(4, "0");
    const dockNo = `CN${dynamicValue}${paddedNumber}`;
    this.consignmentTableForm.controls["docketNumber"].setValue(dockNo);
    let id = {
     _id:dockNo ,
      isComplete: 1,
      unloading: 0,
      lsNo: "",
      mfNo: "",
      entryBy: this.userName,
      entryDate: new Date().toISOString(),
      unloadloc: ""
    };
    let docketDetails = {
      ...this.consignmentTableForm.value,
      ...this.FreightTableForm.value,
      ...invoiceDetails,
      ...containerDetail,
      ...id,
    };
    let reqBody = {
      companyCode: this.companyCode,
      collectionName: "docket_temp",
      data: docketDetails,
    };
    this.operationService.operationMongoPost("generic/create", reqBody).subscribe({
      next: (res: any) => {
        Swal.fire({
          icon: "success",
          title: "Booked Successfully",
          text: "DocketNo: " + this.consignmentTableForm.controls["docketNumber"].value,
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            // Redirect to the desired page after the success message is confirmed.
            this._NavigationService.navigateTotab(
              'PRQ',
              "dashboard/GlobeDashboardPage"
            );
          }
        });
      },
    });
  }
    //here the function is calling for add docket Data in docket Tracking.

  //#region cancel Function
  cancel() {
    this._NavigationService.navigateTotab(
      "docket",
      "dashboard/GlobeDashboardPage"
    );
  }
  //#endregion
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
      { name: "containerSize", target: "containerSize" },
      { name: "consignorName", target: "consignorName" },
      { name: "consigneeName", target: "consigneeName" },
      { name: "vendorName", target: "vendorName" },
      { name: "prqNo", target: "prqNo" }
    ];
    mapControlArray(this.jsonControlArrayBasic, docketMappings); // Map docket control array
    // mapControlArray(this.consignorControlArray, consignorMappings); // Map consignor control array
    // mapControlArray(this.consigneeControlArray, consigneeMappings); // Map consignee control array
    //mapControlArray(this.contractControlArray, destinationMapping);
  }
  onAutoBillingBased(event) {
    if (event.eventArgs.checked) {

      const billingParty = this.consignmentTableForm.controls['billingParty'].value;
      this.consignmentTableForm.controls['ccontactNumber'].setValue(this.prqData?.contactNo || "");
      this.consignmentTableForm.controls['cncontactNumber'].setValue(this.prqData?.contactNo || "");
      this.consignmentTableForm.controls['consignorName'].setValue(billingParty);
      this.consignmentTableForm.controls['consigneeName'].setValue(billingParty);
    }
    else {
      this.consignmentTableForm.controls['ccontactNumber'].setValue("");
      this.consignmentTableForm.controls['cncontactNumber'].setValue("");
      this.consignmentTableForm.controls['consignorName'].setValue("");
      this.consignmentTableForm.controls['consigneeName'].setValue("");
    }
  }
  prqSelection(){
   this.prqData= this.prqNoDetail.find((x)=>x.prqId===this.consignmentTableForm.controls['prqNo'].value.value);
   this.prqDetail()
  }
}
