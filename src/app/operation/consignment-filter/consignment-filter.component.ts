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
    const DocketNumber = this.ConsignmentFilterForm.value.DocketNumber?this.ConsignmentFilterForm.value.DocketNumber:undefined
    const start = this.ConsignmentFilterForm.value.start?new Date(this.ConsignmentFilterForm.value.start):undefined
    const end = this.ConsignmentFilterForm.value.end?new Date(this.ConsignmentFilterForm.value.end):undefined
    
    if (this.ConsignmentFilterForm.value.DocumentType.value == "1") {
      const sendData = {
        DocNo: DocketNumber,
        start: start,
        end: end,
      };
      this.Route.navigate(["Operation/ConsignmentOperation"], { state: { data: sendData } });
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
