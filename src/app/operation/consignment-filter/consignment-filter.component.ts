import { Component, OnInit } from "@angular/core";
import { UntypedFormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import moment from "moment";
import { FilterUtils } from "src/app/Utility/dropdownFilter";
import { formGroupBuilder } from "src/app/Utility/formGroupBuilder";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { ConsignmentFilterControls } from "src/assets/FormControls/consignment-filter";

@Component({
  selector: "app-consignment-filter",
  templateUrl: "./consignment-filter.component.html",
})
export class ConsignmentFilterComponent implements OnInit {
  breadScrums = [
    {
      title: "consignment filter",
      items: ["Home"],
      active: "consignment",
    },
  ];
  CompanyCode = parseInt(localStorage.getItem("companyCode"));
  UpdateData: any;
  isUpdate: boolean = false;
  FormTitle: string = "Add TDS";
  jsonControlArray: any;
  TdsForm: any;
  ConsignmentFilterForm: any;
  DocumentTypeCode: any;
  DocumentTypeStatus: any;
  constructor(
    private Route: Router,
    private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private masterService: MasterService
  ) {}
  ngOnInit(): void {
    this.initializeFormControl();
  }

  initializeFormControl() {
    const ConsignmentFilter = new ConsignmentFilterControls();
    this.jsonControlArray = ConsignmentFilter.getConsignmentFilterArray();
    // Build the form group using formGroupBuilder function and the values of accordionData
    this.ConsignmentFilterForm = formGroupBuilder(this.fb, [
      this.jsonControlArray,
    ]);
    this.bindDropdown();
  }

  bindDropdown() {
    this.jsonControlArray.forEach((element) => {
      if (element.name == "DocumentType") {
        this.DocumentTypeCode = element.name;
        this.DocumentTypeStatus = element.additionalData.showNameAndValue;
        this.getDocumentTypeData();
      }
    });
  }

  getDocumentTypeData() {
    const data = [
      {
        name: "Operation Tracking",
        value: "1",
      },
      {
        name: "Summary Tracking",
        value: "2",
      },
      {
        name: "POD Tracking",
        value: "3",
      },
    ];
    this.filter.Filter(
      this.jsonControlArray,
      this.ConsignmentFilterForm,
      data,
      this.DocumentTypeCode,
      this.DocumentTypeStatus
    );
  }

  save() {
    if (this.ConsignmentFilterForm.value.DocumentType.value == "1") {
      const sendData = {
        DocNo: this.ConsignmentFilterForm.value.DocketNumber,
        start: moment(this.ConsignmentFilterForm.value.start).format('DD-MM-YYYY HH:mm Z'),
        end: moment(this.ConsignmentFilterForm.value.end).format('DD-MM-YYYY HH:mm Z'),
      };
      console.log('sendData' ,sendData)
      this.Route.navigate(["Operation/ConsignmentOperation"], { state: { data: sendData } });
    } else if (this.ConsignmentFilterForm.value.DocumentType.value == "2") {
      const sendData = {
        DocNo: this.ConsignmentFilterForm.value.DocketNumber,
      };
      this.Route.navigate(["Operation/ConsignmentSummary"], { state: { data: sendData } });
    } else if (this.ConsignmentFilterForm.value.DocumentType.value == "3") {
      const sendData = {
        DocNo: this.ConsignmentFilterForm.value.DocketNumber,
        start: moment(this.ConsignmentFilterForm.value.start).format('DD-MM-YYYY HH:mm Z'),
        end: moment(this.ConsignmentFilterForm.value.end).format('DD-MM-YYYY HH:mm Z'),
      };
      this.Route.navigate(["Operation/ConsignmentPOD"], { state: { data: sendData } });
    } 
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
}
