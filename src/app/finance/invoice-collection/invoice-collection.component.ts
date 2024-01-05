import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { InvoiceCollectionControl } from 'src/assets/FormControls/Finance/InvoiceCollection/invoice-collection-control';
import { DeductionChargesComponent } from './deduction-charges/deduction-charges.component';
import { AutoComplete } from 'src/app/Models/drop-down/dropdown';
import { setGeneralMasterData } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice-collection',
  templateUrl: './invoice-collection.component.html',
})
export class InvoiceCollectionComponent implements OnInit {
  backPath: string;
  breadScrums = [
    {
      title: "Customer and GST Details",
      items: ["InvoiceCollection"],
      active: "Customer and GST Details",
    },
  ];
  height = '100vw';
  width = '100vw';
  maxWidth: '232vw'
  CustomerGSTTableForm: UntypedFormGroup;
  CollectionSummaryTableForm: UntypedFormGroup;
  jsonControlArray: any;
  CollectionSummaryjsonControlArray: any;
  invocieCollectionFormControls: InvoiceCollectionControl;
  tableLoad: boolean = true;
  tableData = [];
  menuItems = [];
  linkArray = [{ Row: 'deductions', Path: '', componentDetails: DeductionChargesComponent }];
  menuItemflag = true;
  addFlag = true;

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };

  InvoiceDetailscolumnHeader = {
    checkBoxRequired: {
      Title: "",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    bILLNO: {
      Title: "Invoice number",
      class: "matcolumnfirst",
      Style: "min-width:200px",
    },
    bGNDT: {
      Title: "Invoice date",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    bDUEDT: {
      Title: "Due date",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    aMT: {
      Title: "Invoice Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    collected: {
      Title: "Collected(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    deductions: {
      Title: "Deductions(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    collectionAmount: {
      Title: "Collection Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    pendingAmount: {
      Title: "Pending Amount(₹)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    }
  };
  staticField = [
    "bILLNO",
    "bGNDT",
    "bDUEDT",
    "aMT",
    "collected",
    "collectionAmount",
    "pendingAmount",
  ];
  invoiceDetail: any;
  metaData = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private invoiceService: InvoiceServiceService,
    private generalService: GeneralService,
    private storage: StorageService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
     
      this.invoiceDetail = this.router.getCurrentNavigation()?.extras?.state.data.columnData;
      if(this.invoiceDetail.pendCol==0){
        this.alertForTheZeroAmt()
      }
    }
    this.backPath = "/dashboard/Index?tab=Management​";

    this.initializeFormControl();
  }
  alertForTheZeroAmt() {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'No invoice available for collection',
      timer: 2000,
      showCancelButton: false,
      showConfirmButton: false
    });
    this.tab('Management​');
  }

  ngOnInit(): void {
    this.getBilligDetails();
  }

  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call

    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  initializeFormControl() {
    this.invocieCollectionFormControls = new InvoiceCollectionControl();
    this.jsonControlArray = this.invocieCollectionFormControls.getCustomerGSTArrayControls();
    this.CollectionSummaryjsonControlArray = this.invocieCollectionFormControls.getCollectionSummaryArrayControls();
    this.CustomerGSTTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.CollectionSummaryTableForm = formGroupBuilder(this.fb, [this.CollectionSummaryjsonControlArray]);
    this.CustomerGSTTableForm.controls['customer'].setValue(this.invoiceDetail?.billingParty || "");

  }
  async getBilligDetails() {
    const result = await this.invoiceService.getCollectionInvoiceDetails(this.invoiceDetail?.bILLNO || "");
    this.tableData = result;
    this.tableLoad = false;
    this.getDropdown()
  }
  async getDropdown() {
    const mode: AutoComplete[] = await this.generalService.getDataForAutoComplete("General_master", {codeType: "ACT" }, "codeDesc", "codeId");
    const bank: AutoComplete[] = await this.generalService.getDataForAutoComplete("General_master", {codeType: "BNK" }, "codeDesc", "codeId");
    setGeneralMasterData(this.CollectionSummaryjsonControlArray, mode, "collectionMode");
    setGeneralMasterData(this.CollectionSummaryjsonControlArray, bank, "bank");
  }
  cancel() {
    this.tab('Management​');
  }
  tab(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
  async save() {
    const data=await this.invoiceService.getCollectionJson(this.CollectionSummaryTableForm.value,this.tableData);
    const res=await this.invoiceService.saveCollection(data);
    if(res){
      const MRNo = res.ops[0].mRNO; // Add this line to get MRNo
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: `Invoice collection saved successfully. MRNo: ${MRNo}`,
        timer: 2000,
        showCancelButton: false,
        showConfirmButton: true, // Add this line to show the "OK" button
        confirmButtonText: 'OK' // Add this line to set the text of the "OK" button
      }).then(() => {
        this.tab('Management​');
      });
    }
  }
  getCalucationDetails(event){
    const total = event.reduce((accumulator, eventItem) => {
      if (eventItem.isSelected) {
        return accumulator + eventItem.collectionAmount;
      } else {
        return 0;
      }
    }, 0);
    this.CollectionSummaryTableForm.controls['collectionTotal'].setValue(Math.abs(total));

  }
  close(event){
    
    this.tableData.map((x)=>{
      if(x.bILLNO==event.billNO){
        x.deductions = event?.netDeduction?parseFloat(event?.netDeduction).toFixed(2) : parseFloat(event?.tds).toFixed(2) || 0.00;
        x.collectionAmount = (parseFloat(x?.aMT || 0.00) - parseFloat(x?.deductions || 0.00)).toFixed(2);
      }
    })
  }
}
