import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { DeliveryService } from 'src/app/Utility/module/operation/delivery/delivery.service';
import { UpdateDeliveryControl } from 'src/assets/FormControls/update-delivery-controls';
import { UpdateDeliveryModalComponent } from './update-delivery-modal/update-delivery-modal.component';
import moment from 'moment';

@Component({
  selector: 'app-update-delivery',
  templateUrl: './update-delivery.component.html',
})
export class UpdateDeliveryComponent implements OnInit {
  updatedeliveryTableForm: UntypedFormGroup
  backPath: string;
  csv: any[];
  tableload = false;
  linkArray = []
  dynamicControls = {
    add: false,
    edit: false,
    //csv: true
  }
  menuItems = [{ label: "Edit"}];
  menuItemflag: boolean = true;
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
    status: {
      Title: "Status",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    reason: {
      Title: "Reason",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    dDateTime: {
      Title: "Date && Time",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:80px",
    },
  };
  staticField = [
    "shipment",
    "status",
    "reason",
    "dDateTime"
  ];
  deliveryData: any;

  constructor(
    private fb: UntypedFormBuilder,
    private route:Router,
    public dialog: MatDialog,
    private changeDetectorRef:ChangeDetectorRef,
    private deliveryService:DeliveryService
    ) {
     this.deliveryData = this.route.getCurrentNavigation()?.extras?.state?.data;
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
    this.autoFillDelivery();
  }
  
  autoFillDelivery(){
    this.updatedeliveryTableForm.controls['Vehicle'].setValue(this.deliveryData?.columnData.vehicleNo||"");
    this.updatedeliveryTableForm.controls['route'].setValue(this.deliveryData?.columnData.Cluster||"");
    this.updatedeliveryTableForm.controls['tripid'].setValue(this.deliveryData?.columnData.RunSheet||"");
    this.getShipments();
  }
  async getShipments() {
    if(this.deliveryData?.columnData.RunSheet){
     const res= await this.deliveryService.getDeliveryDetail({dRSNO:this.deliveryData?.columnData.RunSheet});
      this.csv = res.map((x) => {
        return {
          shipment: x.dKTNO,
          packages: x.pKGS,
          delivered:"",
          person:"",
          reason:"",
          pod: "",
          status: "Yet To Deliver",
          actions:["Edit"]
        }
      });
    }

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
  async handleMenuItemClick(data) {
    if (data.label.label === "Edit") {
      const dialogref = this.dialog.open(UpdateDeliveryModalComponent, {
        data: data.data,
        width: "800px",
        height: "500px",
      });
      dialogref.afterClosed().subscribe((result) => {
        if (result) {
          this.tableload=true;
           this.csv.map((x)=>{
            if(x.shipment==result.dKTNO){
              x.status=result.bookedPkgs==parseInt(result.deliveryPkgs)?"Delivered":"";
              x.dateTime=result.DTTM;
              x.dDateTime=moment.utc(result.DTTM).format("DD/MM/YYYY HH:MM:SS");
              x.person=result.person;
              x.reason=result.reason;
              x.pod=result.pod;
            }
            return x;
           })
           this.tableload=false;
           this.changeDetectorRef?.detectChanges();
        }
      });
    }
    }
}
