import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";

@Component({
  selector: "app-list-container",
  templateUrl: "./list-container.component.html",
})
export class ListContainerComponent implements OnInit {
  breadscrums = [
    {
      title: "List Container",
      items: ["Home"],
      active: "List Container",
    },
  ];
  isTableLode = true;
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
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
      Style: "",
    },
    cNTYPNM: {
      Title: "Container Type ",
      class: "matcolumncenter",
      Style: "",
    },
    cNNO: {
      Title: "Container Number ",
      class: "matcolumncenter",
      Style: "",
    },
    vNTYP: {
      Title: "Vendor Type ",
      class: "matcolumncenter",
      Style: "",
    },
    vNNM: {
      Title: "Vendor Name ",
      class: "matcolumncenter",
      Style: "",
    },
    gRW: {
      Title: "Gross Weight ",
      class: "matcolumncenter",
      Style: "",
    },
    tRW: {
      Title: "Tare Weight ",
      class: "matcolumncenter",
      Style: "",
    },
    nETW: {
      Title: "Net Weight ",
      class: "matcolumncenter",
      Style: "",
    },
    aCT: {
      Title: "Active ",
      class: "matcolumncenter",
      Style: "",
    },
    Location: {
      Title: "Available at Location",
      class: "matcolumncenter",
      Style: "",
    },
    EditAction: {
      type: "iconClick",
      Title: "Action",
      class: "matcolumncenter",
      Style: "",
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
    "aCT",
    "Location",
  ];
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  TableData: any;
  constructor(private Route: Router, private masterService: MasterService) {}

  async ngOnInit() {
    const req = {
      companyCode: this.CompanyCode,
      collectionName: "container_detail_master",
      filter: {},
    };
    const res = await firstValueFrom(
      this.masterService.masterPost("generic/get", req)
    );
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
}
