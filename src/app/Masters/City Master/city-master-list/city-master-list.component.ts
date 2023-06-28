import { Component, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';


@Component({
    selector: 'app-city-master-list',
    templateUrl: './city-master-list.component.html'
})

export class CityMasterListComponent implements OnInit {
    jsonUrl = '../../../assets/data/masters-data.json'
    data: [] | any;
    csv: any[];
    tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation
    toggleArray = ["isActive"]
    linkArray = []

    columnHeader = {
        "srNo": "Sr No",
        'cityName': 'City Name',
        'stateName': 'State',
        'zoneName': 'Zone',
        'ODAFlag': 'ODA Flag',
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

    breadscrums = [
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
    cityActiveFlag: any;
    addAndEditPath: string;
    constructor(private http: HttpClient){
        this.addAndEditPath = "/Masters/CityMaster/AddCity";
    }


    ngOnInit(): void {
        //throw new Error("Method not implemented.");
        this.GetCityDetails();
    }

    GetCityDetails() {
        //throw new Error("Method not implemented."); CityData
        // Fetch data from the JSON endpoint
        this.http.get(this.jsonUrl).subscribe((res: any) => {
            this.data = res;
            this.csv = this.data['CityData']
            // Extract relevant data arrays from the response
            //const tableArray = this.data['tabledata'];
            this.tableload = false;
        }
        );
    }
}