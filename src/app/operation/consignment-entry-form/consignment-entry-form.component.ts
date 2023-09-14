import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { NavigationService } from "src/app/Utility/commonFunction/route/route";
import { ConsignmentControl, FreightControl } from "src/assets/FormControls/consignment-control";
import Swal from "sweetalert2";
import { customerFromApi, locationFromApi } from "../prq-entry-page/prq-utitlity";
import { MasterService } from "src/app/core/service/Masters/master.service";

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
    // containerType: {
    //   name: "Container Type",
    //   key: "Dropdown",
    //   option: [
    //     { name: "Incoming Invoice", value: "Incoming Invoice" },
    //     { name: "Goods Movement", value: "Goods Movement" },
    //     { name: "CFS Charges", value: "CFS Charges" }
    //   ],
    //   Style: '',
    //   HeaderStyle: '',
    // },
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

  //#endregion

  constructor(
    private fb: UntypedFormBuilder,
    private _NavigationService: NavigationService,
    private masterService: MasterService
  ) {
    this.initializeFormControl();
    this.loadTempData();
  }

  ngOnInit(): void {
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
        documentType: [], // Array to store document types
        containerNumber: "", // Invoice number
        containerType: "", // Invoice date
        containerCapacity: "", // Length
      },
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
  async bindDataFromDropdown() {
    const resLoc = await locationFromApi(this.masterService);
    const resCust = await customerFromApi(this.masterService);

  }
  //#region Save Function
  save() {

  }
  //#endregion

  //#region cancel Function
  cancel() {
    this._NavigationService.navigateTotab(
      "docket",
      "dashboard/GlobeDashboardPage"
    );
  }
  //#endregion

}
