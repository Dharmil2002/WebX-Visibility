import { Component, OnInit } from "@angular/core";
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from "sweetalert2";

@Component({
    selector: 'app-city-master-list',
    templateUrl: './city-master-list.component.html'
})

export class CityMasterListComponent implements OnInit {
    companyCode: any = parseInt(localStorage.getItem("companyCode"));
    data: [] | any;
    csv: any[];
    tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
    toggleArray = ["isActive"]
    tableData: any[];
    linkArray = [];
    csvFileName: string;
    addAndEditPath: string;

    columnHeader = {
        "srNo": "Sr No",
        'cityName': 'City Name',
        'state': 'State',
        'zone': 'Zone',
        'odaFlag': 'ODA Flag',
        "isActive": "Active Flag",
        //"actions": "Actions"
    };
    headerForCsv = {
        'cityId': "City Code",
        'companyCode': "CompanyCode",
        'cityName': "City Name",
        'state': "State Name",
        'zone': "Zone Name"
    }

    breadScrums = [
        {
            title: "City Master",
            items: ["Home"],
            active: "City Master",
        },
    ];

    dynamicControls = {
        add: false,
        edit: false,
        csv: true
    }
    constructor(private masterService: MasterService) {
        this.addAndEditPath = "/Masters/CityMaster/AddCity";
    }

    ngOnInit(): void {
        this.csvFileName = "City Details"
        this.getCityDetails();
    }

    async getCityDetails() {
        let req = {
            "companyCode": this.companyCode,
            "collectionName": "city_detail",
            "filter": {}
        }
        const res = await this.masterService.masterPost("generic/get", req).toPromise()
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

    IsActiveFuntion(det) {
        let id = det._id;
        // Remove the "id" field from the form controls
        delete det.id;
        delete det.srNo;
        let req = {
            companyCode: parseInt(localStorage.getItem("companyCode")),
            type: "masters",
            collectionName: "city_detail",
            filter: {
                _id: id
            },
            update: det
        };
        this.masterService.masterPut('generic/update', req).subscribe({
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