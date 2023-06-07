import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-runsheet-generated',
  templateUrl: './runsheet-generated.component.html',
})
export class RunsheetGeneratedComponent implements OnInit {
  jsonUrl = '../../../assets/data/runsheetGenerated.json'
  tableload = false;
  csv: any[];
  data: [] | any;
  tabledata: any
  columnHeader = {
    "RunSheet": "Run Sheet",
    "Cluster": "Cluster",
    "Shipments": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT",
    "Print": "Print"
  }
  //  #region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "RunSheet": "Run Sheet",
    "Cluster": "Cluster",
    "Shipments": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT",
  }
  //declaring breadscrum
  breadscrums = [
    {
      title: "Run Sheet Generated",
      items: ["Home"],
      active: "Pickup/Delivery Run Sheet Generated"
    }
  ]
  toggleArray=[]
  menuItems=[]
  linkArray=[]
  dynamicControls = {
    add: false,
    edit: false,
    //csv: true
  }
  loadingData: any;
  formdata: any;
  constructor(private Route: Router,private http: HttpClient) { 
    this.http.get(this.jsonUrl).subscribe(res => {
      this.data = res;
      let tableArray = this.data['tabledata'];
      const newArray = tableArray.map(({ hasAccess, ...rest }) => ({ isSelected: hasAccess, ...rest }));
      this.csv = newArray;
      this.tableload = false;
    }); 
  }
  ngOnInit(): void {
  }
  Close(): void {
    window.history.back();
  }
}
