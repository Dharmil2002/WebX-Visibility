import { Component, OnInit } from "@angular/core";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from "sweetalert2";

@Component({
    selector: 'app-state-master-list',
    templateUrl: './state-master-list.component.html',
})
export class StateMasterListComponent implements OnInit {
    jsonUrl = '../../../assets/data/masters-data.json'
    data: [] | any;
    tableData: any[];
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
            "gstWiseStateCode": "GST Wise State Code",
            "isActive": "Active Flag",
        }

    headerForCsv = {
        "srNo": "Sr No",
        "stateCode": "State Code",
        "stateName": "State Name",
        "stateAlias": "State Alias",
        "stateType": "State Type",
        "countryName": "Country Name",
        "gstWiseStateCode": "GST Wise State Code",
        "isActive": "Active Flag",
        "actions": "Actions",
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
        edit: true,
        csv: false
    }

    toggleArray = ["isActive"]
    linkArray = []
    addAndEditPath: string;

    constructor(private masterService: MasterService) {
        this.addAndEditPath = "/Masters/StateMaster/AddState";
    }

    ngOnInit(): void {
        this.getStateDetails();
    }

    getStateDetails() {
        let req = {
            "companyCode": this.companyCode,
            "type": "masters",
            "collection": "state_detail"
        }
        this.masterService.masterPost('common/getall', req).subscribe({
            next: (res: any) => {
                if (res) {
                    // Generate srno for each object in the array
                    const dataWithSrno = res.data.map((obj, index) => {
                        obj.isActive = obj.activeflag == 'Y' ? true : false
                        return {
                            ...obj,
                            srNo: index + 1
                        };
                    });
                    this.tableData = dataWithSrno;
                    this.tableLoad = false;
                }
            }
        })
    }

    IsActiveFuntion(det) {
        let id = det.id;
        // Remove the "id" field from the form controls
        delete det.id;
        det.activeflag = det.isActive == true ? "Y" : "N";
        let req = {
            companyCode: this.companyCode,
            type: "masters",
            collection: "state_detail",
            id: id,
            updates: det
        };
        this.masterService.masterPut('common/update', req).subscribe({
            next: (res: any) => {
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
        });
    }
}