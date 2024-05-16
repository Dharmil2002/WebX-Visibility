import { Component, OnInit } from "@angular/core";
import { debitNoteGenerationControls } from 'src/assets/FormControls/debitnote-entry';
import { ConsignmentqueryControls } from "src/assets/FormControls/consignment-query";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { UntypedFormBuilder } from "@angular/forms";
import moment from "moment";
import { Router } from "@angular/router";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";
import { StorageService } from "src/app/core/service/storage.service";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { log } from "console";


@Component({
  selector: 'app-generate-debit-note',
  templateUrl: './generate-debit-note.component.html',

})
export class GenerateDebitNoteComponent implements OnInit {
  breadscrums = [
    {
      title: "",
      items: [""],
      active: "",
    },
  ];
  backPath: string;
  DebitNoteJson: any;
  DebitNoteForm: any;
  vendorDataResponse: any;
  DateResponse: any;

  DocTypeStatus: any;
  DocTypeCode: any;
  DocCalledAs: any;
  hsnDataResponse: any;
  InvoiceNumberCode: string;
  InvoiceNumberCodeStatus: boolean;
  vendorDataResponse1: any;

  constructor(
    private fb: UntypedFormBuilder,
    private Route: Router,
    private filter: FilterUtils,
    private controlPanel: ControlPanelService,
    private masterService: MasterService,
    private storage: StorageService,
  ) {
    this.DocCalledAs = this.controlPanel.DocCalledAs;
    this.breadscrums = [
      {
        title: 'Select Vendor Bills',
        items: ["Finance"],
        active: 'Select Vendor Bills',
      }
    ]
  }

  ngOnInit(): void {
    this.initializeFormControl();
    this.backPath = "Finance/VendorPayment/Dashboard";
  }
  initializeFormControl() {
    const DebitNoteFormControls = new debitNoteGenerationControls();
    this.DebitNoteJson = DebitNoteFormControls.getGenerateDebitNote();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.DebitNoteForm = formGroupBuilder(this.fb, [this.DebitNoteJson,]);
    // this.bindDropdown();
    this.getVendorList();
    this.getinvoiceList();
    this.bindDropdown();
  }

  async getVendorList() {
    const Body = {
      companyCode: this.storage.companyCode,
      collectionName: "vendor_detail",
      filter: {}
    };

    this.vendorDataResponse = await firstValueFrom(this.masterService.masterPost("generic/get", Body));
    const vendorData = this.vendorDataResponse.data.map(x => ({ name: x.vendorName, value: x.vendorCode }));

    this.filter.Filter(
      this.DebitNoteJson,
      this.DebitNoteForm,
      vendorData,
      "VendorName",
      false
    );
  }

  async getinvoiceList() {
    const Body = {
      companyCode: this.storage.companyCode,
      collectionName: "vend_bill_summary",
      filter:  {
        'D$expr': {
          'D$and': [

            { 'D$gt': ['$bALPBAMT', 0] }
          ].filter(Boolean) // Remove undefined elements from the array
        }
      }
    };

    this.vendorDataResponse1 = await firstValueFrom(this.masterService.masterPost("generic/get", Body));
      const invoiceData = this.vendorDataResponse1.data.map(x => ({ name: x.docNo, value: x.docNo }));
      console.log(this.vendorDataResponse1);
    this.filter.Filter(
      this.DebitNoteJson,
      this.DebitNoteForm,
      invoiceData,
      "BillNo",
      false
    );
  }

 // On Customer Change DropDown Binding
 async PreparedforFieldChanged(event) {
  const Value = this.DebitNoteForm.value.VendorName.value
  // const Value = this.DebitNoteForm.value.VendorName.value

  const Body = {
    companyCode: this.storage.companyCode,
    collectionName: "vend_bill_summary",
    filter: {
      'D$expr': {
        'D$and': [
          // Check if Value is defined before checking cUST.cD
          Value !== undefined && { 'D$eq': ['$vND.cD', Value] },
          // Check if bALAMT is greater than 0
          // { 'D$gt': ['$bALPBAMT', 0] }
        ].filter(Boolean) // Remove undefined elements from the array
      }
    }
  };


  this.hsnDataResponse = await firstValueFrom(this.masterService.masterPost("generic/get", Body));
  const hsnData = this.hsnDataResponse.data.map(x => ({ name: x.docNo, value: x.docNo }));
  // Call the 'Filter' function with the filtered 'vendor' array and other parameters
  this.filter.Filter(
    this.DebitNoteJson,
    this.DebitNoteForm,
    hsnData,
    "BillNo",
    false
  );

}


   // Comman DropDown Binding
   async  bindDropdown() {
    this.DebitNoteJson.forEach((data) => {
      if (data.name === "BillNo") {
        // Set category-related variables
        this.InvoiceNumberCode = data.name;
        this.InvoiceNumberCodeStatus = data.additionalData.showNameAndValue;
      }
    });

  }

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  async save(event) {
    // const startDate = new Date(this.DebitNoteForm.controls.start.value);
    // const endDate = new Date(this.DebitNoteForm.controls.end.value);
    const billNO = this.DebitNoteForm.controls.BillNo.value;
    // const vendorcode = this.DebitNoteForm.controls.VendorName.value.value;
    // const vendorname = this.DebitNoteForm.controls.VendorName.value.name;

    this.Route.navigate(["Finance/DebitNote/DebitNoteDetails"],
     { state: { billNO:billNO } });

  }
  cancel() {
    this.ngOnInit();
  }

}
