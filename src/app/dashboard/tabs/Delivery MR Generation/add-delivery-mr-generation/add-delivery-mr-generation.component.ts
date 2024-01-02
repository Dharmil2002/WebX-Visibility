import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { DeliveryMrGeneration } from 'src/assets/FormControls/DeliveryMr';
import { deliveryStaticData } from '../deliveryData';
import { MatDialog } from '@angular/material/dialog';
import { DeliveryMrGenerationModalComponent } from '../delivery-mr-generation-modal/delivery-mr-generation-modal.component';

@Component({
  selector: 'app-add-delivery-mr-generation',
  templateUrl: './add-delivery-mr-generation.component.html'
})
export class AddDeliveryMrGenerationComponent implements OnInit {

  jsonControlDeliveryMrGenArray: any;
  deliveryMrTableForm: UntypedFormGroup
  breadscrums = [
    {
      title: "Delivery MR Generation",
      items: ["Dashboard"],
      active: "Delivery MR Generation",
    },
  ];
  tableData = deliveryStaticData;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  companyCode: number = parseInt(localStorage.getItem("companyCode"));
  menuItemflag: boolean = true;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  linkArray = [];

  columnHeader = {
    consignmentNoteNumber: {
      Title: "Consignment Note Number ",
      class: "matcolumnleft",
      //Style: "min-width:15%",
    },
    payBasis: {
      Title: "PayBasis",
      class: "matcolumnleft",
      // Style: "min-width:80px",
    },
    subTotal: {
      Title: "Sub Total Amount ",
      class: "matcolumnleft",
      //Style: "max-width:70px",
    },
    newSubTotal: {
      Title: "New Sub Total Amount ",
      class: "matcolumnleft",
      //Style: "min-width:200px",
    },
    rateDifference: {
      Title: "Rate Difference ",
      class: "matcolumnleft",
      //Style: "min-width:80px",
    },
    doorDelivery: {
      Title: "Door Delivery",
      class: "matcolumncenter",
      //Style: "max-width:70px",
    },
    demmurage: {
      Title: "Demmurage",
      class: "matcolumncenter",
      //Style: "max-width:70px",
    },
    loadingCharge: {
      Title: "Loading Charge",
      class: "matcolumncenter",
      //Style: "max-width:70px",
    },
    unLoadingCharge: {
      Title: "UnLoading Charge",
      class: "matcolumnleft",
      //Style: "min-width:100px",
    },
    forclipCharge: {
      Title: "Forclip Charge",
      class: "matcolumnleft",
      //Style: "min-width:100px",
    },
    gatepassCharge: {
      Title: "Gatepass Charge",
      class: "matcolumnleft",
      //Style: "min-width:100px",
    },
    otherCharge: {
      Title: "Other Charge",
      class: "matcolumnleft",
      //Style: "min-width:100px",
    },
    totalAmount: {
      Title: "Total Amount",
      class: "matcolumnleft",
      //Style: "min-width:100px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      //Style: "min-width:100px",
    },
  };
  branch = localStorage.getItem("Branch");

  staticField = [
    "totalAmount",
    "otherCharge",
    "gatepassCharge",
    "forclipCharge",
    "unLoadingCharge",
    "loadingCharge",
    "demmurage",
    "doorDelivery",
    "rateDifference",
    "newSubTotal",
    "subTotal",
    "payBasis",
    "consignmentNoteNumber"
  ];
  menuItems = [
    { label: 'Edit' },
    //{ label: 'Remove' }
  ]

  constructor(private fb: UntypedFormBuilder,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initializeDeliveryMrFormControls();
    console.log(this.tableData);
    
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

  //#region to initializes the form controls for the Delivery MR table.
  initializeDeliveryMrFormControls() {
    // Create an instance of the DeliveryMrGeneration class to generate form controls.
    const deliveryMrControlsGenerator = new DeliveryMrGeneration();

    // Retrieve the generated form controls array from the DeliveryMrGeneration instance.
    this.jsonControlDeliveryMrGenArray = deliveryMrControlsGenerator.getDeliveryMrControls();

    // Build the form group using the FormBuilder and the obtained form controls array.
    this.deliveryMrTableForm = formGroupBuilder(this.fb, [this.jsonControlDeliveryMrGenArray]);
  }
  //#endregion

  save() {
    console.log(this.deliveryMrTableForm.value);
  }
  hideControl() {
    // Get the value of the 'Deliveredto' control from the form
    const deliveredToValue = this.deliveryMrTableForm.value.Deliveredto;

    // Check if the control value is 'Consignee'
    if (deliveredToValue === 'Consignee') {
      // Find the control named 'NameofReceiver' in the jsonControlDeliveryMrGenArray
      let disableControl = this.jsonControlDeliveryMrGenArray.find(control => control.name === 'NameofReceiver');

      // Modify the properties of disableControl
      disableControl.name = 'NameofConsignee';
      disableControl.label = 'Name of Consignee';
      disableControl.placeholder = 'Name of Consignee';
      disableControl.value = '';
    }
    // Check if the control value is 'Consignee'
    if (deliveredToValue === 'Receiver') {

      // Find the control named 'NameofConsignee' in the jsonControlDeliveryMrGenArray
      let disableControl = this.jsonControlDeliveryMrGenArray.find(control => control.name === 'NameofConsignee');

      // Modify the properties of disableControl
      disableControl.name = 'NameofReceiver';
      disableControl.label = 'Name of Receiver';
      disableControl.placeholder = 'Name of Receiver';
      disableControl.value = '';
    }
  }
  //#region to Add a new item to the table or edit
  addDetails(event) {
    const request = {
      List: this.tableData,
      Details: event,
    }
    this.tableload = false;
    const dialogRef = this.dialog.open(DeliveryMrGenerationModalComponent, {
      data: request,
      width: "100%",
      disableClose: true,
      position: {
        top: "20px",
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      //this.getTableDetail();
      this.tableload = true;
    });
  }
  //#endregion
  handleMenuItemClick(e) { }
}