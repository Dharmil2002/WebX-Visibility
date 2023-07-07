import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DCRControl } from 'src/assets/FormControls/dcrControl';
import Swal from 'sweetalert2';
import { ReAllocateDcrComponent } from '../re-allocate-dcr/re-allocate-dcr.component';

@Component({
  selector: 'app-dcr-detail-page',
  templateUrl: './dcr-detail-page.component.html'
})
export class DcrDetailPageComponent implements OnInit {
  dcrDetailForm: UntypedFormGroup;
  jsonControlArray: any;
  dcrDetailsFormControls: DCRControl;
  // Breadcrumbs
  breadScrums = [
    {
      title: "DCR Detail",
      items: ["Document Control"],
      active: "DCR Detail",
    },
  ];
  columnHeader = {
    "actionDesc": "Action",
    'actionDate': 'Date',
    'bookNumber': 'Book Number',
    'fromTo': 'Series Start-End',
    'location': 'Allocation Location',
    "category": "Allocation Category",
    "person": "Person"
  };
  dynamicControls = {
    add: false,
    edit: false,
    csv: false
  };
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  toggleArray = [];
  linkArray = [];
  data: any;
  historyData: any;
  historyDet: any;
  type: any;
  action: any;
  actionStatus: any;
  constructor(private fb: UntypedFormBuilder, private route: Router, private masterService: MasterService, public dialog: MatDialog) {
    if (this.route.getCurrentNavigation()?.extras != null) {
      this.type = this.route.getCurrentNavigation().extras?.state?.additionalData;
      this.data = this.route.getCurrentNavigation().extras?.state?.data;
      if (this.type !== 'Manage') {
        this.getDcrHistoryData();
      }
    }
  }

  ngOnInit(): void {
    this.intializeFormControls();
    this.bindData();
  }
  // Handle function calls
  functionCallHandler($event) {
    let field = $event.field;                   // the actual formControl instance
    let functionName = $event.functionName;     // name of the function , we have to call

    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  intializeFormControls() {
    this.dcrDetailsFormControls = new DCRControl();
    this.jsonControlArray = this.dcrDetailsFormControls.getDcrDetailsFormControls();
    this.jsonControlArray.forEach(control => {
      if (this.type === 'Manage' && control.name === 'action') {
        control.generatecontrol = true;
      }
    });
    this.dcrDetailForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  bindData() {
    const locdet = this.data?.allotedBy && this.data?.allotedByName ? `${this.data.allotedBy}-${this.data.allotedByName}` : '';
    const mappings = {
      'documentType': 'docType',
      'queryNumber': 'docSrTo',
      'bookNumber': 'bookCode',
      'seriesStartEnd': 'fromTo',
      'totalLeaves': 'totLeaf',
      'location': 'location',
      'usedLeaves': 'used',
      'person': 'allotedByUser',
      'personCat': 'allotedType',
      'locationHierarchy': 'locationHierarchy',
      'status': 'status'
    };
    for (let key in mappings) {
      let value = this.data?.[mappings[key]] || '';
      if (key === 'location') { value = locdet; }
      this.dcrDetailForm.controls[key].setValue(value);
    }
  }
  close() {
    window.history.back();
  }
  getDcrHistoryData() {
    this.masterService.getJsonFileDetails('masterUrl').subscribe(res => {
      this.historyData = res.dcrTrackHistoryData[0];
      this.historyDet = this.historyData.filter(item => parseInt(item.docKey) === parseInt(this.data.docKey)).map((item) => {
        item['location'] = item.allotedLoc + ' : ' + item.allotedLocName;
        return item;
      });
      this.tableLoad = false;
    });
  }
  manage() {
    const selectedValue = this.dcrDetailForm.value.action;
    if (selectedValue && !['S', 'R'].includes(selectedValue)) {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: "Please select a valid Action.",
        showConfirmButton: true,
      });
      return; // Stop execution if no value is selected or selected value is not 'S' or 'R'
    }
    if (selectedValue == 'R') {
      this.dialog.open(
        ReAllocateDcrComponent,
        {
          width: '800px',
          height: '280px',
          data: ''
        });
    }
    else {
      this.route.navigate(['Masters/DocumentControlRegister/SplitDCR'], {
        state: {
          data: '',
        }
      });
    }
    // Rest of the code for the manage() function
  }


}
