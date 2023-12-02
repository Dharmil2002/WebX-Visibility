import { Component, OnInit } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import Swal from "sweetalert2";
@Component({
    selector: 'app-vehicletype-master-list',
    templateUrl: './vehicletype-master-list.component.html',
})
export class VehicletypeMasterListComponent implements OnInit {
    data: [] | any;
    addAndEditPath: string
    csvFileName: string;
    csv: any[];
    companyCode: any = parseInt(localStorage.getItem("companyCode"));
    tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
    // Define column headers for the table
    columnHeader =
        {
            "updatedDate": "Created Date",
            "vehicleTypeCode": "Vehicle Type Code",
            "vehicleTypeName": "Vehicle Type Name",
            "isActive": "Active",
            "actions": "Actions"
        }
    headerForCsv = {
        "vehicleTypeCode": "Vehicle Type Code",
        "vehicleTypeName": "Vehicle Type Name",
        "vehicleTypeCategory": "Vehicle Type Category",
        "fuelType": "Fuel Type",
        "oem": "OEM",
        "oemmodel": "OEM MODEL",
        "isActive": "Active Flag"
    }
    breadScrums = [
        {
            title: "Vehicle Type Master",
            items: ["Master"],
            active: "Vehicle Type Master",
        }
    ];
    dynamicControls = {
        add: true,
        edit: true,
        csv: true
    }
    toggleArray = ["isActive"]
    linkArray = []
    tableData: any;
    constructor(private masterService: MasterService) {
        this.addAndEditPath = "/Masters/VehicleTypeMaster/AddVehicleTypeMaster";
    }
    ngOnInit(): void {
        this.getVehicleTypeDetails();
        this.csvFileName = "Vehicle Type Details"  //setting csv file Name so file will be saved as per this name
    }
    //#region to get list of vehicle type 
    async getVehicleTypeDetails() {
        try {
            const req = {
                "companyCode": this.companyCode,
                "filter": {},
                "collectionName": "vehicleType_detail"
            };

            const res = await firstValueFrom(this.masterService.masterPost('generic/get', req));

            if (res && res.data) {
                const data = res.data;

                // Sort the data based on updatedDate in descending order
                const dataWithDate = data.sort((a, b) => new Date(b.updatedDate).getTime() - new Date(a.updatedDate).getTime());

                // Use latestUpdatedDate as needed
                this.csv = this.tableData = dataWithDate;
            }
        } catch (error) {
            // Handle errors, log them, or show user-friendly messages
            console.error("Error fetching vehicle type details:", error);
        } finally {
            // Set 'tableLoad' to false to indicate that data loading is complete
            this.tableLoad = false;
        }
    }
    //#endregion

    async isActiveFuntion(det) {
        let id = det._id;
        // Remove the "id" field from the form controls
        delete det._id;
        delete det.activeflag;
        let req = {
            companyCode: this.companyCode,
            collectionName: "vehicleType_detail",
            filter: { _id: id },
            update: det
        };
        const res = await firstValueFrom(this.masterService.masterPut('generic/update', req));
        if (res) {
            // Display success message
            Swal.fire({
                icon: "success",
                title: "Successful",
                text: res.message,
                showConfirmButton: true,
            });
            this.getVehicleTypeDetails();
        }
    }
}