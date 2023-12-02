import { Component, OnInit } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
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
            "eNTDT": "Created Date",
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
    //#region to get Vehicle list
    async getVehicleDetails() {
        try {
            // Prepare the request  
            const req = {
                "companyCode": parseInt(localStorage.getItem("companyCode")),
                "collectionName": "vehicle_detail",
                "filter": {}
            };

            // Make a request to the backend API using the masterService
            const list = await firstValueFrom(this.masterService.masterPost("generic/get", req));

            // Check if the response contains data
            if (list.data) {
                // Extract and sort data based on the 'eNTDT' property (assuming it's a date)
                const data = list.data.sort((a, b) => new Date(b.eNTDT).getTime() - new Date(a.eNTDT).getTime());

                // Format the 'eNTDT' property in each item using the formatDocketDate function
                const dataWithDate = data.map(item => ({ ...item, eNTDT: formatDocketDate(item.eNTDT) }));

                // Set 'csv' and 'tableData' properties with the formatted data
                this.csv = this.tableData = dataWithDate;
            }
        } catch (error) {
            // Handle errors, log them, or show user-friendly messages
            console.error("Error fetching vehicle details:", error);
        } finally {
            // Set 'tableLoad' to false to indicate that data loading is complete
            this.tableLoad = false;
        }
    }
    //#endregion
    //#region to manage flag
    async isActiveFuntion(det) {
        // Extract the _id field from the det object
        const id = det._id;

        // Remove unnecessary fields from the det object
        delete det._id;
        delete det.srNo;
        delete det.eNTDT;
        delete det.eNTBY;
        delete det.eNTLOC;

        // Add modification fields to the det object
        det['mODDT'] = new Date();
        det['mODBY'] = localStorage.getItem("UserName");
        det['mODLOC'] = localStorage.getItem("Branch");

        // Prepare the request for updating the document
        const req = {
            companyCode: parseInt(localStorage.getItem("companyCode")),
            collectionName: "vehicle_detail",
            filter: { _id: id },
            update: det
        };

        try {
            // Make a request to update the document using the masterService
            const res = await firstValueFrom(this.masterService.masterPut("generic/update", req));

            // Check if the update was successful
            if (res) {
                // Display success message using Swal (assuming Swal is available)
                Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: res.message,
                    showConfirmButton: true,
                });

                // Refresh the vehicle details after a successful update
                this.getVehicleDetails();
            }
        } catch (error) {
            // Handle errors, log them, or show user-friendly messages
            console.error("Error updating document:", error);
        }
    }
    //#endregion 
}