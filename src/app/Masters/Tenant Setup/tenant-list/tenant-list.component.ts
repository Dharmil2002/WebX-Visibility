import { Component, OnInit } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { SessionService } from "src/app/core/service/session.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-tenant-list",
  templateUrl: "./tenant-list.component.html",
})
export class TenantListComponent implements OnInit {
  tableLoad = true;
  csv: any;
  addAndEditPath: string;
  companyCode: number;
  toggleArray = ["activeFlag"];
  linkArray = [];
  tableData: any;

  breadScrums = [
    {
      title: "Tenant Master",
      items: ["Master"],
      active: "Tenant Master",
    },
  ];

  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };

  constructor(
    private sessionService: SessionService,
    private masterService: MasterService
  ) {
    this.companyCode = this.sessionService.getCompanyCode();
  }

  columnHeader = {
    eNTDT: "Created Date",
    cOMNM: "Company Name",
    activeFlag: "Active Status",
    actions: "Action",
  };

  ngOnInit(): void {
    this.getTenantDetails();
    this.addAndEditPath = "/Masters/TenantMaster/AddTenantMaster";
  }

  async getTenantDetails() {
    try {
      // Prepare the request
      const req = {
        companyCode: this.companyCode,
        collectionName: "tenants_detail",
        filter: {},
      };

      // Make a request to the backend API using the masterService
      const list = await firstValueFrom(
        this.masterService.masterPost("generic/get", req)
      );

      // Check if the response contains data
      if (list.data) {
        // Extract and sort data based on the 'eNTDT' property (assuming it's a date)
        const data = list.data.sort(
          (a, b) => new Date(b.eNTDT).getTime() - new Date(a.eNTDT).getTime()
        );

        // Format the 'eNTDT' property in each item using the formatDocketDate function
        const dataWithDate = data.map((item) => ({
          ...item,
          eNTDT: formatDocketDate(item.eNTDT),
        }));

        // Set 'csv' and 'tableData' properties with the formatted data
        this.csv = this.tableData = dataWithDate;
      }
    } catch (error) {
      // Handle errors, log them, or show user-friendly messages
      console.error("Error fetching tenant details:", error);
    } finally {
      // Set 'tableLoad' to false to indicate that data loading is complete
      this.tableLoad = false;
    }
  }

  async IsActiveFuntion(det) {
    let id = det._id;
    // Remove the "id" field from the form controls
    delete det._id;
    delete det.srNo;
    delete det.eNTDT;
    delete det.eNTBY;
    delete det.eNTLOC;
    det["mODLOC"] = localStorage.getItem("Branch");
    det["mODBY"] = localStorage.getItem("UserName");
    det["mODDT"] = new Date();
    let req = {
      companyCode: this.companyCode,
      collectionName: "tenants_detail",
      filter: {
        _id: id,
      },
      update: det,
    };
    const res = await firstValueFrom(
      this.masterService.masterPut("generic/update", req)
    );
    if (res) {
      // Display success message
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: res.message,
        showConfirmButton: true,
      });
      this.getTenantDetails();
    }
  }
}
