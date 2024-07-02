import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup,UntypedFormBuilder } from '@angular/forms';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { OpeningClosingStockReport } from 'src/assets/FormControls/Reports/Opening-Closing-Stock-Report/openingClosing-stock-report';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { LocationService } from 'src/app/Utility/module/masters/location/location.service';
import moment from 'moment';
import { NavDataService } from 'src/app/core/service/navdata.service';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { ReportService } from 'src/app/Utility/module/reports/generic-report.service';
@Component({
  selector: 'app-opening-closing-stock-report',
  templateUrl: './opening-closing-stock-report.component.html'
})
export class OpeningClosingStockReportComponent implements OnInit {
  csvFileName: string;
  loading = true
  columns = [];
  paging: any;
  sorting: any;
  columnMenu: any;
  searching: any;
  theme: "MATERIAL"
  constructor( private fb: UntypedFormBuilder,
    private locationService: LocationService,
    private filter: FilterUtils,
    public snackBarUtilityService: SnackBarUtilityService,
    private nav: NavDataService,
    private reportService: ReportService,
  ) { }

  ngOnInit(): void {
    this.initializeFormControl();
    const now = moment().endOf('day').toDate();
    const lastweek = moment().add(-10, 'days').startOf('day').toDate()
    this.OpeningClosingStockReportForm.controls["start"].setValue(lastweek);
    this.OpeningClosingStockReportForm.controls["end"].setValue(now);
    this.csvFileName = "Opening_Closing_Stock_Report";
    this.getDropdownData();
  }
  breadScrums = [
    {
      title: "Opening Closing Stock Report",
      items: ["Report"],
      active: "Opening Closing Stock Report",
    },
  ];
  OpeningClosingStockReportForm: UntypedFormGroup;
  jsonControlArray: any;
  initializeFormControl()
  {
    const controls = new OpeningClosingStockReport();
    this.jsonControlArray = controls.OpeningClosingStockReportForm;
    this.OpeningClosingStockReportForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;    
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  async getDropdownData() {
    const locationList = await this.locationService.locationFromApi();
    this.filter.Filter(this.jsonControlArray, this.OpeningClosingStockReportForm, locationList, "Location", false);
  }
  async save() {
    this.loading = true;
    try {
      const startDate = new Date(this.OpeningClosingStockReportForm.controls.start.value);
      const endDate = new Date(this.OpeningClosingStockReportForm.controls.end.value);
      const startValue = moment(startDate).startOf('day').toDate();
      const endValue = moment(endDate).endOf('day').toDate();
      const Location = this.OpeningClosingStockReportForm.value.Location.value;
      const DocNO = this.OpeningClosingStockReportForm.value.DocumentNO;
      const DocumentArray = DocNO ? DocNO.includes(',') ? DocNO.split(',') : [DocNO] : [];
      const reqBody = {
        startValue, endValue, Location, DocumentArray, DocNO
      };
      const result = await this.getOpeningClosingStockDetails(reqBody);
      this.columns = result.grid.columns;
      this.sorting = result.grid.sorting;
      this.searching = result.grid.searching;
      this.paging = result.grid.paging;

      const stateData = {
        data: result,
        formTitle: 'Opening Closing Stock Details',
        csvFileName: this.csvFileName
      };
      this.nav.setData(stateData);
      const url = `/#/Reports/generic-report-view`;
      window.open(url, '_blank');
    } catch (error) {
      this.snackBarUtilityService.ShowCommonSwal("error", error.message);
    }
  }  
  async getOpeningClosingStockDetails(data)
  {
    let matchQuery = {
      ...(data.DocNO != "" ? { sKU: { D$in: data.DocumentArray } } :
        {
          D$and: [
            { eNTDT: { D$gte: data.startValue } }, 
            { eNTDT: { D$lte: data.endValue } }, 
            ...(data.DocNO != "" ? [{ sKU: { D$in: data.DocumentArray } }] : []),
            ...(data.Location && data.Location != ""
              ? [{ lOC: { D$eq: data.Location } }]
              : []),
          ]
        }
      ),
    };
    const res = await this.reportService.fetchReportData("OpeningClosingStockReport", matchQuery);
    return {
      data: res.data.data,
      grid: res.data.grid
    };
  }
}
