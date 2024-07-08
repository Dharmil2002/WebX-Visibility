import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { formGroupBuilder } from "src/app/Utility/Form Utilities/formGroupBuilder";
import { DeliveryService } from 'src/app/Utility/module/operation/delivery/delivery.service';
import { UpdateDeliveryControl } from 'src/assets/FormControls/update-delivery-controls';
import { UpdateDeliveryModalComponent } from './update-delivery-modal/update-delivery-modal.component';
import moment from 'moment';
import { DeliveryStatus } from 'src/app/Models/docStatus';
import { StorageService } from 'src/app/core/service/storage.service';
import Swal from 'sweetalert2';
import { NavigationService } from 'src/app/Utility/commonFunction/route/route';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';

@Component({
  selector: 'app-update-delivery',
  templateUrl: './update-delivery.component.html',
})
export class UpdateDeliveryComponent implements OnInit {
  updatedeliveryTableForm: UntypedFormGroup
  backPath: string;
  tableData: any[];
  tableload = false;
  linkArray = []
  dynamicControls = {
    add: false,
    edit: false,
    //csv: true
  }
  menuItems = [{ label: "Edit" }];
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
    private route: Router,
    public dialog: MatDialog,
    private storage: StorageService,
    private changeDetectorRef: ChangeDetectorRef,
    private deliveryService: DeliveryService,
    public snackBarUtilityService: SnackBarUtilityService,
    private navService: NavigationService
  ) {
    this.deliveryData = this.route.getCurrentNavigation()?.extras?.state?.data;
    this.initializeFormControl();
  }

  ngOnInit(): void {
    this.backPath = "/dashboard/Index";
    this.tableload = false;
  }
  initializeFormControl() {
    this.updatedeliveryControls = new UpdateDeliveryControl();
    // Get form controls for Driver Details section
    this.jsonControlupdatedeliveryArray = this.updatedeliveryControls.getupdatedeliveryFormControls();
    // Build the form group using formGroupBuilder function
    this.updatedeliveryTableForm = formGroupBuilder(this.fb, [this.jsonControlupdatedeliveryArray]);
    this.autoFillDelivery();
  }

  autoFillDelivery() {
    this.updatedeliveryTableForm.controls['Vehicle'].setValue(this.deliveryData?.columnData.vehicleNo || "");
    this.updatedeliveryTableForm.controls['route'].setValue(this.deliveryData?.columnData.Cluster || "");
    this.updatedeliveryTableForm.controls['tripId'].setValue(this.deliveryData?.columnData.RunSheet || "");
    this.getShipments();
  }
  async getShipments() {
    if (this.deliveryData?.columnData.RunSheet) {
      const res = await this.deliveryService.getDeliveryDetail(this.deliveryData?.columnData.RunSheet);
      this.tableData = res.map((x) => {
        return {
          shipment: x.dKTNO,
          packages: x.dockets?.pEND?.pKGS !== undefined ? x.dockets?.pEND?.pKGS : x?.pKGS,
          sFX: x?.sFX || 0,
          delivered: "",
          person: "",
          reason: "",
          ltReason: "",
          deliveryPartial: "",
          pod: "",
          statusCd: DeliveryStatus.Yet_to_deliver,
          status: DeliveryStatus[DeliveryStatus.Yet_to_deliver].replace(/_/g, " "),
          actions: ["Edit"],
          ...x
        }
      });
    }
    this.kpiData();

  }
  kpiData() {
    const totalDkt = this.tableData;
    const totalPendPkgs = this.tableData && this.tableData.length > 0 ? this.tableData.reduce((total, shipment) => total + shipment.dockets.pEND.pKGS, 0) : 0;
    const totalDel = this.tableData && this.tableData.length > 0 ? this.tableData.filter((x) => x.hasOwnProperty('statusCd') && x.statusCd === 10).length : 0;
    const totalValue = this.tableData && this.tableData.length > 0
      ? this.tableData
        .filter(x => x.hasOwnProperty('deliveryPkgs'))
        .reduce((acc, curr) => acc + curr.deliveryPkgs, 0)
      : 0;

    const createShipDataObject = (count, title, className) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`
    });
    const shipData = [
      createShipDataObject(this.tableData.length, "Shipments", "bg-c-Bottle-light"),
      createShipDataObject(totalPendPkgs, "Packages", "bg-c-Grape-light"),
      createShipDataObject(totalDel, "Delivered", "bg-c-Daisy-light"),
      createShipDataObject(totalValue, "Packages Delivered", "bg-c-Grape-light"),
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
        height: "100vw",
        width: "100vw",
        maxWidth: "232vw"
      });
      dialogref.afterClosed().subscribe((result) => {
        if (result) {
          this.tableload = true;
          this.tableData.map((x) => {
            if (x.shipment == result.dKTNO) {
              const { status, statusCd } = this.getStatusAndCode(result.arrivedPkgs, result.deliveryPkgs);
              x.status = status;
              x.statusCd = statusCd;
              x.dateTime = result.DTTM;
              x.remarks = result.remarks;
              x.bookedPkgs = parseInt(result.bookedPkgs);
              x.arrivedPkgs = parseInt(result.arrivedPkgs);
              x.deliveryPkgs = parseInt(result.deliveryPkgs);
              x.pendingPkgs = parseInt(result?.arrivedPkgs || 0) - parseInt(result?.deliveryPkgs || 0);
              x.pendingWt = parseInt(result?.arrivedWeight || 0) - parseInt(result?.deliveryWeight || 0);
              x.cODDODCharges = result?.cODDODCharges || "0.00",
                x.codDodPaid = result?.codDodPaid || "0.00",
                x.dDateTime = moment.utc(result.DTTM).format("DD MMM YY HH:MM:SS");
              x.deliveryPartial = result.deliveryPartial || "",
                x.pod = result.upload || "",
                x.ltReason = result.ltReason || "",
                x.reason = result?.deliveryPartial || result?.ltReason || "",
                x.endKm = result?.endKm || 0,
                x.person = result?.person || this.storage.branch
            }
            return x;
          })
          this.tableload = false;
          this.changeDetectorRef?.detectChanges();
          this.kpiData();
        }
      });
    }
  }
  getStatusAndCode(arrivedPkgs, deliveryPkgs) {
    arrivedPkgs = parseInt(arrivedPkgs, 10);
    deliveryPkgs = parseInt(deliveryPkgs, 10);
    if (arrivedPkgs === deliveryPkgs) {
      return { status: DeliveryStatus[DeliveryStatus.Delivered].replace(/_/g, " "), statusCd: DeliveryStatus.Delivered }; // Adjust based on actual logic
    } else if (deliveryPkgs == 0) {
      return { status: DeliveryStatus[DeliveryStatus.Un_Delivered].replace(/_/g, " "), statusCd: DeliveryStatus.Un_Delivered };
    } else if (arrivedPkgs > deliveryPkgs) {
      return { status: DeliveryStatus[DeliveryStatus.Part_Delivered].replace(/_/g, " "), statusCd: DeliveryStatus.Part_Delivered };
    } else {
      return { status: DeliveryStatus[DeliveryStatus.Un_Delivered].replace(/_/g, " "), statusCd: DeliveryStatus.Un_Delivered }; // Adjust as needed
    }
  }
  async CompleteScan() {
    const status = this.tableData.every(x => x.dateTime);
    if (!status) { // If not every item has a non-empty dateTime, show the error
      Swal.fire({
        icon: "error",
        title: "Please fill the delivery details",
        showConfirmButton: true,
      });
      return false;
    }
    else {
      this.snackBarUtilityService.commonToast(async () => {
        const res = await this.deliveryService.deliveryUpdate(this.updatedeliveryTableForm.value, this.tableData);
        if (res) {
          Swal.fire({
            icon: "success",
            title: "Delivery Update Successfully",
            text: "DRS NO: " + this.updatedeliveryTableForm.controls['tripId'].value,
            showConfirmButton: true,
          }).then((result) => {
            // Redirect to the desired page after the success message is confirmed.
            this.navService.navigateTotab(
              "docket",
              "dashboard/Index"
            );
          })
        }
      }, "Delivery Update Successful");
    }
  }

}
