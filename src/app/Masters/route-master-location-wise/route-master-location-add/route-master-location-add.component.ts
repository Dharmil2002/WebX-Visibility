import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { RouteLocationControl } from 'src/assets/FormControls/routeLocationControl';
import { DatePipe } from '@angular/common';

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
      key: "input",
      style: "",
      functions: {
        'onChange': "calRouteKm" // Function to be called on change event
      },
    },
    trtimeHr: {
      name: "Transit (Minutes)",
      key: "input",
      style: "",
    },
    sttimeHr: {
      name: "Stoppage (Minutes)",
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
  newRouteCode: string;
  datePipe: DatePipe = new DatePipe("en-US");
  constructor(private fb: UntypedFormBuilder, private route: Router, private masterService: MasterService, private filter: FilterUtils,) {
    if (this.route.getCurrentNavigation()?.extras?.state != null) {
      this.data = route.getCurrentNavigation().extras.state.data;
      this.action = 'edit'
      this.isUpdate = true;
      this.getRouteDet();
    } else {
      this.action = "Add";
      this.loadTempData('');
    }
    if (this.action === 'edit') {
      this.isUpdate = true;
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
    }
  }
  ngOnInit(): void {
    this.intializeFormControls();
    this.getAllMastersData();
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
    this.routeMasterLocationForm.controls["routeCat"].setValue(this.data?.routeCat);
    this.routeMasterLocationForm.controls["routeMode"].setValue(this.data?.routeMode);
    this.routeMasterLocationForm.controls["scheduleType"].setValue(this.data?.scheduleType);
  }
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  getAllMastersData() {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      filter: {},
      "collectionName": "location_detail"
    }
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          const locData = res.data.map(element => ({
            name: element.locName,
            value: element.locCode,
          }));
          this.locationData = locData
          this.displayedColumns1.loccd.option = this.locationData;
          this.tableView = true;
          if (this.isUpdate) {
            this.updateState = this.locationData.find((x) => x.name == this.data.controlLoc);
            this.routeMasterLocationForm.controls.controlLoc.setValue(this.updateState);
          }
          this.filter.Filter(
            this.jsonControlArray,
            this.routeMasterLocationForm,
            this.locationData,
            this.controlLoc,
            this.controlLocStatus,
          );
        }
      }
    })
  }
  cancel() {
    this.route.navigateByUrl('/Masters/RouteLocationWise/RouteList');
  }
  save() {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      filter: {},
      "collectionName": "routeMasterLocWise"
    }
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          const lastRoute = res.data[res.data.length - 1];
          const lastRouteCode = lastRoute ? parseInt(lastRoute.routeId.substring(1)) : 0;
          // Function to generate a new route code
          function generateRouteCode(initialCode: number = 0) {
            const nextRouteCode = initialCode + 1;
            const routeNumber = nextRouteCode.toString().padStart(4, '0');
            const routeCode = `R${routeNumber}`;
            return routeCode;
          }
          if (this.isUpdate) {
            this.newRouteCode = this.data._id
          } else {
            this.newRouteCode = generateRouteCode(lastRouteCode);
          }
          const transformedData = {
            routeId: this.newRouteCode,
            routeMode: this.routeMasterLocationForm.value.routeMode,
            routeCat: this.routeMasterLocationForm.value.routeCat,
            routeKm: this.routeMasterLocationForm.value.routeKm,
            departureClockTime: parseFloat(this.datePipe.transform(this.routeMasterLocationForm.value.departureTime, "HH:mm")),
            controlLoc: this.routeMasterLocationForm.value.controlLoc.name,
            routeType: this.routeMasterLocationForm.value.routeType,
            scheduleType: this.routeMasterLocationForm.value.scheduleType,
            isActive: this.routeMasterLocationForm.value.isActive,
            _id: this.newRouteCode,
            loccd: this.tableData.map((item) => item.loccd),
            distKm: this.tableData.map((item) => parseInt(item.distKm)),
            trtimeHr: this.tableData.map((item) => parseInt(item.trtimeHr)),
            sttimeHr: this.tableData.map((item) => parseInt(item.sttimeHr)),
            speedLightVeh: this.tableData.map((item) => parseInt(item.speedLightVeh)),
            speedHeavyVeh: this.tableData.map((item) => parseInt(item.speedHeavyVeh)),
            nightDrivingRestricted: this.tableData.map((item) => item.nightDrivingRestricted != "" ? true : false),
            restrictedHoursFrom: this.tableData.map((item) => parseInt(item.restrictedHoursFrom)),
            restrictedHoursTo: this.tableData.map((item) => parseInt(item.restrictedHoursTo)),
            entryBy: localStorage.getItem('Username'),
            entryDate: new Date().toISOString()
          };

          if (this.isUpdate) {
            let id = transformedData._id;
            // Remove the "id" field from the form controls
            delete transformedData._id;
            let req = {
              companyCode: parseInt(localStorage.getItem("companyCode")),
              collectionName: "routeMasterLocWise",
              filter: { _id: id },
              update: transformedData
            };
            this.masterService.masterPut('generic/update', req).subscribe({
              next: (res: any) => {
                if (res) {
                  // Display success message
                  Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: res.message,
                    showConfirmButton: true,
                  });
                  this.route.navigateByUrl('/Masters/RouteLocationWise/RouteList');
                }
              }
            });
          } else {
            let req = {
              companyCode: parseInt(localStorage.getItem("companyCode")),
              collectionName: "routeMasterLocWise",
              data: transformedData
            };
            this.masterService.masterPost('generic/create', req).subscribe({
              next: (res: any) => {
                if (res) {
                  // Display success message
                  Swal.fire({
                    icon: "success",
                    title: "Successful",
                    text: res.message,
                    showConfirmButton: true,
                  });
                  this.route.navigateByUrl('/Masters/RouteLocationWise/RouteList');
                }
              }
            });
          }
        }
      }
    })
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
          this.calRouteKm();
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
    // Function to transform array properties
    function transformArrayProperties(data) {
      const transformedData = [];
      const len = Math.max(
        data.loccd.length,
        data.distKm.length,
        data.trtimeHr.length,
        data.sttimeHr.length,
        data.speedLightVeh.length,
        data.speedHeavyVeh.length,
        data.nightDrivingRestricted.length,
        data.restrictedHoursFrom.length,
        data.restrictedHoursTo.length
      );

      for (let i = 0; i < len; i++) {
        transformedData.push({
          loccd: data.loccd[i],
          distKm: data.distKm[i] || 0,
          trtimeHr: data.trtimeHr[i] || 0,
          sttimeHr: data.sttimeHr[i] || 0,
          speedLightVeh: data.speedLightVeh[i] || 0,
          speedHeavyVeh: data.speedHeavyVeh[i] || 0,
          nightDrivingRestricted: data.nightDrivingRestricted[i] || false,
          restrictedHoursFrom: data.restrictedHoursFrom[i] || null,
          restrictedHoursTo: data.restrictedHoursTo[i] || null,
        });
      }
      return transformedData;
    }
    const transformedData = transformArrayProperties(this.data);
    this.loadTempData(transformedData);
  }
  calRouteKm() {
    let totalDistKm = 0;
    for (let i = 0; i < this.tableData.length; i++) {
      const distKm = parseInt(this.tableData[i].distKm);
      if (!isNaN(distKm)) {
        totalDistKm += distKm;
      }
      this.routeMasterLocationForm.controls["routeKm"].setValue(totalDistKm);
    }
  }
}
