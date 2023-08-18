import { Component, OnInit } from '@angular/core';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { getVehicleDashboardDetails, getVehicleStatusFromApi } from '../vehicle-status-utility';
import { formatDate } from 'src/app/Utility/date/date-utils';

@Component({
  selector: 'app-vehicle-status-update',
  templateUrl: './vehicle-status-update.component.html'
})
export class VehicleStatusUpdateComponent implements OnInit {
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation 
  companyCode = parseInt(localStorage.getItem("companyCode"));
  branchCode =localStorage.getItem("Branch");
  addAndEditPath: string = 'Masters/Vehicle/Status/Add';
  data: [] | any;
  uploadComponent: any;
  csvFileName: string;
  toggleArray = ["isActive"];
  linkArray = [];
  csv: any;
  tableData: any;
  dynamicControls = {
    add: true,
    edit: true,
    csv: true
  }
  breadScrums = [
    {
      title: "Vehicle Status",
      items: ["Master"],
      active: "Vehicle Status",
    },
  ];
  columnHeader = {
    "srNo": "Sr No",
    "vehNo": "Vehicle No",
    "status": "Status",
    "tripId": "Trip Id",
    "currentLocation": "Location",
    "route": "Route",
    "updateDate":"Last Location Time"
  };
  headerForCsv = {
    "srNo": "Sr No",
    "vehNo": "Vehicle No",
    "status": "Status",
    "tripId": "Trip Id",
    "currentLocation": "Location",
    "route": "Route"
  };
  boxData: any;
  constructor(
    private _operationService: OperationService
    ) {
    this.fetchVehicleStatus();
  }

  ngOnInit(): void {

  }
  async fetchVehicleStatus() {

    try {
      const vehicleStatusData = await getVehicleStatusFromApi(this.companyCode, this._operationService);
      // Assuming vehicleDetail.data is an array of objects with 'id' property
      // Generate srno for each object in the array
      const vehicleTableData = vehicleStatusData.filter((x)=>x.currentLocation.trim()===this.branchCode.trim()||x.rptLoc.trim()===this.branchCode.trim()).map((obj, index) => {
        return {
          ...obj,
          srNo: index + 1
        };
      });
      const tableDetail=vehicleTableData.map((x)=>{if(x.updateDate){x.updateDate= formatDate(x.updateDate,'dd/MM/yyyy HH:mm') }return x})
      const sortedTableDetail = tableDetail.sort((a, b) => {
        if (a.updateDate && b.updateDate) {
          return b.updateDate.localeCompare(a.updateDate); // Sorting by updateDate in descending lexicographical order
        } else if (a.updateDate) {
          return -1; // a has updateDate, but b doesn't, so a comes before b
        } else if (b.updateDate) {
          return 1; // b has updateDate, but a doesn't, so b comes before a
        } else {
          return 0; // neither a nor b has updateDate, no preference for order
        }
      });
      
      this.tableData=sortedTableDetail;
      this.tableLoad = false;
      this.boxData = getVehicleDashboardDetails(this.tableData)
    } catch (error) {
      // Handle API call errors here
      console.error('Error fetching vehicle status:', error);
      // You can also set an error state or display a relevant message to the user
    }
  }


}
