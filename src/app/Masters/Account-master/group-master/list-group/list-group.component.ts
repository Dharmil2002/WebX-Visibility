import { Component, OnInit } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-list-group",
  templateUrl: "./list-group.component.html",
})
export class ListGroupComponent implements OnInit {
  tableData: any[];
  csv: any[];
  menuItemflag: boolean = false;
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = ["activeFlag"];
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  linkArray = []
  breadScrums = [
    {
      title: "Account Group Master",
      items: ["Home"],
      active: "Account Group Master",
    },
  ]
  dynamicControls = {
    add: true,
    edit: false,
    csv: false,
  };

  columnHeader =
    {
      // "srNo": "Sr No",
      "eNTDT": "Created Date",
      "Groupcode": "Group Code",
      "AcGroupCatName": "Account Group Cat.",
      "GroupName": "Group Name",
      "BalanceSheetName": "Balance Sheet",
      "activeFlag": "Active Flag",
      "actions": "Action",
    }
  addAndEditPath: string;
  constructor(private masterService: MasterService) {
    this.addAndEditPath = "/Masters/AccountMaster/AddAccountGroup";
  }

  ngOnInit(): void {
    this.getTableData()
  }

  // async getTableData(){
  //   const req = {
  //     companyCode: this.CompanyCode,
  //     collectionName: "Acgroup_detail",
  //     filter: {},
  //   };
  //   const res = await this.masterService
  //     .masterPost("generic/get", req)
  //     .toPromise();
  //   if(res.success){
  //     this.TableData = res.data
  //     this.isTableLode = true
  //   }
  // }

  async getTableData() {
    // Prepare the request  
    const req = {
      "companyCode": this.companyCode,
      "collectionName": "Acgroup_detail",
      "filter": {}
    };
    // Make a request to the backend API using the masterService
    const res = await firstValueFrom(this.masterService.masterPost("generic/get", req));
    if (res && res.success) {
      const data = res.data;

      // Sort the data based on eNTDT in descending order
      const dataWithDate = data.sort((a, b) => new Date(b.eNTDT).getTime() - new Date(a.eNTDT).getTime());

      // Format the eNTDT field in the sorted data
      const formattedData = dataWithDate.map(item => ({
        ...item,
        eNTDT: formatDocketDate(item.eNTDT),
      }));

      // Extract the eNTDT from the first element (latest record)
      const latestUpdatedDate = formattedData.length > 0 ? formattedData[0].eNTDT : null;

      // Update csv and tableData with the formatted data
      this.csv = formattedData;
      this.tableData = formattedData;
    }
    this.tableLoad = false;
  }

  async IsActiveFuntion(det) {
    try {
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        collectionName: "Acgroup_detail",
        filter: { Groupcode: det.Groupcode },
        update: {activeFlag:det.activeFlag}
      };
      const res: any = await firstValueFrom(this.masterService.masterPut('generic/update', req))
      if (res) {
        // Display success message
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: res.message,
          showConfirmButton: true,
        });
        this.getTableData();
      }
    } catch (error) {
      // Handle errors here
      console.error("Error updating account group details:", error);
    }
  }
}
