import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";

@Component({
  selector: 'app-vehicle-master-list',
  templateUrl: './vehicle-master-list.component.html'
})
export class VehicleMasterListComponent implements OnInit {
    data: [] | any;
    csv: any[];
    tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
    // Define column headers for the table
    columnHeader =
        {
            "srNo": "Sr No",
            "vehicleNo": "Vehicle No.",
            "vehicleType": "Vehicle Type",
            "vendorName": "Vendor Code",
            "vendorType": "Vendor Type",
            "division": "Vehicle  Division",
            "isActive": "Active Flag",
            "actions": "Actions",
        }
    headerForCsv = {
      "srNo": "Sr No",
      "vehicleNo": "Vehicle No.",
      "vehicleType": "Vehicle Type",
      "vendorName": "Vendor Code",
      "vendorType": "Vendor Type",
      "division": "Vehicle  Division",
      "isActive": "Active Flag",
      "actions": "Actions",
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
        csv: false
    }
    toggleArray = ["isActive"]
    linkArray = []
    addAndEditPath: string;
    constructor(private masterService: MasterService) {
        this.addAndEditPath = "/Masters/VehicleMaster/AddVehicle";
    }
    ngOnInit(): void {
        //throw new Error("Method not implemented.");
        this.GetVehicleDetails();
    }
    GetVehicleDetails() {
        //throw new Error("Method not implemented.");
        // Fetch data from the JSON endpoint
            this.masterService.getJsonFileDetails('masterUrl').subscribe(res => {
            this.data = res;
            this.csv = this.data['vehicleMaster']
            this.tableLoad = false;
        }
        );
    }
}