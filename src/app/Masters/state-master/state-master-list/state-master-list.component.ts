import { Component, OnInit } from "@angular/core";
import Swal from "sweetalert2";
import { MasterService } from "src/app/core/service/Masters/master.service";

@Component({
    selector: 'app-state-master-list',
    templateUrl: './state-master-list.component.html',
})
export class StateMasterListComponent implements OnInit {
    data: [] | any;
    tableData: any[];
    csv: any[];
    tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
    // Define column headers for the table
    companyCode: any = parseInt(localStorage.getItem("companyCode"));
    columnHeader =
        {
            "srNo": "Sr No",
            "stateCode": "State Code",
            "stateName": "State Name",
            "stateAlias": "State Alias",
            "stateType": "State Type",
            "country": "Country Name",
            "zone":"Zone",
            "gstWiseStateCode": "GST Wise State Code",
            "isActive": "Active Flag",
            //"actions": "Actions",
        }

    headerForCsv = {
        "srNo": "Sr No",
        "stateCode": "State Code",
        "stateName": "State Name",
        "stateAlias": "State Alias",
        "stateType": "State Type",
        "countryName": "Country Name",
        "zone":"Zone",
        "gstWiseStateCode": "GST Wise State Code",
        "isActive": "Active Flag",
        //"actions": "Actions",
    }
    breadScrums = [
        {
            title: "State Master",
            items: ["Master"],
            active: "State Master",
        }
    ];

    dynamicControls = {
        add: false,
        edit: false,
        csv: true
    }

    toggleArray = ["isActive"]
    linkArray = []
    addAndEditPath: string;
    csvFileName: string;

    constructor(private masterService: MasterService) {
        this.addAndEditPath = "/Masters/StateMaster/AddState";
    }

    ngOnInit(): void {
        this.csvFileName = "State Details"
        this.getStateDetails();
    }

    async getStateDetails() {
        let req = {
            companyCode: this.companyCode,
            collectionName: "state_detail",
            filter: {}
        };
        const res = await this.masterService.masterPost("generic/get", req).toPromise()
        // Generate srno for each object in the array
        const dataWithSrno = res.data.map((obj, index) => {
            obj.isActive = obj.activeflag == 'Y' ? true : false
            return {
                ...obj,
                srNo: index + 1
            };
        });
        this.tableData = dataWithSrno;
        this.csv = this.tableData;
        this.tableLoad = false;
    }

    async IsActiveFuntion(det) {
        let id = det._id;
        // Remove the "id" field from the form controls
        delete det._id;
        det.activeflag = det.isActive == true ? "Y" : "N";
        let req = {
            companyCode: this.companyCode,
            collectionName: "state_detail",
            filter: {
                _id: id,
            },
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
        }
    }
}
