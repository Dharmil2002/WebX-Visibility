import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
// import { AddStandardChargesComponent } from '../pop-UP/standard-charges/add-standard-charges.component';
import { AddTripLaneBasedComponent } from '../pop-UP/add-trip-lane-based/add-trip-lane-based.component';

@Component({
  selector: 'app-trip-lane-based',
  templateUrl: './trip-lane-based.component.html'
})
export class TripLaneBasedComponent extends UnsubscribeOnDestroyAdapter implements AfterViewInit{
  dataSource: MatTableDataSource<any>;

  constructor( public dialog: MatDialog) { 
    super()
  }

  ngOnInit(): void {
  }

  tableload=true;
  tabledata = [
    {
      SrNo:1,
      ChargeName:'Test',
      RateType:'Rate Type ',
      VehicleCapacity:'Vehicle Capacity ',
      Amount:'Amount ',
      Action:'',
    },
    {
      SrNo:1,
      ChargeName:'Charge Name',
      RateType:'Rate Type ',
      VehicleCapacity:'Vehicle Capacity ',
      Amount:'Amount ',
      Action:'',
    },
    {
      SrNo:1,
      ChargeName:'Charge Name',
      RateType:'Rate Type ',
      VehicleCapacity:'Vehicle Capacity ',
      Amount:'Amount ',
      Action:'',
    },
    {
      SrNo:1,
      ChargeName:'Charge Name',
      RateType:'Rate Type ',
      VehicleCapacity:'Vehicle Capacity ',
      Amount:'Amount ',
      Action:'',
    },
    {
      SrNo:1,
      ChargeName:'Charge Name',
      RateType:'Rate Type ',
      VehicleCapacity:'Vehicle Capacity ',
      Amount:'Amount ',
      Action:'',
    },
    {
      SrNo:1,
      ChargeName:'Charge Name',
      RateType:'Rate Type ',
      VehicleCapacity:'Vehicle Capacity ',
      Amount:'Amount ',
      Action:'',
    },
    {
      SrNo:1,
      ChargeName:'Charge Name',
      RateType:'Rate Type ',
      VehicleCapacity:'Vehicle Capacity ',
      Amount:'Amount ',
      Action:'',
    },
  ];
  ActionObject = {
    AddRow: false,
    Submit: false,
    Search: false,
  };
  objectKeys = Object.keys;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild("filter", { static: true }) filter: ElementRef;
  @ViewChild(MatSort) sort: MatSort;

  columnHeader = {
    SrNo: {
      Title: "Sr No",
      class: "matcolumncenter",
      Style: "max-width: 10%",
      Key: "index",
    },
    ChargeName: {
      Title: "ChargeName",
      class: "matcolumncenter",
      Style: "max-width: 20%",
      Key: "static",
    },
    RateType: {
      Title: "RateType",
      class: "matcolumncenter",
      Style: "max-width: 20%",
      Key: "static",
    },
    VehicleCapacity: {
      Title: "VehicleCapacity",
      class: "matcolumncenter",
      Style: "max-width: 20%",
      Key: "static",
    },
    Amount: {
      Title: "Amount",
      class: "matcolumncenter",
      Style: "max-width: 20%",
      Key: "static",
    },
    Action: {
      Title: "Action",
      class: "matcolumncenter",
      Style: "max-width: 10%",
      Key: "delete",
    },
  };  

  ngAfterViewInit() {
    this.loadData()
    this.dataSource = new MatTableDataSource<any>(this.tabledata);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ActionDelete(){

  }

  loadData() {
    this.dataSource = new MatTableDataSource(this.tabledata);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    if (this.filter) {
      this.subs.sink = fromEvent(
        this.filter.nativeElement,
        "keyup"
      ).subscribe(() => {
        if (!this.dataSource) {
          return;
        }
        this.dataSource.filter = this.filter.nativeElement.value;
      });
    }
  }

  openDialog(): void {
    this.dialog.open(AddTripLaneBasedComponent, {
      width: '70%',
      height: '70%',
      disableClose:true
    });
  }

  ActionEdit(){
    this.openDialog()
  }
}
