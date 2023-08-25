import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { HandoverControl } from 'src/assets/FormControls/hand-over-control';
@Component({
  selector: 'app-handed-over',
  templateUrl: './handed-over.component.html'
})
export class HandedOverComponent implements OnInit {
  HandFormControls: HandoverControl;
  jsonControlArray: any;
  
  handTableForm: UntypedFormGroup;
    columnHeader = {
      checkBoxRequired:{
        Title: "Select",
        class: "matcolumnleft",
        Style: "min-width:200px",
      },
      ContainerNo: {
        Title: "Container No",
        class: "matcolumnleft",
        Style: "min-width:200px",
      },
      IsEmpty: {
        Title: "Is Empty",
        class: "matcolumnleft",
        Style: "min-width:200px",
      }
    }
    staticField = [
      "ContainerNo",
      "IsEmpty"
    ]
  breadScrums = [
    {
      title: "Handed over to Liner",
      items: ["Home"],
      active: "Handed over",
    },
  ];
  METADATA = {
    checkBoxRequired: true,
    noColumnSort: ["checkBoxRequired"],
  };
  dynamicControls = {
    add: false,
    edit: true,
    csv: false,
  };
tableData=[{
  "ContainerNo":"2843885785P3848754",
  "IsEmpty":"Yes"
},
{
  "ContainerNo":"2843845785P3848778",
  "IsEmpty":"Yes"
},
{
  "ContainerNo":"2843885785P3848005",
  "IsEmpty":"Yes"
}]
  tableLoad: boolean=true;
  constructor(private router: Router, private fb: UntypedFormBuilder, private masterService: MasterService) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      const data = this.router.getCurrentNavigation()?.extras?.state.data.columnData;
      this.breadScrums[0].title=data.Action
    }
    this.tableLoad=false;
    this.initializeFormControl();
   
  }

  ngOnInit(): void {
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call

    // function of this name may not exists, hence try..catch 
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }

  initializeFormControl() {
    this.HandFormControls = new HandoverControl();
    // Get form controls for job Entry form section
    this.jsonControlArray = this.HandFormControls.getHandOverArrayControls();
    // Build the form group using formGroupBuilder function
    this.handTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
   
  }
  cancel() {
    window.history.back();
  }
save(){

}
}
