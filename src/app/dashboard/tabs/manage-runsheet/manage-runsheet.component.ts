import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UpdateRunSheetComponent } from 'src/app/operation/update-run-sheet/update-run-sheet.component';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import { CnoteService } from 'src/app/core/service/Masters/CnoteService/cnote.service';
@Component({
  selector: 'app-manage-runsheet',
  templateUrl: './manage-runsheet.component.html',
})
export class ManageRunsheetComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  jsonUrl = '../../../assets/data/manageRunsheet.json'
  data: [] | any;
  tableload = true; // flag , indicates if data is still lodaing or not , used to show loading animation 
  csv: any[];
  addAndEditPath: string
  drillDownPath: string
  uploadComponent: any;
  csvFileName: string; // name of the csv file, when data is downloaded , we can also use function to generate filenames, based on dateTime. 
  companyCode: number;
  menuItemflag: boolean = true;
  breadscrums = [
    {
      title: "Manage Run Sheet",
      items: ["Dashboard"],
      active: "Manage Run Sheet"
    }
  ]
  dynamicControls = {
    add: false,
    edit: true,
    csv: false
  }
  /*Below is Link Array it will Used When We Want a DrillDown
   Table it's Jst for set A Hyper Link on same You jst add row Name Which You
   want hyper link and add Path which you want to redirect*/
  linkArray = [
    { Row: 'Action', Path: 'Operation/UpdateRunSheet' }
  ]
  menuItems = [
    { label: 'Depart' , componentDetails: UpdateRunSheetComponent, function: "GeneralMultipleView" },
    { label: 'Update Delivery', }

    // Add more menu items as needed
  ];
  //Warning--It`s Used is not compasary if you does't add any link you just pass blank array
  /*End*/
  toggleArray = [
    'activeFlag',
    'isActive',
    'isActiveFlag',
    'isMultiEmployeeRole'
  ]
  //#region create columnHeader object,as data of only those columns will be shown in table.
  // < column name : Column name you want to display on table > 

  columnHeader = {
    "RunSheet":"Run Sheet",
    "Cluster": "Cluster",
    "Shipments": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT",
    "Status":"Status",
    "Action": "Action"
  }

  METADATA = {
    checkBoxRequired: true,
    // selectAllorRenderedData : false,
    noColumnSort: ['checkBoxRequired']
  }
  //#endregion
  //#region declaring Csv File's Header as key and value Pair
  headerForCsv = {
    "RunSheet":"Run Sheet",
    "Cluster": "Cluster",
    "Shipments": "Shipments",
    "Packages": "Packages",
    "WeightKg": "Weight Kg",
    "VolumeCFT": "Volume CFT"
  }
  //#endregion

  IscheckBoxRequired: boolean;
  advancdeDetails: { data: { label: string; data: any; }; viewComponent: any; };
  viewComponent: any;
  boxdata: { count: number; title: string; class: string; }[];
  // declararing properties

  constructor(private http: HttpClient, private Route: Router,private cnoteService:CnoteService) {
    super();
    this.csvFileName = "exampleUserData.csv";
    this.addAndEditPath = 'example/form';
    this.IscheckBoxRequired = true;
    this.drillDownPath = 'example/drillDown'
    this.getManagedRunSheetDetails();
    //.uploadComponent = undefined;
  }
  getManagedRunSheetDetails() {
    this.creatRunSheetData()
  }
  
  creatRunSheetData() {
    let runsheetdata = this.cnoteService.getRunSheetData();
      let runSheetDetails=[runsheetdata.runSheetDetails];
      let runSheetShipingDetails=runsheetdata.shippingData;
          // Create shipData objects for displaying summary information
          const createShipDataObject = (count: number, title: string, className: string) => ({
            count,
            title,
            class: `info-box7 ${className} order-info-box7`,
          });
      let runSheetDetailsList :any[] = []
      runSheetDetails.forEach(element => {
        let shipingDetails=runSheetShipingDetails.filter((x)=>x.Cluster==element.Cluster)
        const totalWeight = shipingDetails.reduce(
          (total: number, shipment: any) => total + shipment.Weight,
          0
        );
        const totalCFT = shipingDetails.reduce(
          (total: number, shipment: any) => total + shipment.Volume,
          0
        );
        const totalPackages = shipingDetails.reduce(
          (total: number, shipment: any) => total + shipment.Packages,
          0
        );
       let jsonRunSheet={ 
        RunSheet:element?.RunSheetID||'',
        Cluster:element?.Cluster||'',
        Shipments:shipingDetails.length,
        Packages: totalPackages,
        WeightKg:totalWeight,
        VolumeCFT: totalCFT,
        Status:"GENERATED",
        Action:"Depart"
      }
      runSheetDetailsList.push(jsonRunSheet)
      });
    
      let updatedData= this.cnoteService.getdepartRunSheetData()
      this.csv=[]
      if(updatedData){
        debugger
        runSheetDetailsList.forEach(element => {
          if(element.Cluster==updatedData.Cluster){
            element.Status=updatedData.Status,
            element.Action=updatedData.Action
          }
      })
      this.csv=runSheetDetailsList;
      this.tableload = false;
    }
      else{
      this.csv=runSheetDetailsList;
      this.tableload = false;
      }
      if(updatedData){
        this.csv.forEach(element => {
          if(element.Cluster==updatedData.Cluster){
            element.Status=updatedData.Status,
            element.Action=updatedData.Action
          }
      })
    }
    let pickUpDelivary=runSheetDetails.filter((x)=>x.Pickup===true);
    const shipData = [
      createShipDataObject(this.csv.length, "Clusters", "bg-danger"),
      createShipDataObject(runSheetShipingDetails.length, "Shipments for Delivery", "bg-info"),
      createShipDataObject(pickUpDelivary.length, "Pickup Requests", "bg-warning"),
    ]
     this.boxdata=shipData
  }

  ngOnInit(): void {

    // this.http.get(this.jsonUrl).subscribe(res => {
    //   this.data = res;
    //   let tableArray = this.data['tabledata'];
    //   const newArray = tableArray.map(({ hasAccess, ...rest }) => ({ isSelected: hasAccess, ...rest }));
    //   this.csv = newArray;
    //   // console.log(this.csv);
    //   this.tableload = false;

    // });
    // try {
    //   this.companyCode = parseInt(localStorage.getItem("CompanyCode"));
    // } catch (error) {
    //   // if companyCode is not found , we should logout immmediately.
    // }
   
  }
  handleMenuItemClick(label: any, element) {

    this.Route.navigate(['Operation/UpdateRunSheet'], {
      state: {
        data: label.data,
      },
    });

  }

}
