import { Component, OnInit } from "@angular/core";
import moment from "moment";
import { firstValueFrom } from "rxjs";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
import Swal from "sweetalert2";

@Component({
    selector: 'app-vehicle-master-list',
    templateUrl: './vehicle-master-list.component.html'
})
export class VehicleMasterListComponent implements OnInit {
    csv: any[];
    tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
    // Define column headers for the table
    columnHeader = {
        eNTDT: {
            Title: "Created Date",
            class: "matcolumncenter",
            Style: "min-width:15%",
           // datatype: "datetime"
        },
        vehicleNo: {
            Title: "Vehicle No.",
            class: "matcolumnleft",
            Style: "min-width:15%",
        },
        vehicleType: {
            Title: "Vehicle Type",
            class: "matcolumnleft",
            Style: "min-width:15%",
            datatype: "string"
        },
        vendorName: {
            Title: "Vendor Name",
            class: "matcolumnleft",
            Style: "min-width:15%",
        },
        vendorType: {
            Title: "Vendor Type",
            class: "matcolumnleft",
            Style: "min-width:15%",
        },
        isActive: {
            type: "Activetoggle",
            Title: "Active Flag",
            class: "matcolumncenter",
            Style: "min-width:15%",
            functionName: "isActiveFuntion"
        },
        actions: {
            Title: "Actions",
            class: "matcolumncenter",
            Style: "min-width:15%",
        },
    }
    staticField = ["eNTDT", "vehicleNo", "vehicleType", "vendorName", "vendorType"]

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
    constructor(private masterService: MasterService, private storage: StorageService) {
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
            "companyCode": this.storage.companyCode,
            "collectionName": "vehicle_detail",
            "filter": { companyCode: this.storage.companyCode }
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
        let id = det.data._id;
        // Remove the "id" field from the form controls
        delete det.data._id;
        delete det.data.eNTDT;
        det.data['mODDT'] = new Date()
        det.data['mODBY'] = this.storage.userName
        det.data['mODLOC'] = this.storage.branch
        let req = {
            companyCode: this.storage.companyCode,
            collectionName: "vehicle_detail",
            filter: { _id: id },
            update: det.data
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

    functionCallHandler($event) {
        let functionName = $event.functionName;
        try {
            this[functionName]($event);
        } catch (error) {
            console.log("failed");
        }
    }
}
