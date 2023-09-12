import { Component, HostListener, OnInit } from '@angular/core';
import { format, isValid, parseISO } from 'date-fns';
import { FailedApiServiceService } from 'src/app/core/service/api-tracking-service/failed-api-service.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { sendRequest } from './outbox-utility';
import { utilityService } from 'src/app/Utility/utility.service';
import { ErrorHandlingViewComponent } from './error-handling-view/error-handling-view.component';

@Component({
  selector: 'app-error-handing',
  templateUrl: './error-handing.component.html'
})
export class ErrorHandingComponent implements OnInit {
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation 
  companyCode = parseInt(localStorage.getItem("companyCode"));
  branchCode = localStorage.getItem("Branch");
  addAndEditPath: string = '';
  data: [] | any;
  height = '50%';
  width = '600px';
  uploadComponent: any;
  csvFileName: string;
  toggleArray = ["isActive"];
  linkArray = [];
  csv: any;
  tableData: any;
  dynamicControls = {
    add: false,
    edit: true,
    csv: true
  }

  breadScrums = [
    {
      title: "Request Outbox",
      items: ["Home"],
      active: "Request Outbox",
    },
  ];
  TableStyle = "width:82%"
  columnHeader = {
    "srNo": "Sr No",
    "createdOn": "Created On",
    "view": "Request Body",
    "source": "Module Name",
    "attempts": "Reattempt",
    "actions": "Action"
  };
  menuItemflag: boolean = true;
  menuItems = [
    { label: 'Repush' },
    { label: 'Delete' },
    { label: 'Download' },
    // Add more menu items as needed
  ];
  headerForCsv = {
    // "srNo": "Sr No",
    // "vehNo": "Vehicle No",
    // "status": "Status",
    // "tripId": "Trip Id",
    // "currentLocation": "Location",
    // "route": "Route"
  };
  issueList: any[];
  viewComponent: any;
  constructor(
    private failedApiService: FailedApiServiceService,
    private masterService: MasterService,
    private service: utilityService
  ) {
    this.getIssueDetail()
  }

  ngOnInit(): void {
    this.viewComponent = ErrorHandlingViewComponent
  }

  getIssueDetail() {
    const issueDetail = this.failedApiService.getFailedRequests();
    if (issueDetail) {
      let issueList = []
      issueDetail.forEach((element, index) => {
        let formattedDate = "";
        const date = new Date(element?.createdOn).toISOString();
        const parsedDate = parseISO(date);
        if (isValid(parsedDate)) {
          formattedDate = format(parsedDate, "dd-MM-yy HH:mm");
        }
        let issueJson = {
          "id": element.id,
          "srNo": index + 1,
          "request": element?.request || "",
          "source": element?.source || "",
          "createdOn": formattedDate,
          "attempts": element?.attempts || 0
        }
        issueList.push(issueJson);
      });
      this.tableLoad = false;
      this.issueList = issueDetail;
      this.tableData = issueList;
    }
  }

  async handleMenuItemClick(data) {
    this.tableLoad = true;
    if (data.label === "Repush") {
      const request = this.issueList.find((x) => x.id === data.data.id);
      const res = await sendRequest(this.masterService, request);

      if (res) {
        Swal.fire({
          icon: "success",
          title: "Successful",
          text: "Request successfully sent",
          showConfirmButton: true,
        });
        this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
      } else {
        Swal.fire({
          icon: "error",
          title: "Please try again",
          text: "Something wrong with the API. Please contact support team",
          showConfirmButton: true,
        });
        const tableItem = this.tableData.find((x) => x.id === data.data.id);
        tableItem.attempts += 1;
      }
    }
    else if (data.label === "Download") {
      this.Download();
    }
    else {
      Swal.fire({
        icon: "success",
        title: "Successful",
        text: "Request successfully removed",
        showConfirmButton: true,
      });
      this.tableData = this.tableData.filter((x) => x.id !== data.data.id);
    }

    this.tableLoad = false;
  }
  Download() {
    this.service.exportData(this.issueList.map((item) => item.request),"RequestBody");
  }
}
