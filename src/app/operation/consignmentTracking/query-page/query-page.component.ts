import { Component, OnInit } from "@angular/core";
import { ConsignmentqueryControls } from "src/assets/FormControls/consignment-query";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { UntypedFormBuilder } from "@angular/forms";
import moment from "moment";
import { Router } from "@angular/router";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { ControlPanelService } from "src/app/core/service/control-panel/control-panel.service";

@Component({
  selector: "app-query-page",
  templateUrl: "./query-page.component.html",
})
export class QueryPageComponent implements OnInit {
  breadscrums = [
    {
      title: "Tracking Query",
      items: ["Home"],
      active: "Consignment Tracking",
    },
  ];
  jsonControlConsignmentQueryArray: any;
  ConsignmentQueryForm: any;
  DocTypeStatus: any;
  DocTypeCode: any;
  DocCalledAs: any;

  constructor(
    private fb: UntypedFormBuilder,
    private Route: Router,
    private filter: FilterUtils,
    private controlPanel: ControlPanelService
  ) {
    this.DocCalledAs = this.controlPanel.DocCalledAs;
    this.breadscrums = [
      {
        title: `${this.DocCalledAs.Docket} Tracking`,
        items: ["Home"],
        active: `${this.DocCalledAs.Docket} Tracking`,
      }
    ]
  }

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
    this.bindDropdown();
  }
  bindDropdown() {
    this.jsonControlConsignmentQueryArray.forEach((data) => {
      if (data.name === "DocType") {
        this.DocTypeCode = data.name;
        this.DocTypeStatus = data.additionalData.showNameAndValue;
        const DocTypedata = [{ name: "CNote Tracking", value: "CNote" }];

        this.filter.Filter(
          this.jsonControlConsignmentQueryArray,
          this.ConsignmentQueryForm,
          DocTypedata,
          this.DocTypeCode,
          this.DocTypeStatus
        );
      }
    });
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
    const start = this.ConsignmentQueryForm.controls.start.value;
    const end = this.ConsignmentQueryForm.controls.end.value;
    const Docket = this.ConsignmentQueryForm.controls.Docket.value;

    const QueryJson = {
      Docket: Docket ? Docket.replaceAll(/\s/g, "").split(",") : undefined,
      start: moment(start).isValid() ? new Date(start) : undefined,
      end: moment(end).isValid() ? new Date(end) : undefined,
    };
    var url;
    switch (this.ConsignmentQueryForm.value.DocType.value) {
      case "CNote":
        url = "Operation/ConsignmentTracking";
        break;
      default:
      // code block
    }
    this.Route.navigate([url], {
      state: { data: QueryJson },
    });
  }
  cancel() {
    this.ngOnInit();
  }
}
