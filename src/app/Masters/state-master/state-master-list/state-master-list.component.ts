import { Component, OnInit } from "@angular/core";
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-state-master-list',
    templateUrl: './state-master-list.component.html',
})
export class StateMasterListComponent implements OnInit {
    jsonUrl = '../../../assets/data/masters-data.json'
    data: [] | any;
    csv: any[];
    tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation
    // Define column headers for the table
    columnHeader =
        {
            "srNo": "Sr No",
            "stateCode": "State Code",
            "stateName": "State Name",
            "stateAlias": "State Alias",
            "stateType": "State Type",
            "countryName": "Country Name",
            "GSTWiseStateCode": "GST Wise State Code",
            "isActive": "Active Flag",
            "actions": "Actions",
        }

    headerForCsv = {
        "srNo": "Sr No",
        "stateCode": "State Code",
        "stateName": "State Name",
        "stateAlias": "State Alias",
        "stateType": "State Type",
        "countryName": "Country Name",
        "GSTWiseStateCode": "GST Wise State Code",
        "isActive": "Active Flag",
        "actions": "Actions",
    }
    breadscrums = [
        {
            title: "State Master",
            items: ["Master"],
            active: "State Master",
        }
    ];

    dynamicControls = {
        add: true,
        edit: true,
        csv: false
    }

    toggleArray = ["isActive"]
    linkArray = []
    addAndEditPath: string;

    constructor(private http: HttpClient) {
        this.addAndEditPath = "/Masters/StateMaster/AddState";
    }

    ngOnInit(): void {
        //throw new Error("Method not implemented.");
        this.GetStateDetails();
    }

    GetStateDetails() {
        //throw new Error("Method not implemented.");
        // Fetch data from the JSON endpoint
        this.http.get(this.jsonUrl).subscribe((res: any) => {
            this.data = res;
            this.csv = this.data['StateData']
            // Extract relevant data arrays from the response
            //const tableArray = this.data['tabledata'];
            this.tableload = false;

        }
        );
    }
}