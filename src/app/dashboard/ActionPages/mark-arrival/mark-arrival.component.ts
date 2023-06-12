import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { utilityService } from 'src/app/Utility/utility.service';
import { GenericTableComponent } from 'src/app/shared-components/Generic Table/generic-table.component';
import { MarkArrivalControl } from 'src/assets/FormControls/MarkArrival';
import{CnoteService} from 'src/app/core/service/Masters/CnoteService/cnote.service'

@Component({
  selector: 'app-mark-arrival',
  templateUrl: './mark-arrival.component.html',
})

export class MarkArrivalComponent implements OnInit {
  jsonUrl = '../../../assets/data/arrival-dashboard-data.json';
  MarkArrivalTableForm: UntypedFormGroup;
  MarkArrivalTable: any;
  arrivalData:any;
  departature: any;
  constructor(public dialogRef: MatDialogRef<GenericTableComponent>,public dialog: MatDialog,private service: utilityService,
    private http: HttpClient, @Inject(MAT_DIALOG_DATA) public item: any, private fb: UntypedFormBuilder,private Route:Router,private CnoteService:CnoteService) {
      debugger;
    this.MarkArrivalTable = item;
  }
  jsonControlArray: any;
  IntializeFormControl() {
    const MarkArrivalFormControls = new MarkArrivalControl();
    this.jsonControlArray = MarkArrivalFormControls.getMarkArrivalsertFormControls();
    this.MarkArrivalTableForm = formGroupBuilder(this.fb, [this.jsonControlArray])
  }
  
  ngOnInit(): void {
    this.IntializeFormControl()
    this.MarkArrivalTableForm.controls.Vehicle.setValue(this.MarkArrivalTable.VehicleNo)
    this.MarkArrivalTableForm.controls.ETA.setValue(this.MarkArrivalTable.ETAATA)
    this.MarkArrivalTableForm.controls.Route.setValue(this.MarkArrivalTable.Route)
    this.MarkArrivalTableForm.controls.TripID.setValue(this.MarkArrivalTable.TripID)
  }
  functionCallHandler($event) {
    // console.log("fn handler called", $event);

    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    // we can add more arguments here, if needed. like as shown
    // $event['fieldName'] = field.name;

    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  getPreviousData(arrivealDetail){
    this.http.get(this.jsonUrl).subscribe(data => {
      // Find the specific record you want to update
      this.arrivalData=data;
    
      // Check if the record exists
        // Update the desired fields, keeping the other fields unchanged
        this.arrivalData.arrivalData.forEach(element => {
          if(element.VehicleNo===arrivealDetail.Vehicle){
             element.Action='Arrival Scan'
          }
        });
        this.dialogRef.close(this.arrivalData.arrivalData)
    });
 
     
  }

  save() {
    this.getPreviousData(this.MarkArrivalTableForm.value);
  
  }

  cancel() {
    this.dialogRef.close()
  }
  goBack(tabIndex: number): void {
    this.Route.navigate(['/dashboard/GlobeDashboardPage'], { queryParams: { tab: tabIndex},state:this.departature });
  }
}
