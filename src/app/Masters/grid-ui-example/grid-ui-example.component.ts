import { Component } from '@angular/core';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-grid-ui-example',
  templateUrl: './grid-ui-example.component.html'
})
export class GridUiExampleComponent {
  // Breadscrums for navigation
  breadscrums = [
    {
      title: "User Demo",
      items: ["example"],
      active: "User Demo"
    }
  ]

  formTitle = "Example Docket Data"

  // Array to hold data
  source: any[] = [];

  // name of the csv file, when data is downloaded
  csvFileName: string;

  // Columns configuration
  columns: any[] = []

  // Sorting configuration
  sorting = {}

  // Column menu configuration
  columnMenu = {}

  // Paging configuration
  paging = {}

  // Searching configuration
  searching = {}

  // Loading indicator
  loading = true

  // Theme configuration
  theme = '' // FABRIC, LIGHT, DARK, GENERIC

  constructor(private masterService: MasterService) { }

  ngOnInit(): void {

    this.csvFileName = "exampleDocketData";
    // Fetching columns from JSON
    this.getColumns()
    // Fetching data from JSON
    this.getData()
  }

  async getColumns() {
    this.loading = true;
    const res = await firstValueFrom(this.masterService.getJsonFileDetails("guiColumnUrl"))
    console.log(res)
    this.columns = res.columns
    this.paging = res.paging
    this.searching = res.searching
    this.sorting = res.sorting
    this.columnMenu = res.columnMenu
    this.theme = res.theme
    this.loading = false;
  }

  // Fetching data
  async getData() {
    this.loading = true;
    const res = await firstValueFrom(this.masterService.getJsonFileDetails("docketDataUrl"));
    this.source = res.data
    // console.log(this.source);
    this.loading = false;
  }

}