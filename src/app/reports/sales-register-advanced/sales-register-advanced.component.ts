import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, take, takeUntil } from 'rxjs';
import moment from 'moment';
import { AutoComplateCommon } from 'src/app/core/models/AutoComplateCommon';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { getShipment } from 'src/app/operation/thc-generation/thc-utlity';
import { timeString } from 'src/app/Utility/date/date-utils';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { CustomerService } from 'src/app/Utility/module/masters/customer/customer.service';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { SalesRegisterService } from 'src/app/Utility/module/reports/sales-register';
import { salesRegisterControl } from 'src/assets/FormControls/Reports/sales-register/sales-register-advance';
// import { salesRegisterControl } from 'src/assets/FormControls/sales-register/sales-register-advance';
import Swal from 'sweetalert2';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { ExportService } from 'src/app/Utility/module/export.service';
@Component({
  selector: 'app-sales-register-advanced',
  templateUrl: './sales-register-advanced.component.html'
})
export class SalesRegisterAdvancedComponent implements OnInit {

  breadScrums = [
    {
      title: "Sales Register Advanced Report",
      items: ["Home"],
      active: "Sales Register Advanced Report",
    },
  ];
  salesregisterTableForm: UntypedFormGroup
  cnoteBillMRFormControls: salesRegisterControl
  jsonsalesregisterFormArray: any
  originName: any;
  originStatus: any;
  desName: any;
  protected _onDestroy = new Subject<void>();
  jsoncnoteBillMRFormArray: any;
  desStatus: any;
  payName: any;
  payStatus: any;
  bookingName: any;
  bookingStatus: any;
  cnoteName: any;
  cnoteStatus: any;
  custName: any;
  custStatus: any;
  tranName: any;
  tranStatus: any;
  billAtName: any;
  billAtStatus: any;
  chargesKeys: any[];
  constructor(
    private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private filter: FilterUtils,
    private generalService: GeneralService,
    private operationService: OperationService,
    private customerService: CustomerService,
    private salesRegisterService: SalesRegisterService,
    public snackBarUtilityService: SnackBarUtilityService,
    private exportService: ExportService,
  ) {
    this.initializeFormControl();
  }

