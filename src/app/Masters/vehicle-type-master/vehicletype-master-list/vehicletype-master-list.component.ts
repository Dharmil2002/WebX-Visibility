import { Component, OnInit } from "@angular/core";
import { MasterService } from "src/app/core/service/Masters/master.service";
@Component({
  selector: 'app-vehicletype-master-list',
  templateUrl: './vehicletype-master-list.component.html',
})
export class VehicletypeMasterListComponent implements OnInit {
    data: [] | any;
    addAndEditPath: string
    csvFileName: string;
    csv: any[];
    companyCode: any = parseInt(localStorage.getItem("companyCode"));
    tableLoad = true; // flag , indicates if data is still lodaing or not , used to show loading animation
    // Define column headers for the table
    columnHeader =
    {
      "srNo": "Sr No.",
      "vehicleTypeCode": "Vehicle Type Code",
      "vehicleTypeName": "Vehicle Type Name",
      "isActive": "Active",
      "actions": "Actions"
    }
    headerForCsv = {
      "vehicleTypeCode": "Vehicle Type Code",
      "vehicleTypeName": "Vehicle Type Name",
      "vehicleManufacturerName": "Vehicle Manufacturer Name",
      "modelNo": "Model No.",
      "vehicleTypeCategory": "Vehicle Type Category",
      "tyreRotationatKM": "Tyre Rotation at KM",
      "typeDescription": "Type Description",
      "vehicleSize": "Vehicle Size",
      "tankCapacity": "Tank Capacity",
      "activeFlag": "Active Flag",
      "grossVehicleWeight": "Gross Vehicle Weight",
      "unladenWeight": "Unladen Weight",
      "capacity": "Capacity",
      "ratePerKM": "Rate Per KM",
      "fuelType": "Fuel Type",
      "length": "Length",
      "width": "Width",
      "height": "Height",
      "capacityDiscount": "Capacity Discount",
      "tyreRotationAlertKMs": "Tyre Rotation Alert KMs",
      "noOfPackages": "No. Of Packages",
    }
    breadScrums = [
        {
            title: "Vehicle Type Master",
            items: ["Master"],
            active: "Vehicle Type Master",
        }
    ];
    dynamicControls = {
        add: true,
        edit: true,
        csv: true
    }
    toggleArray = ["isActive"]
    linkArray = []
    constructor(private masterService: MasterService) {
      this.addAndEditPath = "/Masters/VehicleTypeMaster/AddVehicleTypeMaster"; 
    }
    ngOnInit(): void {
        //throw new Error("Method not implemented.");
        this.getVehicleTypeDetails();
        this.csvFileName = "Vehicle Type Details"  //setting csv file Name so file will be saved as per this name
    }
    getVehicleTypeDetails() {
        let req = {
          companyCode: this.companyCode,
          "type": "masters",
          "collection": "vehicleType"
      }
      this.masterService.masterPost('common/getall', req).subscribe({
          next: (res: any) => {
              if (res) {
                  // Generate srno for each object in the array
                  const dataWithSrno = res.data.map((obj, index) => {
                      return {
                          ...obj,
                          srNo: index + 1
                      };
                  });
                  console.log(res);
                  this.csv = dataWithSrno;
                  this.tableLoad = false;
              }
          }
      })
    }
}
