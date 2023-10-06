import { Component, OnInit } from '@angular/core';
import { ViewPrintComponent } from '../view-print/view-print.component';
import { getVehicleStatusFromApi, AssignVehiclePageMethods, bindMarketVehicle } from './assgine-vehicle-utility';
import { OperationService } from 'src/app/core/service/operations/operation.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { AddMarketVehicleComponent } from '../add-market-vehicle/add-market-vehicle.component';

@Component({
  selector: 'app-assign-vehicle-page',
  templateUrl: './assign-vehicle-page.component.html'
})
export class AssignVehiclePageComponent implements OnInit {
  companyCode = parseInt(localStorage.getItem("companyCode"));
  branchCode = localStorage.getItem("Branch");
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  addFlag = true;
  dynamicControls = {
    add: true,
    edit: true,
    csv: false,
  };
  breadScrums = [
    {
      title: "Available Vehicle for Assignment",
      items: ["Home"],
      active: "Vehicle Assign",
    },
  ];
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table >
  columnHeader = this._assignVehiclePageMethods.columnHeader[0];
  staticField = Object.keys(this.columnHeader)

  linkArray = [
    { Row: 'action' }
  ];
  menuItems = [{ label: 'action', componentDetails: ViewPrintComponent }];
  tableData: any;
  NavData: any;
  constructor(private Route: Router, private _operationService: OperationService, public dialog: MatDialog, private _assignVehiclePageMethods: AssignVehiclePageMethods
  ) {
   
     this.staticField.pop();
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
      this.NavData = this.Route.getCurrentNavigation()?.extras?.state.data;
    }
    
  }
  ngOnInit(): void {
    this.fetchAvailabelVehicles();
  }

  async fetchAvailabelVehicles() {

    try {
      const vehicleStatusData = await getVehicleStatusFromApi(this.companyCode, this._operationService);
      if (vehicleStatusData.length > 0) {
        const [fromCity, ToCity] = this.NavData.fromToCity.split('-');
        this.tableData = vehicleStatusData.map(item => ({ ...item, action: 'Assign', fromCity: fromCity, toCity: ToCity, distance: 0,isMarket:false }));
        this.tableLoad = false;
      }
      else {
        Swal.fire({
          icon: "question",
          title: "Add Market Vehicle",
          text: "No vehicles are currently available at this location.Please add market a vehicle  using '+' Button.",
          confirmButtonText: "OK",
          showConfirmButton: true,
        })
        this.tableLoad = false;
      }
    } catch (error) {
      // Handle API call errors here
      console.error('Error fetching vehicle status:', error);
      // You can also set an error state or display a relevant message to the user
    }
  }
  toggleMarketVehicle() {
    // Add your event code for "OK" here
    // This code will run when the user clicks "OK"
    const dialogref = this.dialog.open(AddMarketVehicleComponent, {
      data: this.NavData,
    });
    dialogref.afterClosed().subscribe((result) => {
      this.bindTableData(result)
    });

  }

  async bindTableData(result: any) {
    const tableData = await bindMarketVehicle(result);
    const fromToCitySplit = this.NavData.fromToCity.split('-');

    if (fromToCitySplit.length !== 2) {
      // Handle the case where the split doesn't result in exactly 2 parts
      console.error('Invalid fromToCity format');
      return;
    }

    const [fromCity, toCity] = fromToCitySplit;
    const marketData = [tableData].map(item => ({ ...item, action: 'Assign', fromCity, toCity, distance: 0,isMarket:true }));

    this.tableData = this.tableData?this.tableData.concat(marketData):marketData;
    this.tableLoad = false;
  }

  addPopUp() {
    this.toggleMarketVehicle()

  }

}
