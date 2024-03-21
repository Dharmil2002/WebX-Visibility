import { Component, OnInit } from "@angular/core";
import { ConsignmentqueryControls } from "src/assets/FormControls/consignment-query";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { UntypedFormBuilder } from "@angular/forms";
import moment from "moment";
import { Router } from "@angular/router";

@Component({
  selector: "app-query-page",
  templateUrl: "./query-page.component.html",
})
export class QueryPageComponent implements OnInit {
  breadscrums = [
    {
      title: "Consignment Query Page",
      items: ["Home"],
      active: "Consignment Tracking",
    },
  ];
  jsonControlConsignmentQueryArray: any;
  ConsignmentQueryForm: any;
  constructor(private fb: UntypedFormBuilder,private Route: Router,) {}

  ngOnInit(): void {
    this.initializeFormControl();
  }
  initializeFormControl() {
    const ConsignmentQueryFormControls = new ConsignmentqueryControls();
    this.jsonControlConsignmentQueryArray =
      ConsignmentQueryFormControls.getConsignmentqueryArray();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.ConsignmentQueryForm = formGroupBuilder(this.fb, [
      this.jsonControlConsignmentQueryArray,
    ]);
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  

  save(event) {
    // this.cnoteTableForm.controls.start.value
    const start = this.ConsignmentQueryForm.controls.start.value
    const end = this.ConsignmentQueryForm.controls.end.value
    const Docket = this.ConsignmentQueryForm.controls.Docket.value
    console.log('start' , start)

    const QueryJson = {
      Docket: Docket || undefined,
      start: moment(start).isValid() ? new Date(start) : undefined,
      end: moment(end).isValid() ? new Date(end): undefined,
    };
    this.Route.navigate(["Operation/ConsignmentTracking"], { state: { data: QueryJson } });
  }
  cancel() {
    this.ngOnInit()
  }
}
