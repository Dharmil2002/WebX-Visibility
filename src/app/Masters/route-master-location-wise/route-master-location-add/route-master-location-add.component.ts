import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { DCRControl } from 'src/assets/FormControls/dcrControl';
import Swal from 'sweetalert2';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { map } from 'rxjs/operators';
import { utilityService } from 'src/app/Utility/utility.service';
import { RouteLocationControl } from 'src/assets/FormControls/routeLocationControl';

@Component({
  selector: 'app-route-master-location-add',
  templateUrl: './route-master-location-add.component.html'
})
export class RouteMasterLocationAddComponent implements OnInit {
  routeMasterLocationForm: UntypedFormGroup;
  jsonControlArray: any;
  routeMasterLocationFormControls: RouteLocationControl;
  // Breadcrumbs
  breadScrums = [
    {
      title: "Route Location Wise Master",
      items: ["Master"],
      active: "Route Location Wise Master",
    },
  ];
  controlLoc: any;
  controlLocStatus: any;
  locationData: any[];
  action: string;
  data: any;
  isUpdate: any;
  updateState: any;
  // Displayed columns configuration
  displayedColumns1 = {
    srNo: {
      name: "Sr No",
      key: "index",
      style: "",
    },
    loccd: {
      name: "Branch Name",
      key: "Dropdown",
      option: [],
      style: "",
    },
    distKm: {
      name: "Distance (In Km)",
      key: "inputString",
      style: "",
    },
    trtimeHr: {
      name: "Transit (Hours)",
      key: "input",
      style: "",
    },
    trtimeMin: {
      name: "Time (Minutes)",
      key: "input",
      style: "",
    },
    sttimeHr: {
      name: "Stoppage (Hours)",
      key: "input",
      style: "",
    },
    sttimeMin: {
      name: "Time (Hours)",
      key: "input",
      style: "",
    },
    speedLightVeh: {
      name: "Speed-Light Veh.",
      key: "input",
      style: "",
    },
    speedHeavyVeh: {
      name: "Speed-Heavy Veh.",
      key: "input",
      style: "",
    },
    nightDrivingRestricted: {
      name: "Night Driving Restricted",
      key: "toggle",
      style: "",
    },
    restrictedHoursFrom: {
      name: "Restricted Hrs (From)",
      key: "input",
      style: "",
    },
    restrictedHoursTo: {
      name: "Restricted Hrs (To)",
      key: "input",
      style: "",
    },
    action: {
      name: "Action",
      key: "Action",
      style: "",
    },
  };
  // Table data
  tableData: any = [];
  // Action buttons configuration
  actionObject = {
    addRow: true,
    submit: false,
    search: true
  };
  tableView: boolean;
  filteredData: any;
  constructor(private service: utilityService, private fb: UntypedFormBuilder, private route: Router, private masterService: MasterService, private filter: FilterUtils,) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.data = route.getCurrentNavigation().extras.state.data;
      this.action = 'edit'
      this.isUpdate = true;
      this.getRouteDet();
    } else {
      this.action = "Add";
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
      // this.pincodeTable = this.data;
      this.breadScrums = [
        {
          title: "Route Location Wise Master",
          items: ["Home"],
          active: "Edit Route Location Wise Master",
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Route Location Wise Master",
          items: ["Home"],
          active: "Add Route Location Wise Master",
        },
      ];
      // this.pincodeTable = new PincodeMaster({});
    }
    this.loadTempData('');
  }
  ngOnInit(): void {
    this.intializeFormControls();
    this.getDropDownData();
  }
  intializeFormControls() {
    this.routeMasterLocationFormControls = new RouteLocationControl(this.data);
    this.jsonControlArray = this.routeMasterLocationFormControls.getFormControls();
    this.jsonControlArray.forEach(data => {
      if (data.name === 'controlLoc') {
        this.controlLoc = data.name;
        this.controlLocStatus = data.additionalData.showNameAndValue;
      }
    });
    this.routeMasterLocationForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.routeMasterLocationForm.controls["routeType"].setValue(this.data?.routeType);
    this.routeMasterLocationForm.controls["routeCat"].setValue(this.data?.routeCategory);
    this.routeMasterLocationForm.controls["routeMode"].setValue(this.data?.routeMode);
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  getDropDownData() {
    this.masterService.getJsonFileDetails('dropDownUrl').subscribe(res => {
      this.locationData = res.locationDropdown
      this.displayedColumns1.loccd.option = this.locationData;
      this.tableView = true;
      if (this.isUpdate) {
        this.updateState = this.locationData.find((x) => x.value == this.data.controlLocation);
        this.routeMasterLocationForm.controls.controlLoc.setValue(this.updateState);
      }
      this.filter.Filter(
        this.jsonControlArray,
        this.routeMasterLocationForm,
        this.locationData,
        this.controlLoc,
        this.controlLocStatus,
      );
    });
  }
  cancel() {
    window.history.back();
  }
  save() {
    const jData = {
      routeDet: this.routeMasterLocationForm.value,
      objRouteDet: this.tableData
    }
    this.service.exportData(jData);
  }
  // Load temporary data
  loadTempData(det) {
    this.tableData = det ? det : [];
    if (this.tableData.length === 0) {
      this.addItem();
    }
  }

  // Add a new item to the table
  addItem() {
    const AddObj = {
      loccd: [],
      srNo: 0,
      distKm: "",
      trtimeHr: "",
      trtimeMin: "",
      sttimeHr: "",
      sttimeMin: "",
      speedLightVeh: "",
      speedHeavyVeh: "",
      nightDrivingRestricted: "",
      restrictedHoursFrom: "",
      restrictedHoursTo: "",
    };
    this.tableData.splice(0, 0, AddObj);
  }
  // Delete a row from the table
  async delete(event) {
    const index = event.index;
    const row = event.element;

    const swalWithBootstrapButtons = await Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success msr-2",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: `<h4><strong>Are you sure you want to delete ?</strong></h4>`,
        showCancelButton: true,
        cancelButtonColor: "#d33",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
        showLoaderOnConfirm: true,
        preConfirm: (Remarks) => {
          var request = {
            companyCode: localStorage.getItem("CompanyCode"),
            id: row.id,
          };
          if (row.id == 0) {
            return {
              isSuccess: true,
              message: "City has been deleted !",
            };
          } else {
            console.log("Request", request);
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      })
      .then((result) => {

        if (result.isConfirmed) {
          this.tableData.splice(index, 1);
          this.tableData = this.tableData;
          swalWithBootstrapButtons.fire("Deleted!", "Your Message", "success");
          event.callback(true);
        } else if (result.isConfirmed) {
          swalWithBootstrapButtons.fire("Not Deleted!", "Your Message", "info");
          event.callback(false);
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Your item is safe :)",
            "error"
          );
          event.callback(false);
        }
      });

    return true;
  }
  getRouteDet() {
    // Fetch data from the JSON endpoint
    this.masterService.getJsonFileDetails('masterUrl').subscribe(res => {
      this.filteredData = res['objRouteDetails'].filter(item => item.rutcd === this.data.routeId);
      this.loadTempData(this.filteredData)
    }
    );
  }
}
