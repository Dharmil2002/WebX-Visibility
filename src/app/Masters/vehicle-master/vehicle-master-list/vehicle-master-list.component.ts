import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";

@Component({
    selector: 'app-vehicle-master-list',
    templateUrl: './vehicle-master-list.component.html'
})
export class VehicleMasterListComponent implements OnInit {
    data: [] | any;
    csv: any[];
    companyCode: any = parseInt(localStorage.getItem("companyCode"));
    tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
    // Define column headers for the table
    columnHeader =
        {
            "srNo": "Sr No",
            "vehicleNo": "Vehicle No.",
            "vehicleType": "Vehicle Type",
            "vendorName": "Vendor Code",
            "vendorType": "Vendor Type",
            "isActive": "Active Flag",
            "actions": "Actions",
        }
    headerForCsv = {
        "srNo": "Sr No",
        "vehicleNo": "Vehicle No.",
        "vehicleType": "Vehicle Type",
        "vendorName": "Vendor Code",
        "vendorType": "Vendor Type",
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
    csvFileName: string;
    constructor(private masterService: MasterService) {
        this.addAndEditPath = "/Masters/VehicleMaster/AddVehicle";
    }
    ngOnInit(): void {
        this.getVehicleDetails();
        this.csvFileName = "Vehicle Details";
    }
    getVehicleDetails() {
        let req = {
            "companyCode": this.companyCode,
            "type": "masters",
            "collection": "vehicle_master"
        }
        this.masterService.masterPost('common/getall', req).subscribe({
            next: (res: any) => {
                if (res) {
                    // Generate srno for each object in the array
                    const dataWithSrno = res.data.map((obj, index) => {
                        return {
                            ...obj,
                            srNo: index + 1
                        };
                    });
                    this.csv = dataWithSrno;
                    this.tableLoad = false;
                }
            }
        })
    }
}