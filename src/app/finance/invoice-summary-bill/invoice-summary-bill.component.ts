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
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { StorageService } from 'src/app/core/service/storage.service';
import { ShipmentSelectionComponent } from './shipment-selection/shipment-selection.component';
import { StateService } from 'src/app/Utility/module/masters/state/state.service';

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
  linkArray = [
    { Row: 'countSelected', Path: '', componentDetails: ShipmentSelectionComponent, title: { "shipment": "TotalDkt" } },
  ]
  tableLoad: boolean = true;
  invoiceTableForm: UntypedFormGroup;
  invoiceSummaryTableForm: UntypedFormGroup;
  invoiceFormControls: StateWiseSummaryControl;
  jsonControlArray: any;
  KPICountData: { count: any; title: string; class: string }[];
  height = '100vw';
  width = '100vw';
  maxWidth: '232vw'
  backPath: string;
  ValidTotalAmount = false;
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
  staticField = ["stateName", "cnoteCount", "subTotalAmount", "gstCharged", "totalBillingAmount"];
  navigateExtra: any;
  prqNo: any;
  invoiceSummaryJsonArray: any;
  status: number;
  gstTypeValue: any;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,
    private masterService: MasterService,
    private invoiceServiceService: InvoiceServiceService,
    private locationService: LocationService,
    private stateService: StateService,
    private filter: FilterUtils,
    private storage: StorageService
  ) {
    this.backPath = "/dashboard/Index?tab=Billing​";
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.navigateExtra = this.router.getCurrentNavigation()?.extras?.state.data.columnData || "";
      this.status = this.router.getCurrentNavigation()?.extras?.state.data.title.status;
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

  /*here the function call when the user select a shipments*/
  dialogClosed($event) {
    if ($event) {
      this.tableData.map((x) => {
        if (x.stateName == $event.stateName) {
          x.extraData.map((y) => {
            const findShipment = $event.selectedData.find((z) => z.shipment == y.shipment);
            if (findShipment) {
              y.isSelected = true;
            }
            else {
              y.isSelected = false;
            }
            x.countSelected = x.extraData.filter((z) => z.isSelected).length;
          });
        }
      })
    }
    this.tableData.map((x) => {
      const extraData = x.extraData.filter((x) => x.isSelected);
      x.subTotalAmount = calculateTotalField(extraData, 'amount');
      x.gstCharged = calculateTotalField(extraData, 'gst');
      x.totalBillingAmount = parseFloat(x.subTotalAmount) + parseFloat(x.gstCharged);
      return x
    })

    const selectedShipmentSum = this.tableData
      .filter(x => x.isSelected)
      .reduce((sum, item) => sum + item.countSelected, 0);
    this.invoiceSummaryTableForm.controls['shipmentCount'].setValue(selectedShipmentSum);
  }
  /*End*/
  async save() {

    this.ValidTotalAmount = !isNaN(this.KPICountData[3]?.count) && this.KPICountData[3].count > 0;
    if (!this.ValidTotalAmount) {
      Swal.fire({
        icon: 'warning',
        title: 'Please check the total billing amount',
        text: 'Total billing amount should be greater than 0',
        confirmButtonText: 'OK'
      });
      return;
    }
    this.setControlValue(this.invoiceTableForm.controls['submissionOffice']);
    this.setControlValue(this.invoiceTableForm.controls['collectionOffice']);
    const shipments = this.tableData.filter((x) => x.isSelected);
    this.invoiceTableForm.controls['billingAmount'].setValue(this.invoiceTableForm.controls['unbilledAmount'].value);
    const allFormBinding = { ...this.invoiceTableForm.value, ...this.invoiceSummaryTableForm.value };
    const addRes = await this.invoiceServiceService.addBillDetails(allFormBinding, shipments);
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
  /*here customer function is for the get customer details like gst etc etc */
  async getCustomerDetail() {

    const custDetail = await getApiCustomerDetail(this.masterService, this.navigateExtra);
    const tranDetail = await getApiCompanyDetail(this.masterService);
    this.invoiceTableForm.controls['cGstin'].setValue(custDetail?.data[0].GSTdetails[0].gstNo || "");
    this.invoiceTableForm.controls['cState'].setValue(custDetail?.data[0].GSTdetails[0].gstState || "");
    this.invoiceTableForm.controls['gstSt'].setValue(custDetail?.data[0].GSTdetails[0].gstNo.substring(0, 2) || "");
    this.invoiceTableForm.controls['gstCt'].setValue(custDetail?.data[0].GSTdetails[0].gstCity || "");
    this.invoiceTableForm.controls['tState'].setValue(tranDetail?.data[0].state || "");
    this.invoiceTableForm.controls['tGstin'].setValue(tranDetail?.data[0].gstNo || "");
    // Check if custDetail and tranDetail have data
    const gstType = await this.checkGst(custDetail?.data[0].GSTdetails[0].gstNo, tranDetail?.data[0].gstNo);
    const gstTypes = Object.fromEntries(
      Object.entries(gstType).filter(([key, value]) => value === true)
    )
    this.gstTypeValue = gstTypes;
    // Helper function to get lowercase state from detail object
    //const getLowercaseState = (detail) => detail?.data?.[0]?.state.toLowerCase();
    // Extract lowercase states from custDetail and tranDetail
    // const custState = getLowercaseState(custDetail);
    // const tranState = getLowercaseState(tranDetail);
    // // Set 'gstType' value based on the equality of lowercase states
    this.invoiceTableForm.controls['gstType'].setValue(Object.keys(gstTypes).join());

    // const prqDetail = await getPrqApiDetail(this.masterService, this.navigateExtra.columnData.billingparty);
    const invoice = await this.invoiceServiceService.getInvoice(this.navigateExtra.dKTNO, this.status);
    const shipments = await this.invoiceServiceService.filterShipment(invoice);
    const invoiceDetail = await this.invoiceServiceService.getInvoiceDetail(shipments, this.invoiceTableForm.controls['gstRate'].value);
    this.tableData = invoiceDetail;

    // const cnoteCount = await total(invoiceDetail, 'cnoteCount');
    //this.invoiceSummaryTableForm.controls['shipmentCount'].setValue(cnoteCount);
    //const shipmentTot = await total(invoiceDetail, 'totalBillingAmount');
    //this.invoiceSummaryTableForm.controls['shipmentTotal'].setValue(shipmentTot);
    //const gstType = custState === tranState ? 'SGST' : 'IGST';



  }
  /*End*/
  /*Below function called when the click on checkbox*/
  getCalucationDetails($event) {
    // Use map to create a new array with updated isSelected property
    const isSelected = $event.filter((x) => x.isSelected == true);
    if (isSelected) {
      const itemsWithZeroBilling = $event.filter(item => item.totalBillingAmount === 0);
      if (itemsWithZeroBilling.length > 0) {
        $event.map(item => {
          item.isSelected = false;
          return item
        });
        Swal.fire({
          icon: 'warning',
          title: 'Please check the shipment',
          text: `For ${itemsWithZeroBilling.map(item => item.stateName).join(', ')}`,
          confirmButtonText: 'OK'
        });
      }

      const formGroup = this.invoiceSummaryTableForm.controls;
      const falseInvoice = $event ? $event.filter(x => !x.isSelected) : [];
      const invoice = $event ? $event.filter(x => x.isSelected) : [];
      if (invoice.length > 0) {
        // Assuming shipmentTotal is a FormControl
        // Make sure to use setValue to update the FormControl
        const subTotalAmount = invoice ? calculateTotalField(invoice, 'subTotalAmount') : 0;
        formGroup.shipmentTotal.setValue(subTotalAmount);
        const gstCharged = invoice ? calculateTotalField(invoice, 'gstCharged') : 0;
        formGroup.gst.setValue(gstCharged);
      }
      //#endregion
      else {
        const subTotalAmount = falseInvoice ? calculateTotalField(falseInvoice, 'subTotalAmount') : 0;
        const gstCharged = falseInvoice ? calculateTotalField(invoice, 'gstCharged') : 0;
        const currentShipmentTotal = parseFloat(formGroup.shipmentTotal.value || '0');
        // Perform the subtraction
        let newShipmentTotal = currentShipmentTotal - parseFloat(subTotalAmount);
        const gst = parseFloat(formGroup.gst.value || '0');
        let newGst = parseFloat(gstCharged) - gst;
        // Ensure the result is not less than zero
        newShipmentTotal = Math.max(newShipmentTotal, 0);
        newGst = Math.max(newGst, 0);
        // Set the new value to the formGroup
        formGroup.shipmentTotal.setValue(subTotalAmount);
        formGroup.gst.setValue(newGst);

      }
      const selectedShipmentSum = this.tableData
        .filter(x => x.isSelected)
        .reduce((sum, item) => sum + item.countSelected, 0);
      formGroup.shipmentCount.setValue(selectedShipmentSum);
      const gstCharged = this.tableData.filter((x) => x.isSelected).reduce((sum, item) => sum + item.gstCharged, 0);
      this.KPICountData = [
        {
          count: this.tableData.filter((x) => x.isSelected).reduce((sum, item) => sum + item.countSelected, 0),
          title: "Total Selected",
          class: `color-Bottle-light`,
        },
        {
          count: this.tableData.filter((x) => x.isSelected).reduce((sum, item) => sum + item.subTotalAmount, 0),
          title: "Sub Total Amount",
          class: `color-Daisy-light`,
        },
        {
          count: this.tableData.filter((x) => x.isSelected).reduce((sum, item) => sum + item.gstCharged, 0),
          title: "Total GST Charged",
          class: `color-Success-light`,
        },
        {
          count: this.tableData.filter((x) => x.isSelected).reduce((sum, item) => sum + item.totalBillingAmount, 0),
          title: "Total Billing Amount",
          class: `color-Grape-light`,
        },
      ]

    }
    const selectedItems = this.tableData.filter(item => item.isSelected);
    const gstCharged = selectedItems.reduce((sum, item) => sum + item.gstCharged, 0);
    const gstType = Object.keys(this.gstTypeValue);
    const totBillingAmt = this.tableData.filter((x) => x.isSelected).reduce((sum, item) => sum + item.totalBillingAmount, 0);
    // Set IGST, SGST, CGST, and UTGST based on gstType
    this.invoiceSummaryTableForm.controls['igst'].setValue(gstType.includes("IGST") ? gstCharged : 0);
    ['SGST', 'CGST', 'UTGST'].forEach(type => {
      this.invoiceSummaryTableForm.controls[type.toLowerCase()].setValue(gstType.includes(type) ? parseFloat(gstCharged) / 2 : 0);
    });
    this.invoiceSummaryTableForm.controls['invoiceTotal'].setValue(totBillingAmt);
    this.invoiceSummaryTableForm.controls['finalInvoice'].setValue(totBillingAmt);

  }

  async checkGst(supplierGstNo: string, consumerGstNo: string): Promise<{ CGST: boolean, IGST: boolean, SGST: boolean, UTGST: boolean }> {
    const sGstNo = supplierGstNo.trim().substring(0, 2);
    const cGstNo = consumerGstNo.trim().substring(0, 2);
    if (sGstNo !== cGstNo) {
      return { CGST: false, IGST: true, SGST: false, UTGST: false };
    } else {
      const gstDetail = await this.stateService.fetchStateByFilterId(cGstNo, "ST");
      if (gstDetail[0].ISUT) {
        return { CGST: true, IGST: false, SGST: false, UTGST: true };
      }
      return { CGST: true, IGST: false, SGST: true, UTGST: false };
    }
  }
  /*below function is fire when we add values in roundOff*/
  roundOffChange() {
    const roundOff = parseFloat(this.invoiceSummaryTableForm.controls['roundOff'].value || 0);
    const invoiceTotal = parseFloat(this.invoiceSummaryTableForm.controls['invoiceTotal'].value);
    this.invoiceSummaryTableForm.controls['finalInvoice'].setValue(roundOff + invoiceTotal);
  }
  /*End*/
  /*below the function is for the gst Exempted Changen*/
  gstExemptedChange() {
    let charges: string[] = [
      "gst",
      "igst",
      "cgst",
      "sgst",
      "utgst",
    ];
    const gstType = Object.keys(this.gstTypeValue);
    const shipmentTotal = parseFloat(this.invoiceSummaryTableForm.controls['shipmentTotal'].value);

    if (this.invoiceTableForm.controls['gstExempted'].value) {

      charges.map((x) => {
        this.invoiceSummaryTableForm.controls[x].setValue(0);
      });

      this.tableData.filter((x) => x.isSelected).map((x) => {
        x.extraData.filter((y) => y.isSelected).map((y) => {
          y.gst = 0;
          y.total = y.amount;
        });
        x.gstCharged = 0;
        x.totalBillingAmount = x.subTotalAmount;
      })
    }
    else {
      const gstRate = parseFloat(this.invoiceTableForm.controls['gstRate'].value.replace('%', '')) / 100;

      this.tableData.filter((x) => x.isSelected).map((x) => {
        x.extraData.filter((y) => y.isSelected).map((y) => {
          y.gst = parseFloat((y.amount * (gstRate)).toFixed(2));
          y.total = parseFloat(y.amount) + parseFloat(y.gst)
        });
        x.gstCharged = parseFloat(x.extraData.filter((y) => y.isSelected).reduce((sum, item) => sum + item.gst, 0).toFixed(2));
        x.totalBillingAmount = parseFloat(x.subTotalAmount) + parseFloat(x.gstCharged);
      });
    }

    const gstCharged = this.tableData.filter((x) => x.isSelected).reduce((sum, item) => sum + item.gstCharged, 0);
    const totBillingAmt = shipmentTotal + gstCharged;

    // Set IGST, SGST, CGST, and UTGST based on gstType
    this.invoiceSummaryTableForm.controls['igst'].setValue(gstType.includes("IGST") ? gstCharged : 0);
    ['SGST', 'CGST', 'UTGST'].forEach(type => {
      this.invoiceSummaryTableForm.controls[type.toLowerCase()].setValue(gstType.includes(type) ? parseFloat(gstCharged) / 2 : 0);
    });
    this.invoiceSummaryTableForm.controls['gst'].setValue(gstCharged || 0);

    this.invoiceSummaryTableForm.controls['invoiceTotal'].setValue(totBillingAmt);
    this.roundOffChange();
  }
}
