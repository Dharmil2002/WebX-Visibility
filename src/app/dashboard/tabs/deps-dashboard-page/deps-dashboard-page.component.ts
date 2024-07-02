import { Component, OnInit } from '@angular/core';
import { DepsModel } from 'src/app/Models/deps/deps';
import { DepsService } from 'src/app/Utility/module/operation/deps/deps-service';
import { StorageService } from 'src/app/core/service/storage.service';
import { DepsUpdateComponent } from '../../ActionPages/deps-update/deps-update.component';

@Component({
  selector: 'app-deps-dashboard-page',
  templateUrl: './deps-dashboard-page.component.html'
})
export class DepsDashboardPageComponent implements OnInit {
  tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
  tableData: any[];
  addAndEditPath: string
  boxData: { count: any; title: any; class: string; }[];
  menuItemflag: boolean = true;
  breadscrums = [
    {
      title: "Arrival Details",
      items: ["Dashboard"],
      active: "Arrival Details"
    }
  ]
  dynamicControls = {
    add: false,
    edit: true,
    csv: false
  }
  linkArray = []
  toggleArray = []
  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ['checkBoxRequired']
  }
  width="70%"
  height="70%";
  menuItems = [
    { label: 'Update', componentDetails: DepsUpdateComponent, function: "GeneralMultipleView" },
  ];

  //#endregion
  constructor(
    private storage:StorageService,
    private definition:DepsModel,
    private depsService:DepsService
  ) {
   }

  ngOnInit(): void {
    this.getDepsDetails();
  }
  async getDepsDetails(){
    const res=await this.depsService.getDepsAllData({cID:this.storage.companyCode,lOC:this.storage.branch});
    const tableList=await this.depsService.bindData(res);
    this.tableData=tableList.reverse();
    this.getDrsKpiCount();
    this.tableLoad=false;
  }
  getDrsKpiCount() {
    const createShipDataObject = (
      count: number,
      title: string,
      className: string
    ) => ({
      count,
      title,
      class: `info-box7 ${className} order-info-box7`,
    });
    const openDeps  = this.tableData.filter((x) => x.sTS == 1);
    const closeDeps  = this.tableData.filter((x) => x.sTS == 3);
    const shipData = [
      createShipDataObject(
        this.tableData.length,
        "Deps Count",
        "bg-c-Bottle-light"
      ),
      createShipDataObject(
        openDeps.length,
        "Open DEPS",
        "bg-c-Grape-light"
      ),
      createShipDataObject(
        closeDeps.length,
        "Closed DEPS",
        "bg-c-Daisy-light"
      )
    ];
    this.boxData = shipData;
  }
}
