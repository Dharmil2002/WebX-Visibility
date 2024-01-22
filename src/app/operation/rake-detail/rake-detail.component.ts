// Import required modules and classes
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { GenericService } from 'src/app/core/service/generic-services/generic-services';
import { rakeUpdationModel } from 'src/app/Models/rake-updation/rake-updation';



@Component({
  selector: 'app-rake-detail',
  templateUrl: './rake-detail.component.html'
})
// Define the RakeDetailComponent class
export class RakeDetailComponent implements OnInit {
  // Flag to indicate if data is still loading, used to show loading animation
  tableLoad = true;

  // Metadata for the table
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };

  // Array to store table data
  tableData: any[];

  // Path for adding and editing records
  addAndEditPath: string;

  // Array of links for actions
  linkArray = [{ Row: "Action", Path: "Operation/CHAEntry" }];

  // Configuration for dynamic controls
  dynamicControls = {
    add: false,
    edit: false,
    csv: false,
  };
  height = '100vw';
  width = '100vw';
  maxWidth: '232vw'
  // Column headers for the table
  columnHeader = {};

  // List of static fields
  staticField = [
    "code",
    "name"
  ];

  // Constructor for the component
  constructor(@Inject(MAT_DIALOG_DATA) public item: any,
  private rakeUpdation:rakeUpdationModel,
  private genericService:GenericService,
  public dialogRef: MatDialogRef<GenericTableComponent> 
  ) { 
     this.getRateDetail(item);
  }

  // Angular lifecycle hook: ngOnInit
  ngOnInit(): void {
    // Initialize component properties and perform any necessary setup
  }
  async getRateDetail(item){
    const type=this.genericService.getSharedData();
    this.columnHeader=this.rakeUpdation.getcolumnHeader(type.title);
    this.tableData=item[type.title].flatMap((x)=>x).filter(item => typeof item === 'object' && item.code && item.name)
    .map(item => ({ code: item.code, name: item.name }));
    this.tableLoad=false;
  }
  close(){
    this.dialogRef.close();
  }
 
}
