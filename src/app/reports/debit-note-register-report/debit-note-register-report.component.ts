import { Component, OnInit } from '@angular/core';
import { DebitNoteRegister } from 'src/assets/FormControls/Reports/debit-note-register-report/debit-note-register-report';
import { UntypedFormGroup,UntypedFormBuilder } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { GeneralLedgerReportService } from 'src/app/Utility/module/reports/general-ledger-report.service';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { DebitNoteRegisterService } from 'src/app/Utility/module/reports/debit-note-register-service';
import Swal from 'sweetalert2';
import moment from 'moment';
import { finYear } from 'src/app/Utility/date/date-utils';
@Component({
  selector: 'app-debit-note-register-report',
  templateUrl: './debit-note-register-report.component.html'
})
export class DebitNoteRegisterReportComponent implements OnInit {
  DebitNoteFormControls: DebitNoteRegister;
  DebitNoteForm: UntypedFormGroup;
  jsonControlArray: any;
  breadScrums = [
    {
      title: "Debit Note Register Report",
      items: ["Report"],
      active: "Debit Note Register Report",
    },
  ];

  reqBody: {
    startdate: Date;
    enddate: Date;
    branch: string;
    FinanceYear: string;
   
  };
  venNameDet: any;
  loading = true ;
  columns = [];
  paging: any ;
  sorting: any ;
  searching: any ;
  source: any[] = [];
  columnMenu: any ;
  theme: "MATERIAL"
  LoadTable=false;
  csvFileName: string;
  ReportingBranches: string[] = [];
  constructor(private fb: UntypedFormBuilder,
    private filter: FilterUtils,
    private locationService: LocationService,
    private storage: StorageService,
    private masterServices: MasterService,
    private generalLedgerReportService: GeneralLedgerReportService,
    public snackBarUtilityService: SnackBarUtilityService,
    private debitNoteRegisterService:DebitNoteRegisterService
  ) { }

  ngOnInit(): void {
    this.initializeFormControl()
    const now = moment().endOf('day').toDate();
    this.DebitNoteForm.controls["start"].setValue(now);
    this.DebitNoteForm.controls["end"].setValue(now);
    this.getDropDownList();
    this.csvFileName = "DebitNote_Register_Report";
  }
  // 
  async getDropDownList() {
    let venNameReq = {
      "companyCode": this.storage.companyCode,
      "filter": { },
      "collectionName": "vendor_detail"
    };
    const venNameRes = await firstValueFrom(this.masterServices.masterMongoPost("generic/get", venNameReq));
    this.DebitNoteForm.get('Individual').setValue("Y");
    const branchList = await this.locationService.locationFromApi();
  
    this.filter.Filter(
      this.jsonControlArray,
      this.DebitNoteForm,
      branchList,
      "branch",
      false
    );
    const loginBranch = branchList.find(x => x.name === this.storage.branch);
    this.DebitNoteForm.controls["branch"].setValue(loginBranch);
    const DebitNoteStatusList = [
      { name: "All", value: "All" },
      { name: "Generated", value: "G"},
      { name: "Approved", value: "A" },
      { name: "Cancelled", value: "C" }
    ]
    this.filter.Filter(
      this.jsonControlArray,
      this.DebitNoteForm,
      DebitNoteStatusList,
      "documnetstatus",
      false
    );
  
    const venNameData = venNameRes?.data; // Retrieve the data from the response
    const venNameDet = Array.isArray(venNameData) ? // Check if it's an array
      venNameData.map(element => ({ // If it's an array, map over it
        name: element.vendorName.toString(),
        value: element.vendorCode.toString(),
        type: element.vendorType.toString(),
      })) : []; // If not an array, set venNameDet as an empty array
    
    this.venNameDet = venNameDet; // Update venNameDet with the mapped array or empty array
  
    this.DebitNoteForm.get('documnetstatus').setValue(DebitNoteStatusList[0]);
    this.filter.Filter(
      this.jsonControlArray,
      this.DebitNoteForm,
      venNameDet, // Pass the updated venNameDet here
     "vennmcd",
      false
    );
    const financialYearlist = this.generalLedgerReportService.getFinancialYear();
    this.filter.Filter(
      this.jsonControlArray,
      this.DebitNoteForm,
      financialYearlist,
      "Fyear",
      false
    );
  }
  
  initializeFormControl() {
    const controls = new DebitNoteRegister();
    this.jsonControlArray = controls.DebitNoteControlArray;

    // Build the form using formGroupBuilder
    this.DebitNoteForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
   
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;     
    try {
      this[functionName]($event);
    } catch (error) {
      
      console.log("failed");
    }
  }

  async save() {
    this.loading = true;
      try {
        
        this.ReportingBranches = [];
        if (this.DebitNoteForm.value.Individual == "N") {
          this.ReportingBranches = await this.generalLedgerReportService.GetReportingLocationsList(this.DebitNoteForm.value.branch.value);
          this.ReportingBranches.push(this.DebitNoteForm.value.branch.value);
        } else {
          this.ReportingBranches.push(this.DebitNoteForm.value.branch.value);
        }
        const startDate = new Date(this.DebitNoteForm.controls.start.value);
        const endDate = new Date(this.DebitNoteForm.controls.end.value);
        const startValue = moment(startDate).startOf('day').toDate();
        const endValue = moment(endDate).endOf('day').toDate();
        const finYear=this.DebitNoteForm.value.Fyear;
        const Branch=this.ReportingBranches;
        const Individual=this.DebitNoteForm.value.Individual;
        const DocStatus=this.DebitNoteForm.value.documnetstatus;
        const MSME=this.DebitNoteForm.value.msmeRegistered;
        const vendData = Array.isArray(this.DebitNoteForm.value.vendnmcdHandler)
        ? this.DebitNoteForm.value.vendnmcdHandler.map(x => { return { vCD: x.value, vNM: x.name }; })
        : [];
        const DocNo=this.DebitNoteForm.value.docNo;
        const DocNos = DocNo ? DocNo.includes(',') ? DocNo.split(',') : [DocNo] : [];
        const VoucherNo=this.DebitNoteForm.value.voucherNo;
        const reqBody = {
          startValue, endValue, finYear, Branch, Individual, DocStatus, MSME, vendData, DocNos,DocNo,VoucherNo
        }
        const result = await this.debitNoteRegisterService.GetDebitNoteDetails(reqBody);
        this.columns = result.grid.columns;
        this.sorting = result.grid.sorting;
        this.searching = result.grid.searching;
        this.paging = result.grid.paging;
        this.source = result.data.data.data;
        this.LoadTable = true;

        if (this.source.length === 0) {
          if (this.source) {
            Swal.fire({
              icon: "error",
              title: "No Records Found",
              text: "Cannot Download CSV",
              showConfirmButton: true,
            });
          }
          return;
        }
          this.loading = false;
      }
      catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", error.message);
      }
  }
}
