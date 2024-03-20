import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { GeneralService } from 'src/app/Utility/module/masters/general-master/general-master.service';
import { AutoComplateCommon } from 'src/app/core/models/AutoComplateCommon';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { ViewPrintControl } from 'src/assets/FormControls/view-print';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import Swal from 'sweetalert2';
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

  // async save() {
  //   const req = {
  //     templateName: this.viewTableForm.value.vIEWTYPE.name,
  //     DocNo: this.viewTableForm.value.dOCNO,
  //   };
  //   const url = `${window.location.origin}/#/Operation/view-print?templateBody=${JSON.stringify(req)}`;
  //   window.open(url, '', 'width=1000,height=800');
  // }
  async save() {
    
    // Function to display error message
    const showError = (errorMessage) => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        showConfirmButton: true,
      });
    };

    const docNo = this.viewTableForm.value.dOCNO;
    const viewType = this.viewTableForm.value.vIEWTYPE;

    // Check if DocNo is not entered
    if (!docNo) {
      showError("Please enter DocNo");
      return;
    }

    // Check if templateName is not selected
    if (!viewType) {
      showError("Please select a View Type");
      return;
    }

    // Form is complete, proceed with generating URL
    const req = {
      templateName: viewType.name,
      DocNo: docNo,
    };
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
