import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { calculateTotalField } from 'src/app/operation/unbilled-prq/unbilled-utlity';
import { StateWiseSummaryControl } from 'src/assets/FormControls/state-wise-summary-control';
import { getApiCompanyDetail, getApiCustomerDetail } from './invoice-utility';
import Swal from 'sweetalert2';
import { InvoiceServiceService } from 'src/app/Utility/module/billing/InvoiceSummaryBill/invoice-service.service';
import { total } from 'src/app/Utility/commonFunction/arrayCommonFunction/arrayCommonFunction';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { StorageService } from 'src/app/core/service/storage.service';

@Component({
  selector: 'app-invoice-summary-bill',
  templateUrl: './invoice-summary-bill.component.html'
})
export class InvoiceSummaryBillComponent implements OnInit {

  breadScrums = [
    {
      title: "Invoice Summary Bill",
      items: ["Finance"],
      active: "Invoice Summary Bill",
    },
  ];
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  tableLoad: boolean = true;
  invoiceTableForm: UntypedFormGroup;
  invoiceSummaryTableForm: UntypedFormGroup;
  invoiceFormControls: StateWiseSummaryControl;
  jsonControlArray: any;
  KPICountData: { count: any; title: string; class: string }[];

  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  columnHeader = {
    checkBoxRequired: {
      Title: "",
      class: "matcolumncenter",
      Style: "max-width:100px",
    },
    stateName: {
      Title: "State Name",
      class: "matcolumncenter",
      Style: "",
    },
    cnoteCount: {
      Title: "Shipment Count",
      class: "matcolumncenter",
      Style: "",
    },
    countSelected: {
      Title: "Shipment Selected",
      class: "matcolumncenter",
      Style: "",
    },
    subTotalAmount: {
      Title: "Sub-total(₹)",
      class: "matcolumncenter",
      Style: "",
    },
    gstCharged: {
      Title: "GST(₹)",
      class: "matcolumncenter",
      Style: "",
    },
    totalBillingAmount: {
      Title: "Shipment Total(₹)",
      class: "matcolumncenter",
      Style: "",
    }
  };
  tableData = []
  staticField = ["stateName", "cnoteCount", "countSelected", "subTotalAmount", "gstCharged", "totalBillingAmount"];
  navigateExtra: any;
  prqNo: any;
  invoiceSummaryJsonArray: any;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private masterService: MasterService,
    private invoiceServiceService: InvoiceServiceService,
    private locationService: LocationService,
    private filter: FilterUtils,
    private storage: StorageService
  ) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {

      this.navigateExtra = this.router.getCurrentNavigation()?.extras?.state.data.columnData || "";
    }

    this.tableLoad = false;
    //#region fist table count

    //#endregion
  }

  ngOnInit(): void {
    this.initializeFormControl();
    //this.getPrqDetail();
    this.getLocation();

  }
  async getLocation() {
    const location = await this.locationService.locationFromApi();
    this.filter.Filter(this.jsonControlArray, this.invoiceTableForm, location, 'submissionOffice', true);
    this.filter.Filter(this.jsonControlArray, this.invoiceTableForm, location, 'collectionOffice', true);
    const findLoc = location.find((x) => x.value == this.storage.branch);
    this.invoiceTableForm.controls['submissionOffice'].setValue(findLoc);
    this.invoiceTableForm.controls['collectionOffice'].setValue(findLoc);
  }


  initializeFormControl() {
    this.invoiceFormControls = new StateWiseSummaryControl();
    this.jsonControlArray = this.invoiceFormControls.getstateWiseSummaryArrayControls();
    this.invoiceSummaryJsonArray = this.invoiceFormControls.getInvoiceSummaryArrayControls();
    this.invoiceTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.invoiceSummaryTableForm = formGroupBuilder(this.fb, [this.invoiceSummaryJsonArray])
    this.invoiceTableForm.controls['customerName'].setValue(this.navigateExtra.billingParty || "")
    this.invoiceTableForm.controls['unbilledAmount'].setValue(this.navigateExtra.sum || 0);
    this.getCustomerDetail();

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

  async save() {

    this.setControlValue(this.invoiceTableForm.controls['submissionOffice']);
    this.setControlValue(this.invoiceTableForm.controls['collectionOffice']);
    const shipments = this.tableData.filter((x) => x.isSelected);
    this.invoiceTableForm.controls['billingAmount'].setValue(this.invoiceTableForm.controls['unbilledAmount'].value);
    const addRes = await this.invoiceServiceService.addBillDetails(this.invoiceTableForm.value, shipments);
    if (addRes) {
      //const update = await UpdateDetail(this.masterService, this.invoiceTableForm.value);
      Swal.fire({
        icon: "success",
        title: "Successfully Generated",
        text: `Invoice Successfully Generated Invoice number is ${addRes}`,
        showConfirmButton: true,
      });
      this.cancel('Billing​');
    }

  }
  cancel(tabIndex: string): void {
    this.router.navigate(['/dashboard/Index'], { queryParams: { tab: tabIndex }, state: [] });
  }
  /*Below function is for the bind the dropdown value*/
  setControlValue(control: AbstractControl): void {
    control.setValue(control.value?.value ?? "");
  }
  async getCustomerDetail() {

    const custDetail = await getApiCustomerDetail(this.masterService, this.navigateExtra);
    const tranDetail = await getApiCompanyDetail(this.masterService);
    this.invoiceTableForm.controls['cGstin'].setValue(custDetail?.data[0].GSTdetails[0].gstNo || "");
    this.invoiceTableForm.controls['cState'].setValue(custDetail?.data[0].state || "");
    this.invoiceTableForm.controls['tState'].setValue(tranDetail?.data[0].state || "");
    this.invoiceTableForm.controls['tGstin'].setValue(tranDetail?.data[0].gstNo || "");
    // Check if custDetail and tranDetail have data
    // Helper function to get lowercase state from detail object
    const getLowercaseState = (detail) => detail?.data?.[0]?.state.toLowerCase();
    // Extract lowercase states from custDetail and tranDetail
    const custState = getLowercaseState(custDetail);
    const tranState = getLowercaseState(tranDetail);
    // Set 'gstType' value based on the equality of lowercase states
    this.invoiceTableForm.controls['gstType'].setValue(custState === tranState ? 'SGST' : 'IGST');
    // const prqDetail = await getPrqApiDetail(this.masterService, this.navigateExtra.columnData.billingparty);
    const invoice = await this.invoiceServiceService.getInvoice(this.navigateExtra.dKTNO);
    const shipments = await this.invoiceServiceService.filterShipment(invoice);
    const invoiceDetail = await this.invoiceServiceService.getInvoiceDetail(shipments);
    this.tableData = invoiceDetail;
    this.getGstCharged();
    const cnoteCount = await total(invoiceDetail, 'cnoteCount');
    this.invoiceSummaryTableForm.controls['shipmentCount'].setValue(cnoteCount);
    const shipmentTot = await total(invoiceDetail, 'totalBillingAmount');
    this.invoiceSummaryTableForm.controls['shipmentTotal'].setValue(shipmentTot);
    const gstType = custState === tranState ? 'SGST' : 'IGST';
    this.invoiceSummaryTableForm.controls['IGST'].setValue(gstType == "IGST" ? shipmentTot : 0);
    this.invoiceSummaryTableForm.controls['SGST'].setValue(gstType == "SGST" ? parseFloat(shipmentTot) / 2 : 0);

    //this.invoiceSummaryTableForm.controls['shipmentTotal'].setValue(custState === tranState ? shipmentTot : parseFloat(shipmentTot)/2);


  }
  getCalucationDetails($event) {
    const invoice = $event ? $event : "";
    const cnoteCount = this.tableData.length;
    const countSelected = invoice ? invoice.length : 0;
    const subTotalAmount = invoice ? calculateTotalField(invoice, 'subTotalAmount') : 0;
    const gstCharged = invoice ? calculateTotalField(invoice, 'gstCharged') : 0;
    const totalBillingAmount = invoice ? calculateTotalField(invoice, 'totalBillingAmount') : 0;
    //#endregion

    //#region fist table KPICountData
    this.KPICountData = [
      {
        count: cnoteCount,
        title: "Total Cnote Count",
        class: `color-Grape-light`,
      },
      {
        count: countSelected,
        title: "Total Count Selected",
        class: `color-Bottle-light`,
      },
      {
        count: subTotalAmount,
        title: "Sub Total Amount",
        class: `color-Daisy-light`,
      },
      {
        count: gstCharged,
        title: "Total GST Charged",
        class: `color-Success-light`,
      },
      {
        count: totalBillingAmount,
        title: "Total Billing Amount",
        class: `color-Grape-light`,
      },
    ]
  }
  /*here i write code for the calulcate the gst */
  getGstCharged() {
    debugger;
    const gstRateString = this.invoiceTableForm.controls['gstRate'].value;
    // Extract numeric value from the string (assuming it's always a valid percentage string)
    const gstRate = parseFloat(gstRateString.replace('%', '')) / 100;
    const result = this.tableData.map((item) => {
      item.gstCharged = (item.gstCharged * (1 + gstRate)).toFixed(2);
      item.totalBillingAmount= parseFloat(item.subTotalAmount) + parseFloat(item.gstCharged)
      return item;
    });
    this.tableData = result;
  }

  /*End */
}