  ngOnInit(): void {
    const now = new Date();
    const lastweek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - 10
    );
    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.salesregisterTableForm.controls["start"].setValue(lastweek);
    this.salesregisterTableForm.controls["end"].setValue(now);
    this.getDropDownList();
  }

  initializeFormControl() {
    this.cnoteBillMRFormControls = new salesRegisterControl();
    this.jsonsalesregisterFormArray = this.cnoteBillMRFormControls.salesRegisterControlArray;
    this.originName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "origin"
    )?.name;
    this.originStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "origin"
    )?.additionalData.showNameAndValue;
    this.desName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "destination"
    )?.name;
    this.desStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "destination"
    )?.additionalData.showNameAndValue;
    this.payName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "pAYBAS"
    )?.name;
    this.payStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "pAYBAS"
    )?.additionalData.showNameAndValue;
    this.bookingName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "bookType"
    )?.name;
    this.bookingStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "bookType"
    )?.additionalData.showNameAndValue;
    this.cnoteName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "cnote"
    )?.name;
    this.cnoteStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "cnote"
    )?.additionalData.showNameAndValue;
    this.custName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "cust"
    )?.name;
    this.custStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "cust"
    )?.additionalData.showNameAndValue;
    this.tranName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "tranmode"
    )?.name;
    this.tranStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "tranmode"
    )?.additionalData.showNameAndValue;
    this.billAtName = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "billAt"
    )?.name;
    this.billAtStatus = this.jsonsalesregisterFormArray.find(
      (data) => data.name === "billAt"
    )?.additionalData.showNameAndValue;
    this.salesregisterTableForm = formGroupBuilder(this.fb, [this.jsonsalesregisterFormArray]);
  }

  toggleSelectAll(argData: any) {
    let fieldName = argData.field.name;
    let autocompleteSupport = argData.field.additionalData.support;
    let isSelectAll = argData.eventArgs;
    const index = this.jsonsalesregisterFormArray.findIndex(
      (obj) => obj.name === fieldName
    );
    this.jsonsalesregisterFormArray[index].filterOptions
      .pipe(take(1), takeUntil(this._onDestroy))
      .subscribe((val) => {
        this.salesregisterTableForm.controls[autocompleteSupport].patchValue(
          isSelectAll ? val : []
        );
      });
  }
  CSVHeader = {
    "cNOTENO": "CNote No",
    "cNOTEDT": "CNote Date",
    "tIME": "Time",
    "eDD": "EDD",
    "bOOGBRANCH": "Booking Branch",
    "dELIVERYBRANCH": "Delivery Branch",
    "pAYTY": "Payment Type",
    "bUSTY": "Business Type",
    "pROD": "Product",
    "cONTID": "Contract ID",
    "cONTPARTY": "Contract party",
    "sERTY": "Service Type",
    "vEHNO": "Vehicle No",
    "bILLPARTYNM": "Billing Party Name",
    "bACODE": "BA Code",
    "eEDD": "EEDD",
    "eEDDREASON": "EEDD Reason",
    "lASTEDITBY": "Last Edit By",
    "cNOTEDITDT": "CNote Edited Date",
    "cUSTREFNO": "Customer Ref No",
    "mOVTY": "Type of Movement",
    "tRANMODE": "Transport Mode",
    "sTAT": "Status",
    "lOADTY": "Load Type",
    "rEMA": "Remark",
    "bILLAT": "Billed At",
    "pINCODE": "Pincode",
    "pINCODECAT": "PinCode Category",
    "pINCODEAREA": "PinCode Area",
    "lOACALCNOTE": "Local C Note",
    "fROMZONE": "From Zone",
    "tOZONE": "To Zone",
    "oDA": "ODA",
    "fROMCITY": "From City",
    "tOCITY": "To City",
    "dRIVERNM": "Driver Name1",
    "tRUCKREQNO": "Truck Request No",
    "TruckRequestDate": "Truck Request Date",
    "TRFromZone": "TR From Zone",
    "TRToZone": "TR To Zone",
    "TRFromCenter": "TR From Center",
    "TRToCenter": "TR To Center",
    "TRFromState": "TR From State",
    "TRToState": "TR To State",
    "VendorName": "Vendor Name",
    "VendorCode": "Vendor Code",
    "NoofPkgs": "No of Pkgs",
    "ActualWeight": "Actual Weight(KG)",
    "ChargedWeight": "Charged Weight",
    "SpecialInstruction": "Special Instruction",
    "PackagingType": "Packaging Type",
    "CubicWeight": "Cubic Weight",
    "ChargedPkgsNo": "Charged PkgsNo",
    "ChargedkM": "Charged KM",
    "InvoiceNo": "Invoice No",
    "InvoiceDate": "Invoice Date",
    "DeclaredValue": "Declared Value",
    "Length": "Length",
    "Breadth": "Breadth",
    "Height": "Height",
    "Contents": "Contents",
    "BatchNo": "Batch No",
    "PartNo": "Part No",
    "PartDescription": "Part Description",
    "PartQuntity": "Part Quantity",
    "FRRate": "FRT Rate",
    "FRTType": "FRT Type",
    // "FreightCharge": "Freight Charge",
    // "OtherCharges": "Other Charges",
    // "Greentax": "Green tax",
    // "DropCharges": "Drop Charges",
    // "DocumentCharges": "Document Charges",
    // "WarehouseCharges": "Warehouse Charges",
    "Deduction": "Deduction",
    // "HolidayServiceCharges": "Holiday Service Charges",
    // "FOVCharges": "FOV Charges",
    // "DODharges": "COD/DOD Charges",
    // "appointchar": "Appointment Charges",
    // "ODACharges": "ODA Charges",
    // "FuelSurchargeCharges": "FuelSurcharge Charges",
    // "MultipickupCharges": "Multipickup Charges",
    // "UnloadingCharges": "Unloading Charges",
    // "MultideliveryCharges": "Multidelivery Charges",
    // "LoadingCharges": "Loading Charges",
    "SubTotal": "Sub Total",
    "GSTRate": "GST Rate",
    "GSTAmount": "GST Amount",
    // "GSTCharge": "GST Charge",
    "VATRate": "VAT Rate",
    "VATAmount": "VAT Amount",
    "DocketTotal": "Docket Total",
    "CalamityCessRate": "Calamity Cess Rate",
    "CalamityCessAmount": "Calamity Cess Amount",
    "AdvanceAmount": "Advance Amount",
    "AdvanceRemark": "Advance Remark",
    "DPHRate": "DPH Rate",
    "DPHAmount": "DPH Amount",
    "DPHAmout": "DPH Amount",
    "DiscRate": "Disc Rate",
    "DiscAmount": "Disc Amount",
    "CNoteCancelledBy": "CNote Cancelled By",
    "CNoteCancelleDate": "CNote Cancelled Date",
    "Cancelled": "Cancelled",
    "DONo": "DO No",
    "SealNo": "Seal No",
    "JobNo": "Job No",
    "ContainerNo": "Container No",
    "ContainerCapacity": "Container Capacity",
    "ContainerType": "Container Type",
    "BOENo": "BOE No",
    "PoNumber": "Po Number",
    "PoDate": "Po Date",
    "FuelRateType": "Fuel Rate Type",
    "FOVRateType": "FOV Rate Type",
    "CFTRatio": "CFT Ratio",
    "TotalCFT": "Total CFT",
    "ServiceOptedFor": "Service Opted For",
    "FSCChargeRate": "FSC Charge Rate",
    "FOV": "FOV %",
    "Multidelivery": "Multidelivery",
    "Multipickup": "Multipickup",
    "RiskType": "Risk Type",
    "DOD": "COD/DOD",
    "DACC": "DACC",
    "Deferment": "Deferment",
    "PolicyNoDate": "Policy No,Date",
    "WeightType": "Weight Type",
    "DefaultCarRate": "Default Card Rate",
    "FuePerRate": "Fuel Per Rate",
    "ContractId": "Contract Id",
    "ArriveDate": "Arrive Date",
    "CurrentLocation": "Current Location",
    "NextLocation": "Next Location",
    "StockUpdateDate": "Stock Update Date",
    "ADD": "ADD",
    "PickupDelivery": "Pickup/Delivery",
    "SourceCNote": "Source CNote",
    "Caption": "Caption",
    "EntryDate": "Entry Date",
    "BookingType": "Booking Type",
    "SalesPersonBookingName": "Sales PersonBooking Name",
    "SalesPersonClosingName": "Sales PersonClosing Name",
    "EntryBy": "Entry By",
    "ICNo": "ICN No",
    "RackNo": "Rack No",
    "GroupNonGroup": "GroupNon Group",
    "AppointmentID": "Appointment ID",
    "Industry": "Industry",
    "ReturnCNote": "Return C Note (RTO)",
    "PermitApplicable": "Permit Applicable",
    "PermitRecievedAt": "Permit Recieved At",
    "DocketTemperature": "Docket Temperature",
    "Temperature": "Temperature",
    "Temp2": "Temp2",
    "Temp3": "Temp3",
    "TemperatureinCentigrate": "Temperature in Centigrate",
    "OperationVehicleNo": "Operation Vehicle No",
    "TripSheetNo": "TripSheet No",
    "TripSheetStartDate": "TripSheet Start Date",
    "TripSheetEndDate": "TripSheet End Date",
    "ThcDate": "Thc Date",
    "AsBillingParty": "As Billing Party",
    "ConsignorId": "Consignor Id",
    "ConsignorName": "Consignor Name",
    "ConsignorAddressCode": "Consignor Address Code",
    "ConsignorAddress": "Consignor Address",
    "ConsignorCityPincode": "Consignor City-Pincode",
    "ConsignorEMail": "Consignor E-Mail",
    "ConsignorMobileNo": "Consignor Mobile No",
    "ConsignorTelephoneNo": "Consignor Telephone No",
    "ConsignorGST": "Consignor GST",
    "ConsigneeId": "Consignee Id",
    "ConsigneeName": "Consignee Name",
    "ConsigneeAddressCode": "Consignee Address Code",
    "ConsigneeAddress": "Consignee Address",
    "ConsigneeCityPincode": "Consignee City-Pincode",
    "ConsigneeEMail": "Consignee E-Mail",
    "ConsigneeMobileNo": "Consignee Mobile No",
    "ConsigneeTelephoneNo": "Consignee Telephone No",
    "ConsigneeGST": "Consignee GST",
    "JobNumber": "Job Number",
    "JobDate": "Job Date ",
    "JobType": "Job Type ",
    "BillingParty": "Billing Party",
    "PortofDischarge": "Port of Discharge",
    "DestinationCountry": "Destination Country",
    "NoofPkts": "No of Pkts ",
    "VehicleSize": "Vehicle Size",
    "Weight": "Weight (MT)",
    "TransportedBy": "Transported By",
    "NoofContainer": "No of Container",
    "ExportType ": "Export Type ",
    "CHANumber": "CHA Number",
    "CHAAmount": "CHA Amount",
  }

  async getDropDownList() {
    const locationList = await this.locationService.getLocationList();
    const paymentType: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "PAYTYP" }, "codeDesc", "codeId");
    const booking: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "DELTYP" }, "codeDesc", "codeId");
    // const cnote = await getShipment(this.operationService, false);
    // const shipmentDetail = cnote.map((x) => {
    //   return { value: x.docketNumber, name: x.docketNumber };
    // });
    const customer = await this.customerService.customerFromApi();
    const tranmode: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "tran_mode" }, "codeDesc", "codeId");
    this.filter.Filter(
      this.jsonsalesregisterFormArray,
      this.salesregisterTableForm,
      locationList,
      this.originName,
      this.originStatus
    );
    this.filter.Filter(
      this.jsonsalesregisterFormArray,
      this.salesregisterTableForm,
      locationList,
      this.desName,
      this.desStatus
    );
    this.filter.Filter(
      this.jsonsalesregisterFormArray,
      this.salesregisterTableForm,
      paymentType,
      this.payName,
      this.payStatus
    );
    this.filter.Filter(
      this.jsonsalesregisterFormArray,
      this.salesregisterTableForm,
      booking,
      this.bookingName,
      this.bookingStatus
    );
    // this.filter.Filter(
    //   this.jsonsalesregisterFormArray,
    //   this.salesregisterTableForm,
    //   shipmentDetail,
    //   this.cnoteName,
    //   this.cnoteStatus
    // );
    this.filter.Filter(
      this.jsonsalesregisterFormArray,
      this.salesregisterTableForm,
      customer,
      this.custName,
      this.custStatus
    );
    this.filter.Filter(
      this.jsonsalesregisterFormArray,
      this.salesregisterTableForm,
      tranmode,
      this.tranName,
      this.tranStatus
    );
    this.filter.Filter(
      this.jsonsalesregisterFormArray,
      this.salesregisterTableForm,
      locationList,
      this.billAtName,
      this.billAtStatus
    );
  }

  async save() {
    this.snackBarUtilityService.commonToast(async () => {
      try {
        const startValue = new Date(this.salesregisterTableForm.controls.start.value);
        const endValue = new Date(this.salesregisterTableForm.controls.end.value);

        const startDate = moment(startValue).startOf('day').toDate();
        const endDate = moment(endValue).endOf('day').toDate();

        const loct = Array.isArray(this.salesregisterTableForm.value.fromlocHandler)
          ? this.salesregisterTableForm.value.fromlocHandler.map(x => { return { locCD: x.value, locNm: x.name }; })
          : [];
        const toloc = Array.isArray(this.salesregisterTableForm.value.tolocHandler)
          ? this.salesregisterTableForm.value.tolocHandler.map(x => { return { locCD: x.value, locNm: x.name }; })
          : [];
        const payment = Array.isArray(this.salesregisterTableForm.value.payTypeHandler)
          ? this.salesregisterTableForm.value.payTypeHandler.map(x => { return { payCD: x.value, payNm: x.name }; })
          : [];
        const bookingtype = Array.isArray(this.salesregisterTableForm.value.bookTypeHandler)
          ? this.salesregisterTableForm.value.bookTypeHandler.map(x => { return { bkCD: x.value, bkNm: x.name }; })
          : [];
        const cnote = this.salesregisterTableForm.value.cnote
        const customer = Array.isArray(this.salesregisterTableForm.value.custHandler)
          ? this.salesregisterTableForm.value.custHandler.map(x => { return { custCD: x.value, custNm: x.name }; })
          : [];
        const mode = Array.isArray(this.salesregisterTableForm.value.transitHandler)
          ? this.salesregisterTableForm.value.transitHandler.map(x => { return { mdCD: x.value, mdNm: x.name }; })
          : [];
        let data = await this.salesRegisterService.getsalesRegisterReportDetail(startDate, endDate, loct, toloc, payment, bookingtype, cnote, customer, mode);
        if (data.length === 0) {
          if (data) {
            Swal.fire({
              icon: "error",
              title: "No Records Found",
              text: "Cannot Download CSV",
              showConfirmButton: true,
            });
          }
          return;
        }
        Swal.hideLoading();
        setTimeout(() => {
          Swal.close();
        }, 1000);
        const transformedHeader = this.setcharges(data, this.CSVHeader); // Set the header for the CSV file
        const finalData = this.setCsvData(data); // Set the data for the CSV file
        // exportAsExcelFile(data, `Sales_Register_Report-${timeString}`, this.CSVHeader);
        this.exportService.exportAsCSV(finalData, `Sales_Register_Report-${moment().format("YYYYMMDD-HHmmss")}`, transformedHeader);
        // this.exportService.exportAsCSV(data, `Sales_Register_Report-${moment().format("YYYYMMDD-HHmmss")}`, this.CSVHeader);
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal(
          "error",
          error.message
        );
      }
    }, "Sales Register Advance Generating Please Wait..!");
  }

  // function to set charges
  // setcharges(chargeList: any[], headers) {
  //   debugger
  //   const columnHeader = { ...headers };
  //   this.chargesKeys = [];
  //   chargeList.forEach((item) => {
  //     item.chargeList.forEach((charge) => {
  //       const key = charge["cHGNM"]; // Use "cHGNM" as the header

  //       if (!this.chargesKeys.includes(key)) {
  //         this.chargesKeys.push(key);
  //       }
  //       columnHeader[key] = key; // Add "aMT" as the value for the header
  //     });
  //   });

  //   return columnHeader; // Return the transformed data
  // }
  setcharges(chargeList, headers) {
    debugger;
    const columnHeader = { ...headers };
    this.chargesKeys = [];

    chargeList.forEach((item) => {
      if (Array.isArray(item.chargeList)) {
        item.chargeList.forEach((charge) => {
          const key = charge["cHGNM"]; // Use "cHGNM" as the header
          if (!this.chargesKeys.includes(key)) {
            this.chargesKeys.push(key);
          }
          columnHeader[key] = charge["aMT"]; // Add "aMT" as the value for the header
        });
      } else {
        console.error("chargeList item does not have a chargeList array:", item);
      }
    });

    return columnHeader; // Return the transformed data
  }


  // // function to set csv data
  // setCsvData(data: any[]) {
  //   debugger
  //   const transformed = data.map((item) => {
  //     item.chargeList.forEach((x)=>{
  //       item[x.cHGNM]=x.aMT
  //     })
  //     delete item.chargeList
  //      return item;
  //    });
  //   return transformed;
  // }
  setCsvData(data: any[]) {
    debugger
    const transformed = data.map((item) => {
      if (Array.isArray(item.chargeList)) {
        item.chargeList.forEach((x) => {
          item[x.cHGNM] = x.aMT;
        });
        delete item.chargeList;
      }
      return item;
    });
    return transformed;
  }

  // async save() {
  //   const startValue = new Date(this.salesregisterTableForm.controls.start.value);
  //   const endValue = new Date(this.salesregisterTableForm.controls.end.value);

  //   const startDate = moment(startValue).startOf('day').toDate();
  //   const endDate = moment(endValue).endOf('day').toDate();
  //   let data = await this.salesRegisterService.getsalesRegisterReportDetail(startDate, endDate);
  //   const fromloc = Array.isArray(this.salesregisterTableForm.value.fromlocHandler)
  //     ? this.salesregisterTableForm.value.fromlocHandler.map(x => x.value)
  //     : [];
  //   const toloc = Array.isArray(this.salesregisterTableForm.value.tolocHandler)
  //     ? this.salesregisterTableForm.value.tolocHandler.map(x => x.value)
  //     : [];
  //   const payment = Array.isArray(this.salesregisterTableForm.value.payTypeHandler)
  //     ? this.salesregisterTableForm.value.payTypeHandler.map(x => x.value)
  //     : [];
  //   const bookingtype = Array.isArray(this.salesregisterTableForm.value.bookTypeHandler)
  //     ? this.salesregisterTableForm.value.bookTypeHandler.map(x => x.name)
  //     : [];
  //   const cnote = Array.isArray(this.salesregisterTableForm.value.cnoteHandler)
  //     ? this.salesregisterTableForm.value.cnoteHandler.map(x => x.name)
  //     : [];
  //   const transitmode = Array.isArray(this.salesregisterTableForm.value.transitHandler)
  //     ? this.salesregisterTableForm.value.transitHandler.map(x => x.name)
  //     : [];
  //   const filteredRecords = data.filter(record => {
  //     const origin = fromloc.length === 0 || fromloc.includes(record.origin);
  //     const dest = toloc.length === 0 || toloc.includes(record.destin);
  //     const paytpDet = payment.length === 0 || payment.includes(record.pAYTY);
  //     const booktpDet = bookingtype.length === 0 || bookingtype.includes(record.booktp);
  //     const cnoteDet = cnote.length === 0 || cnote.includes(record.cNOTENO);
  //     const tranmodeDet = transitmode.length === 0 || transitmode.includes(record.tRANMODE);

  //     return origin && dest && paytpDet && booktpDet && cnoteDet && tranmodeDet;
  //   })
  //   // const selectedData = filteredRecords;
  //   if (filteredRecords.length === 0) {
  //     // Display a message or take appropriate action when no records are found
  //     if (filteredRecords) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "No Records Found",
  //         text: "Cannot Download CSV",
  //         showConfirmButton: true,
  //       });
  //     }
  //     return;
  //   }
  //   const filteredRecordsWithoutKeys = filteredRecords.map((record) => {
  //     const { destin, origin, booktp, ...rest } = record;
  //     return rest;
  //   });
  //   exportAsExcelFile(filteredRecordsWithoutKeys, `Sales_Register_Advance_Report-${timeString}`, this.CSVHeader);
  // }

  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

}
