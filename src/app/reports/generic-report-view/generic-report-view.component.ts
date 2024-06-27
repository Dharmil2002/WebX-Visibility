import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavDataService } from 'src/app/core/service/navdata.service';

@Component({
  selector: 'app-generic-report-view',
  templateUrl: './generic-report-view.component.html'
})
export class GenericReportViewComponent implements OnInit {

  Data: any;
  source: any[] = [];
  columns = [];
  formTitle: any;
  csvFileName: any;
  sorting: any;
  paging: any;
  searching: any;
  theme: "MATERIAL";

  constructor(
    private route: ActivatedRoute,
    private nav: NavDataService) {

  }

  ngOnInit(): void {
    const stateData = { ...this.nav.getData() };
    this.Data = stateData.data;
    this.source = this.Data.data;
    this.columns = stateData.data.grid.columns;
    this.formTitle = stateData.formTitle;
    this.csvFileName = stateData.csvFileName;
    this.sorting = stateData.data.grid.sorting;
    this.paging = stateData.data.grid.paging;
    this.searching = stateData.data.grid.searching;
  }
}
