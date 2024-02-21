import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { UpdateDeliveryControl } from 'src/assets/FormControls/update-delivery-controls';

@Component({
  selector: 'app-update-delivery',
  templateUrl: './update-delivery.component.html',
})
export class UpdateDeliveryComponent implements OnInit {
  updatedeliveryTableForm: UntypedFormGroup
  backPath: string;
  csv: any[];
  tableload = false;
  menuItems = []
  linkArray = []
  dynamicControls = {
    add: false,
    edit: false,
    //csv: true
  }
  jsonControlupdatedeliveryArray: any;
  updatedeliveryControls: UpdateDeliveryControl;
  boxData: { count: number; title: string; class: string; }[];
  breadscrums = [
    {
      title: "Update Delivery",
      items: ["Home"],
      active: "Update Delivery"
    }
  ]

  columnHeader = {
    shipment: {
      Title: "Shipment",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    packages: {
      Title: "Packages",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    delivered: {
      Title: "Delivered",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    person: {
      Title: "Person",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    reason: {
      Title: "Reason",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    pod: {
      Title: "POD",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    status: {
      Title: "Status",
      class: "matcolumncenter",
      Style: "min-width:10%",
    }
  };
  staticField = [
    "shipment",
    "packages",
    "delivered",
    "person",
    "reason",
    "pod",
    "status"
  ];

  constructor(private fb: UntypedFormBuilder) {
    this.initializeFormControl();
  }

  ngOnInit(): void {
    this.backPath = "/dashboard/Index";
    this.tableload = false;
    this.kpiData("");
  }
  initializeFormControl() {
    this.updatedeliveryControls = new UpdateDeliveryControl();
    // Get form controls for Driver Details section
    this.jsonControlupdatedeliveryArray = this.updatedeliveryControls.getupdatedeliveryFormControls();
    // Build the form group using formGroupBuilder function
    this.updatedeliveryTableForm = formGroupBuilder(this.fb, [this.jsonControlupdatedeliveryArray]);
  }

  kpiData(event) {
    const createShipDataObject = (count, title, className) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`
    });
    const shipData = [
      createShipDataObject(169, "Shipments", "bg-c-Bottle-light"),
      createShipDataObject(1800, "Packages", "bg-c-Grape-light"),
      createShipDataObject(20, "Delivered", "bg-c-Daisy-light"),
      createShipDataObject(90, "Packages Delivered", "bg-c-Grape-light"),
    ];

    this.boxData = shipData;
  }
  functionCallHandler($event) {
    // console.log("fn handler called", $event);
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call
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
}
