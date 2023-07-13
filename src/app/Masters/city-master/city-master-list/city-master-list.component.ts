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
    linkArray = []
    columnHeader = {
        "srNo": "Sr No",
        'cityName': 'City Name',
        'stateName': 'State',
        'zoneName': 'Zone',
        'odaFlag': 'ODA Flag',
        "isActive": "Active Flag",
        "actions": "Actions"
    };
    headerForCsv = {
        'cityId': "City Code",
        'companyCode': "CompanyCode",
        'cityName': "City Name",
        'stateName': "State Name",
        'zoneName': "Zone Name",
        'isActive': "IsActive",
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
        csv: false
    }
    addAndEditPath: string;
    constructor(private masterService: MasterService) {
        this.addAndEditPath = "/Masters/CityMaster/AddCity";
    }
    ngOnInit(): void {
        //throw new Error("Method not implemented.");
        this.getCityDetails();
    }
    getCityDetails() {
        //throw new Error("Method not implemented."); CityData
        // Fetch data from the JSON endpoint
            this.masterService.getJsonFileDetails('masterUrl').subscribe(res => { 
            this.data = res;
            this.csv = this.data['cityData']
            // Extract relevant data arrays from the response
            //const tableArray = this.data['tabledata'];
            this.tableLoad = false;
        }
        );
    }
}