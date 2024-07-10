import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { PoServiceControls } from "src/assets/FormControls/po-service";
import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { poserviceDetail } from "src/app/core/models/finance/poservice/poservice";
import { Router } from "@angular/router";
import { rules } from "src/app/Utility/commonFunction/rules/rule";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";

@Component({
  selector: 'app-po-service',
  templateUrl: './po-service.component.html',
  providers: [FilterUtils],
})
export class POServiceComponent implements OnInit {
  PoserviceControls: PoServiceControls;
  poserviceTableForm: UntypedFormGroup;
  jsonControlposerviceArray: FormControls[];
  poserviceDetail: poserviceDetail;
  breadScrums = [
    {
      title: "Add PO Service",
      items: ["PO Service"],
      active: "Add PO Service",
    },
   
  ];
  isUpdate: boolean;
  allFormGrop: FormControls[];
  backPath: string;
  constructor(
    private fb: UntypedFormBuilder,
    private router: Router,

  ) {
    // Initializing prqDetail with some default values or empty object
    this.poserviceDetail = new poserviceDetail({});

    this.initializeFormControl();
    
  }

  ngOnInit(): void {
    this.backPath = "dashboard/Index?tab=6";
  }
  
  initializeFormControl() {
    // Create an instance of PrqEntryControls to get form controls for different sections
    this.PoserviceControls = new PoServiceControls(
      this.poserviceDetail,
      this.isUpdate,
      rules
    );
    // Get form controls for PRQ Entry section
    this.jsonControlposerviceArray = this.PoserviceControls.getPrqEntryFieldControls();
    this.jsonControlposerviceArray.forEach((data) => {
    
    });
    // Create the form group using the form builder and the form controls array
    this.poserviceTableForm = formGroupBuilder(this.fb, [
      this.jsonControlposerviceArray,
    ]);
    this.allFormGrop = this.jsonControlposerviceArray;
   

  }


  functionCallHandler($event) {
    let functionName = $event.functionName; // name of the function , we have to call
    // function of this name may not exists, hence try..catch
    try {
      this[functionName]($event);
    } catch (error) {
      // we have to handle , if function not exists.
      console.log("failed");
    }
  }
  goBack(tabIndex: number): void {
    this.router.navigate(["/dashboard/Index"], {
      queryParams: { tab: tabIndex },
      state: [],
    });
  }
  cancel() {
    this.goBack(6);
  }

}
