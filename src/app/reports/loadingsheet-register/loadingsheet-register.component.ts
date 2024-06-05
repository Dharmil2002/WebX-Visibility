import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import moment from 'moment';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import { loadingsheetRegister } from 'src/assets/FormControls/Reports/loadingsheet-Register/loadingsheet-register';
import { SnackBarUtilityService } from "src/app/Utility/SnackBarUtility.service";
import Swal from 'sweetalert2';
import { ReportService } from 'src/app/Utility/module/reports/generic-report.service';

@Component({
  selector: 'app-loadingsheet-register',
  templateUrl: './loadingsheet-register.component.html'
})
export class LoadingsheetRegisterComponent implements OnInit {

  breadScrums = [
    {
      title: "LoadingSheet Register Report",
      items: ["Report"],
      active: "LoadingSheet Register Report",
    },
  ];
  loadingsheetRegisterForm: UntypedFormGroup;
  jsonControlArray : any;
  loading = true // Loading indicator
  submit = "Save";
  showOverlay = false;

  //#region GRID PROPERTIES
  LoadTable=false;
  formTitle="LoadingSheet Register Data";
  csvFileName: string; // name of the csv file, when data is downloaded
  source: any[] = []; // Array to hold data

  //#region Table
  columns = [];
  //#endregion

  paging: any ;
  sorting: any ;
  columnMenu: any ;
  searching: any ;
  theme: "MATERIAL"

  //#endregion GRID PROPERTIES

  constructor(
    public snackBarUtilityService: SnackBarUtilityService,
    private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private filter: FilterUtils,
    private reportService: ReportService,
  ) {
  }

  ngOnInit(): void {
    this.initializeFormControl()

    const now = moment().endOf('day').toDate();
    const lastweek = moment().add(-10, 'days').startOf('day').toDate()

    // Set the 'start' and 'end' controls in the form to the last week and current date, respectively
    this.loadingsheetRegisterForm.controls["start"].setValue(lastweek);
    this.loadingsheetRegisterForm.controls["end"].setValue(now);
    this.csvFileName = "Loading_Sheet_Register_Report";
    this.getDropdownData();
  }

  async getDropdownData() {
    const locationList = await this.locationService.locationFromApi();
    this.filter.Filter(this.jsonControlArray, this.loadingsheetRegisterForm, locationList, "Location", false);
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
    //#region to initialize form control
    initializeFormControl() {
      const controls = new loadingsheetRegister();
      this.jsonControlArray = controls.loadingsheetRegisterControlArray;

      // Build the form using formGroupBuilder
      this.loadingsheetRegisterForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    }
    //#endregion
    async getloadingsheetReportDetail(data) {
      debugger
      let matchQuery = {
        ...(data.DocNO != "" ? { lSNO: { D$in: data.DocumentArray } }:
        {D$and: [
          { eNTDT: { D$gte: data.startValue } }, // Convert start date to ISO format
          { eNTDT: { D$lte: data.endValue } }, // Bill date less than or equal to end date
          ...(data.DocNO != "" ? [{ lSNO: { D$in: data.DocumentArray } }] : []),
          ...(data.Location && data.Location != ""
            ? [{ lOC: { D$eq: data.Location } }]
            : []),
        ]}
        ),
      };
      const res = await this.reportService.fetchReportData("LoadingsheetRegister", matchQuery);
      const details = res.data.data.map((item) => ({
        ...item,
        LSDateTime : item.LSDateTime ? moment(item.LSDateTime).format("DD MMM YY HH:MM") : "",
        Datetime : item.Datetime ? moment(item.Datetime).format("DD MMM YY HH:MM") : "",
      }));

      return {
        data: details,
        grid: res.data.grid
      };
    }
    //#region save
    async save() {
      this.loading = true;
      try {
        const startDate = new Date(this.loadingsheetRegisterForm.controls.start.value);
        const endDate = new Date(this.loadingsheetRegisterForm.controls.end.value);
        const startValue = moment(startDate).startOf('day').toDate();
        const endValue = moment(endDate).endOf('day').toDate();
        const Location = this.loadingsheetRegisterForm.value.Location.value;
        const DocNO = this.loadingsheetRegisterForm.value.DocumentNO;
        const DocumentArray = DocNO ? DocNO.includes(',') ? DocNO.split(',') : [DocNO] : [];
        const reqBody = {
          startValue, endValue, Location, DocumentArray, DocNO
        }
        const result = await this.getloadingsheetReportDetail(reqBody);
        this.columns = result.grid.columns;
        this.sorting = result.grid.sorting;
        this.searching = result.grid.searching;
        this.paging = result.grid.paging;

        this.source = result.data;
        this.LoadTable = true;
        this.showOverlay = true;

        if (this.source.length === 0) {
          if (this.source) {
            Swal.fire({
              icon: "error",
              title: "No Records Found",
              text: "Cannot Download CSV",
              showConfirmButton: true,
            });
          }
          this.loading = false;
          return;
        }
        this.loading = false;
      } catch (error) {
        this.snackBarUtilityService.ShowCommonSwal("error", error.message);
      }
    }
    //#endregion
    // OpenCnote(data) {
    //   const templateBody = {
    //     templateName: "Docket",
    //     partyCode: "CONSRAJT58",
    //     DocNo: data.docNo,
    //   }
    //   const url = `${window.location.origin}/#/Reports/LoadingsheetRegister?templateBody=${JSON.stringify(templateBody)}`;
    //   window.open(url, '', 'width=1000,height=800');
    // }
}
