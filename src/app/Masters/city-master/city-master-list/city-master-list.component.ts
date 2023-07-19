import { Component, OnInit } from "@angular/core";
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
    selector: 'app-city-master-list',
    templateUrl: './city-master-list.component.html'
})

export class CityMasterListComponent implements OnInit {
    data: [] | any;
    csv: any[];
    tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
    toggleArray = ["isActive", "odaFlag"]
    tableData: any[];
    linkArray = [];
    csvFileName: string;
    columnHeader = {
        "srNo": "Sr No",
        'cityName': 'City Name',
        'state': 'State',
        'zone': 'Zone',
        'odaFlag': 'ODA Flag',
        "isActive": "Active Flag",
        "actions": "Actions"
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
        add: true,
        edit: true,
        csv: true
    }
    addAndEditPath: string;
    constructor(private masterService: MasterService) {
        this.addAndEditPath = "/Masters/CityMaster/AddCity";
    }
    ngOnInit(): void {
        this.csvFileName = "City Details" 
        this.getCityDetails();
    }
    getCityDetails() {
        let req = {
            "companyCode": 10065,
            "type": "masters",
            "collection": "city"
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