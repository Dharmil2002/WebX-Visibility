import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import Swal from "sweetalert2";
import { ExpressRouteBulkUploadComponent } from "../../vendor-contract/vendorContractTabs/vendor-terdetail/express-route-bulk-upload/express-route-bulk-upload.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-list-container",
  templateUrl: "./list-container.component.html",
})
export class ListContainerComponent implements OnInit {
  breadscrums = [
    {
      title: "Container Master",
      items: ["Master"],
      active: "Container Master",
    },
  ];
  isTableLode = true;
  dynamicControls = {
    add: true,
    edit: false,
    csv: true,
  };
  EventButton = {
    functionName: "AddNew",
    name: "Add Container",
    iconName: "add",
  };
  columnHeader = {
    entryDate: {
      Title: "Created on ",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    cNTYPNM: {
      Title: "Container Type ",
      class: "matcolumncenter",
      Style: "min-width:12%",
    },
    cNNO: {
      Title: "Container No. ",
      class: "matcolumncenter",
      Style: "min-width:12%",
    },
    vNTYP: {
      Title: "Vendor Type ",
      class: "matcolumncenter",
      Style: "min-width:12%",
    },
    vNNM: {
      Title: "Vendor Name ",
      class: "matcolumncenter",
      Style: "min-width:12%",
    },
    gRW: {
      Title: "Gross W. ",
      class: "matcolumncenter",
      Style: "min-width:10%",
    },
    tRW: {
      Title: "Tare W. ",
      class: "matcolumncenter",
      Style: "min-width:8%",
    },
    nETW: {
      Title: "Net W. ",
      class: "matcolumncenter",
      Style: "min-width:8%",
    },
    aCT: {
      Title: "Active ",
      type: "Activetoggle",
      class: "matcolumncenter",
      Style: "min-width:8%",
      functionName: "ActivetoggleFunction",
    },
    EditAction: {
      type: "iconClick",
      Title: "Action",
      class: "matcolumncenter",
      Style: "min-width:8%",
      functionName: "EditFunction",
      iconName: "edit",
    },
  };
  staticField = [
    "entryDate",
    "cNTYPNM",
    "cNNO",
    "vNTYP",
    "vNNM",
    "gRW",
    "tRW",
    "nETW",
    // "aCT",
    "Location",
  ];
  TableData: any;
  csvFileName = "Container Master";
  headerForCsv = {
    "entryDate": "Created Date",
    "cNTYPNM": "Container Type ",
    "cNNO": "Container Number",
    "vNTYP": "Vendor Type",
    "vNNM": "Vendor Name",
    "gRW": "Gross Weight ",
    "tRW": "Tare Weight",
    "nETW": "Net Weight",
    "aCT": "Active Status",
  }
  constructor(
    private Route: Router,
    private masterService: MasterService,
    private storage: StorageService,
    private dialog: MatDialog,
  ) {}

  async ngOnInit() {
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "container_detail_master",
      filter: {},
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
    console.log('res' ,res)
    if (res.success) {
      this.TableData = res.data.map((x) => {
        return {
          ...x,
          entryDate: moment(x.eNTDT).format("DD-MM-YYYY"),
          Location: "",
          aCT: x.aCT == 1 ? true : false,
        };
      });
      this.isTableLode = true;
    }
  }

  AddNew() {
    this.Route.navigateByUrl("/Masters/ContainerMaster/AddContainer");
  }
  EditFunction(event) {
    this.Route.navigate(["/Masters/ContainerMaster/AddContainer"], {
      state: { data: event?.data },
    });
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  async ActivetoggleFunction(event) {
    const UpdateData = event.data;
    const body = {
      aCT: UpdateData.aCT,
    };
    const req = {
      companyCode: this.storage.companyCode,
      collectionName: "container_detail_master",
      filter: { cNCD: UpdateData.cNCD },
      update: body,
    };
    const res = await firstValueFrom(
      this.masterService.masterPut("generic/update", req)
    );
    if (res.success) {
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
    }
  }

  upload() {
    const dialogRef = this.dialog.open(ExpressRouteBulkUploadComponent, {
      width: "800px",
      height: "500px",
    });
    dialogRef.afterClosed().subscribe(() => {
      // this.getXpressDetail();
    });
  }
}
