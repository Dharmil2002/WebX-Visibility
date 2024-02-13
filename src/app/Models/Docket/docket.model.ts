import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";
import { UntypedFormGroup } from "@angular/forms";
import { ConsignmentControl, FreightControl } from "src/assets/FormControls/consignment-control";
import { FormControls } from "../FormControl/formcontrol";
import { DocketDetail } from "src/app/core/models/operations/consignment/consgiment";

@Injectable({
  providedIn: "root",
})

export class DocketEntryModel implements IFieldDefinition {
  constructor() { }

  public consignmentTableForm: UntypedFormGroup;
  public containerTableForm: UntypedFormGroup;
  public FreightTableForm: UntypedFormGroup;
  public NonFreightTableForm: UntypedFormGroup;
  public invoiceTableForm: UntypedFormGroup;
  public ewayBillTableForm: UntypedFormGroup;

  public ConsignmentFormControls: ConsignmentControl;
  public FreightFromControl: FreightControl;
  public jsonMarketVehicle: FormControls[];

  public fromCity: string;
  public fromCityStatus: any;
  public customer: string;
  public customerStatus: any;
  public toCity: string;
  public toCityStatus: any;
  public consignorName: string;
  public consignorNameStatus: boolean;
  public consigneeName: string;
  public consigneeNameStatus: boolean;
  public vendorName: string;
  public vendorNameStatus: boolean;
  public prqNo: string;
  public prqNoStatus: boolean;
  public containerType: string;
  public containerTypeStatus: boolean;

  public docketDetail: DocketDetail;
  public tableData: any = [];
  public invoiceData: any = [];
  public tableData1: any;

  public vendorDetail: any;

  public previewResult: any;
  public vehicleNo: any;
  public vehicleNoStatus: any;
  public destination: any;
  public destinationStatus: any;
  public packagingType: any;
  public allformControl: any[];

  public prqData: any;
  public billingParty: any;
  public prqNoDetail: any[];
  public containerTypeList: any;
  public vehicleList: any;
  public allVehicle: any;

  public buttons = {
    addInvoiceEventButton: {
      functionName: 'addInvoiceData',
      name: "Add Invoice",
      iconName: 'add'
    },
    containerTableEventButton: {
      functionName: 'addData',
      name: "Add Container",
      iconName: 'add'
    },
    ewayBillButton: "Next"
  }

  public movementType = [
    { "name": "Import", "value": "I" },
    { "name": "Export", "value": "E" },
    { "name": "LTL", "value": "D" },
    { "name": "FTL", "value": "D" }
  ]

  public dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  public columnHeader = {
    containerNumber: {
      Title: "Container Number",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    containerType: {
      Title: "Container Type",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    containerCapacity: {
      Title: "Container Capacity",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    isEmpty: {
      Title: "Is Empty",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
  };

  public columnInvoice = {
    ewayBillNo: {
      Title: "Eway Bill No",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    expiryDate: {
      Title: "Expiry Date",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    invoiceNo: {
      Title: "Invoice No",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    invoiceAmount: {
      Title: "Invoice Amount",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    noofPkts: {
      Title: "No of Package",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    materialName: {
      Title: "Material Name",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actualWeight: {
      Title: "Actual Weight (MT)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    chargedWeight: {
      Title: "Charged Weight (MT)",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
  };

  public staticField = ["containerNumber", "containerType", "containerCapacity", "isEmpty"];

  public staticFieldInvoice = [
    "ewayBillNo",
    "expiryDate",
    "invoiceNo",
    "invoiceAmount",
    "noofPkts",
    "materialName",
    "actualWeight",
    "chargedWeight",
  ];

  public menuItems = [{ label: "Edit" }, { label: "Remove" }];

  getColumn(columnName: string): any | undefined {
    return this.columnHeader[columnName] ?? undefined;
  }

  getColumnDetails(columnName: string, field: string): any | undefined {
    const columnInfo = this.columnHeader[columnName];
    return columnInfo ? columnInfo[field] : undefined;
  }

  getColumnTitle(columnName: string): string | undefined {
    return this.getColumnDetails(columnName, "Title");
  }

  getColumnClass(columnName: string): string | undefined {
    return this.getColumnDetails(columnName, "class");
  }

  getColumnStyle(columnName: string): string | undefined {
    return this.getColumnDetails(columnName, "Style");
  }
}