import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { AutoComplateCommon } from 'src/app/core/models/AutoComplateCommon';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { ViewPrintControl } from 'src/assets/FormControls/view-print';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
@Component({
  selector: 'app-view-print',
  templateUrl: './view-print.component.html'
})
export class ViewPrintComponent implements OnInit {
  breadScrums = [
    {
      title: "View Print",
      items: ["Masters"],
      active: "View Print",
    },
  ];
  viewTableForm: UntypedFormGroup;
  jsonControlViewArray: any;
  viewprintFormControls: ViewPrintControl;
  viewName: any;
  viewStatus: any;
  viewTable: any;
  json = [
    { "module": "View-Print-0001", "collectionName": "prq_summary", "branch": "bRCD", "templateName": 'prq' },
    { "module": "View-Print-0002", "collectionName": "thc_summary", "branch": "cLOC", "templateName": 'thc' },
    { "module": "View-Print-0003", "collectionName": "dockets", "branch": "oRGN", "templateName": 'docket' },
    { "module": "View-Print-0004", "collectionName": "voucher_trans", "branch": "bRC", "templateName": 'voucher' },
    { "module": "View-Print-0005", "collectionName": "job_detail", "templateName": 'job' }
  ]

  constructor(
    private fb: UntypedFormBuilder,
    private generalService: GeneralService,
    private filter: FilterUtils,
    private storage: StorageService,
    private masterServices: MasterService,
  ) {
    this.initializeFormControl();
  }

  ngOnInit(): void {
    this.getDropDownList()
  }

  initializeFormControl() {
    this.viewprintFormControls = new ViewPrintControl();
    this.jsonControlViewArray = this.viewprintFormControls.getFormControlsView();
    this.jsonControlViewArray.forEach(data => {
      if (data.name === 'vIEWTYPE') {
        this.viewName = data.name;
        this.viewStatus = data.additionalData.showNameAndValue;
      }
    });
    this.viewTableForm = formGroupBuilder(this.fb, [this.jsonControlViewArray]);
  }

  /*fetches and filters dropdown data based on the values of
  'dOCNO' and 'vIEWTYPE' from the viewTableForm.*/
  // async getDropdownData() {
  // Extracting values from the viewTableForm
  //   const { dOCNO, vIEWTYPE } = this.viewTableForm.value;
  // Finding the type from the json array based on the selected 'vIEWTYPE' value  
  // const type = this.json.find(x => x.module === vIEWTYPE.value);
  // Constructing the request object for fetching data from the MongoDB collection
  //   const req = {
  //     "companyCode": this.storage.companyCode,
  //     "collectionName": type.collectionName,
  //     filter: { "docNo": { "D$regex": `${dOCNO}`, "D$options": "i" }, [type['branch']]: this.storage.branch }
  //   };
  // Fetching data from the MongoDB collection using masterServices
  //   const Res = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", req));
  // Filtering and updating the viewTableForm based on the fetched data
  //   this.filter.Filter(
  //     this.jsonControlViewArray,
  //     this.viewTableForm,
  // Mapping the fetched data to a format suitable for the dropdown
  //     Res.data.map((x) => { return { name: x.docNo, value: x.docNo } }),
  //     'dOCNO',
  //     false
  //   );
  // }

  /*Bind dropdown of view type from general master*/
  async getDropDownList() {
    // Resetting the value of the 'dOCNO' control to an empty string
    this.viewTableForm.controls.dOCNO.setValue("");
    // Retrieving view types from the 'General_master' collection
    const viewType: AutoComplateCommon[] = await this.generalService.getDataForMultiAutoComplete("General_master", { codeType: "View Print" }, "codeDesc", "_id");
    // Filtering the data and updating the viewTableForm
    this.filter.Filter(
      this.jsonControlViewArray,
      this.viewTableForm,
      viewType,
      this.viewName,
      this.viewStatus
    );
  }

  async save() {
    const { vIEWTYPE } = this.viewTableForm.value;
    const type = this.json.find((x) => x.module === vIEWTYPE.value);
    // const docNo = { dOCNO: this.viewTableForm.value.dOCNO };
    const docNo = this.viewTableForm.value.dOCNO;
    const req = {
      templateName: type.templateName,
      DocNo: docNo,
    };
    console.log("req", req);
    const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(req)}`;
    window.open(url, '', 'width=1000,height=800');
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

}
