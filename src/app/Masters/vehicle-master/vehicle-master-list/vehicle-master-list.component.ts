import { Component, OnInit } from "@angular/core";
import moment from "moment";
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
        // Prepare the request  
        let req = {
            "companyCode": parseInt(localStorage.getItem("companyCode")),
            "collectionName": "vehicle_detail",
            "filter": {}
        }
        const res = await firstValueFrom(this.masterService.masterPost('generic/get', req))
        if (res && res.data) {
            const data = res.data
            const sortedData = data.sort((a, b) => {
                const dateA = new Date(a.eNTDT).getTime(); // Convert to a number
                const dateB = new Date(b.eNTDT).getTime(); // Convert to a number
                if (!isNaN(dateA) && !isNaN(dateB)) {
                    return dateB - dateA;
                }
                return 0; // Handle invalid dates or NaN values
            })
            const dataWithDate = data.map(item => ({
                ...item,
                vendorName: item.vendorName ? item.vendorName : '',
                eNTDT: formatDocketDate(item.eNTDT)
            }));

            this.csv = dataWithDate;
            this.tableData = dataWithDate;
        }

        this.tableLoad = false;

    }
    //#endregion
    async isActiveFuntion(det) {
        let id = det._id;
        // Remove the "id" field from the form controls
        delete det._id;
        delete det.eNTDT;
        det['mODDT'] = new Date()
        det['mODBY'] = localStorage.getItem("UserName")
        det['mODLOC'] = localStorage.getItem("Branch")
        let req = {
            companyCode: parseInt(localStorage.getItem("companyCode")),
            collectionName: "vehicle_detail",
            filter: { _id: id },
            update: det
        };
        const res = await firstValueFrom(this.masterService.masterPut("generic/update", req))
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
