import { Component, OnInit } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { formatDocketDate } from "src/app/Utility/commonFunction/arrayCommonFunction/uniqArray";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";
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
    companyCode: any = 0;
    tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
    // Define column headers for the table
    columnHeader = {
        eNTDT: {
            Title: "Created Date",
            class: "matcolumncenter",
            Style: "min-width:15%",
            datatype: "datetime"
        },
        vehicleTypeCode: {
            Title: "Vehicle Type Code",
            class: "matcolumncenter",
            Style: "min-width:15%",
        },
        vehicleTypeName: {
            Title: "Vehicle Type Name",
            class: "matcolumnleft",
            Style: "min-width:15%",
            datatype: "string"
        },
        isActive: {
            type: "Activetoggle",
            Title: "Active",
            class: "matcolumncenter",
            Style: "min-width:15%",
            functionName: "isActiveFuntion"
        },
        actions: {
            Title: "Actions",
            class: "matcolumncenter",
            Style: "min-width:15%",
        }
    }
    staticField = ["eNTDT", "vehicleTypeCode", "vehicleTypeName"]
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
    constructor(private masterService: MasterService, private storage: StorageService) {
        this.companyCode = this.storage.companyCode;
        this.addAndEditPath = "/Masters/VehicleTypeMaster/AddVehicleTypeMaster";
    }
    ngOnInit(): void {
        this.getVehicleTypeDetails();
        this.csvFileName = "Vehicle Type Details"  //setting csv file Name so file will be saved as per this name
    }

    //#region to get Vehicle Type list
    async getVehicleTypeDetails() {
        try {
            const req = {
                companyCode: this.companyCode,
                filter: { companyCode:this.companyCode },
                collectionName: "vehicleType_detail"
            };

            const res = await firstValueFrom(this.masterService.masterPost('generic/get', req));

            if (res && res.data) {
                const data = res.data;

                const dataWithFormattedDate = data.map(obj => ({
                    ...obj,
                    eNTDT: obj.eNTDT ? formatDocketDate(obj.eNTDT) : ''
                })).sort((a, b) => b._id.localeCompare(a._id));

                // Use latestUpdatedDate as needed
                this.csv = dataWithFormattedDate;
                this.tableData = dataWithFormattedDate;
            }
        } catch (error) {
            // Handle errors if required
            console.error('Error fetching vehicle type details:', error);
        } finally {
            this.tableLoad = false;
        }
    }
    //#endregion
    async isActiveFuntion(det) {
        let id = det.data._id;
        // Remove the "id" field from the form controls
        delete det.data._id;
        delete det.data.eNTDT
        det.data['mODDT'] = new Date()
        det.data['mODBY'] = this.storage.userName
        det.data['mODLOC'] = this.storage.branch
        let req = {
            companyCode: this.companyCode,
            collectionName: "vehicleType_detail",
            filter: { _id: id },
            update: det.data
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

    functionCallHandler($event) {
        let functionName = $event.functionName;
        try {
            this[functionName]($event);
        } catch (error) {
            console.log("failed");
        }
    }
}