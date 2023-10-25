import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-vehicle-master-list',
    templateUrl: './vehicle-master-list.component.html'
})
export class VehicleMasterListComponent implements OnInit {
    csv: any[];
    tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
    // Define column headers for the table
    columnHeader =
        {
            // "srNo": "Sr No",
            "updatedDate": "Created Date",
            "vehicleNo": "Vehicle No.",
            "vehicleType": "Vehicle Type",
            "vendorName": "Vendor Name",
            "vendorType": "Vendor Type",
            "isActive": "Active Flag",
            "actions": "Actions",
        }
    headerForCsv = {
        // "srNo": "Sr No",
        "vehicleNo": "Vehicle Number",
        "vehicleType": "Vehicle Type",
        "vendorName": "Vendor Code",
        "vendorType": "Vendor Type",
        "isActive": "Active Flag",
    }
    breadScrums = [
        {
            title: "Vehicle Master",
            items: ["Master"],
            active: "Vehicle Master",
        }
    ];
    dynamicControls = {
        add: true,
        edit: true,
        csv: true
    }
    toggleArray = ["isActive"]
    linkArray = []
    addAndEditPath: string;
    csvFileName: string;
    tableData: any;
    constructor(private masterService: MasterService,) {
        this.addAndEditPath = "/Masters/VehicleMaster/AddVehicle";
    }
    ngOnInit(): void {
        this.getVehicleDetails();
        this.csvFileName = "Vehicle Details";
    }
    async getVehicleDetails() {
        let req = {
            "companyCode": parseInt(localStorage.getItem("companyCode")),
            "collectionName": "vehicle_detail",
            "filter": {}
        }
        this.masterService.masterPost('generic/get', req).subscribe((res: any) => {
            if (res && res.data) {
              const data = res.data;
        
              // Sort the data based on updatedDate in descending order
              const dataWithDate = data.sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime());
        
              // Extract the updatedDate from the first element (latest record)
              const latestUpdatedDate = dataWithDate.length > 0 ? dataWithDate[0].updatedDate : null;
        
              // Use latestUpdatedDate as needed
        
              this.csv = dataWithDate;
              this.tableData = dataWithDate;
            }
        
            this.tableLoad = false;
          });
    }
    async isActiveFuntion(det) {
        let id = det._id;
        // Remove the "id" field from the form controls
        delete det._id;
        delete det.srNo;
        let req = {
            companyCode: parseInt(localStorage.getItem("companyCode")),
            collectionName: "vehicle_detail",
            filter: {_id: id},
            update: det
        };
        const res = await this.masterService.masterPut("generic/update", req).toPromise()
        if (res) {
            // Display success message
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: res.message,
                showConfirmButton: true,
            });
            this.getVehicleDetails();
        }
    }
}
