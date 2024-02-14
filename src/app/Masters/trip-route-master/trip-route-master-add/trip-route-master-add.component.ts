import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { formGroupBuilder } from 'src/app/Utility/Form Utilities/formGroupBuilder';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import Swal from 'sweetalert2';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';
import { forkJoin, map } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TripRouteControl } from 'src/assets/FormControls/trip-route-master';
@Component({
  selector: 'app-trip-route-master-add',
  templateUrl: './trip-route-master-add.component.html'
})
export class TripRouteMasterAddComponent implements OnInit {
  tripRouteTableForm: UntypedFormGroup;
  jsonControlArray: any;
  tripRouteFormControls: TripRouteControl;
  // Breadcrumbs
  breadScrums = [
    {
      title: "Trip Route Master",
      items: ["Masters"],
      active: "Trip Route Master",
    },
  ];
  newRouteCode: string;
  datePipe: DatePipe = new DatePipe("en-US");
  controlLoc: any;
  controlLocStatus: any;
  action: string;
  data: any;
  isUpdate: any;
  companyCode: any = parseInt(localStorage.getItem("companyCode"));
  // Displayed columns configuration
  displayedColumns1 = {
    srNo: {
      name: "Sr No",
      key: "index",
      style: "min-width:100px;",
      Headerstyle: { 'min-width': '10px' },
    },
    cityName: {
      name: "City Name",
      key: "Dropdown",
      option: [],
      style: "",
      functions: {
        'onOptionSelect': "defineRouteDes" // Function to be called on change event
      },
    },
    distKm: {
      name: "Distance (In Km)",
      key: "input",
      style: "",
      functions: {
        'onChange': "calRouteKm" // Function to be called on change event
      },
    },
    transitTime: {
      name: "Transit Time",
      key: "input",
      style: "",
      functions: {
        'onChange': "calTransitTime" // Function to be called on change event
      },
    },
    stoppageTime: {
      name: "Stoppage Time",
      key: "input",
      style: "",
    },
    onw_ret: {
      name: "Onward/Return",
      key: "Dropdown",
      option: [],
      style: "",
    },
    action: {
      name: "Action",
      key: "Action",
      style: "",
    }
  };
  // Table data
  tableData: any = [];
  // Action buttons configuration
  actionObject = {
    addRow: true,
    submit: false,
    search: true
  };
  tableDet: boolean;
  tableLoad = false;
  allData: any;
  updateRoute: any;
  routeMode: any;
  routeModeStatus: any;
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
          title: "Trip Route Master",
          items: ["Masters"],
          active: "Edit Trip Route Master",
        },
      ];
    } else {
      this.breadScrums = [
        {
          title: "Trip Route Master",
          items: ["Masters"],
          active: "Add Trip Route Master",
        },
      ];
    }
  }
  ngOnInit(): void {
    this.intializeFormControls();
    this.getAllMastersData();
  }
  intializeFormControls() {
    this.tripRouteFormControls = new TripRouteControl(this.data, this.isUpdate);
    this.jsonControlArray = this.tripRouteFormControls.getTripRouteFormControls();
    this.jsonControlArray.forEach(data => {
      if (data.name === 'controlLoc') {
        this.controlLoc = data.name;
        this.controlLocStatus = data.additionalData.showNameAndValue;
      }
    });
    this.tripRouteTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.tripRouteTableForm.controls["routeMode"].setValue(this.data?.routeMode);
  }

  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call
    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }
  cancel() {
    this.route.navigateByUrl('/Masters/TripRouteMaster/TripRouteMasterList');
  }

  save() {
    let req = {
      companyCode: parseInt(localStorage.getItem("companyCode")),
      filter: {},
      "collectionName": "trip_route_details"
    }
    this.masterService.masterPost('generic/get', req).subscribe({
      next: (res: any) => {
        if (res) {
          // Generate srno for each object in the array
          const lastRoute = res.data[res.data.length - 1];
          const lastRouteCode = lastRoute ? parseInt(lastRoute.tripRouteId.substring(1)) : 0;
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
            tripRouteId: this.newRouteCode,
            routeDescription: this.tripRouteTableForm.value.routeDescription,
            routeMode: this.tripRouteTableForm.value.routeMode,
            totalDistance: this.tripRouteTableForm.value.distKm,
            totalTransitTime: this.tripRouteTableForm.value.transitTime,
            controlLoc: this.tripRouteTableForm.value.controlLoc.name,
            departTime: this.tripRouteTableForm.value.departTime,
            roundTrip: this.tripRouteTableForm.value.roundTrip,
            isActive: this.tripRouteTableForm.value.isActive,
            _id: this.newRouteCode,
            city: this.tableData.map((item) => item.cityName),
            distKm: this.tableData.map((item) => parseInt(item.distKm)),
            transitTime: this.tableData.map((item) => parseInt(item.transitTime)),
            stoppageTime: this.tableData.map((item) => parseInt(item.stoppageTime)),
            onw_ret: this.tableData.map((item) => item.onw_ret),
            entryBy: localStorage.getItem('Username'),
            entryDate: new Date()
          };

          if (this.isUpdate) {
            let id = transformedData._id;
            // Remove the "id" field from the form controls
            delete transformedData._id;
            let req = {
              companyCode: parseInt(localStorage.getItem("companyCode")),
              collectionName: "trip_route_details",
              filter: { tripRouteId:this.tripRouteTableForm.value.tripRouteId},
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
                  this.route.navigateByUrl('/Masters/TripRouteMaster/TripRouteMasterList');
                }
              }
            });
          } else {
            let req = {
              companyCode: parseInt(localStorage.getItem("companyCode")),
              collectionName: "trip_route_details",
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
                  this.route.navigateByUrl('/Masters/TripRouteMaster/TripRouteMasterList');
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
      srNo: 0,
      cityName: "",
      distKm: "",
      transitTime: "",
      stoppageTime: "",
      onw_ret: "",
      action: "",
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
          this.calRouteKm(); this.calTransitTime();
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
        data.city.length,
        data.distKm.length,
        data.transitTime.length,
        data.stoppageTime.length,
        data.onw_ret.length,
      );

      for (let i = 0; i < len; i++) {
        transformedData.push({
          cityName: data.city[i],
          distKm: data.distKm[i],
          transitTime: data.transitTime[i],
          stoppageTime: data.stoppageTime[i],
          onw_ret: data.onw_ret[i],
        });
      }
      return transformedData;
    }
    const transformedData = transformArrayProperties(this.data);
    this.loadTempData(transformedData);
  }
  // Get all dropdown data
  getAllMastersData() {
    // Prepare the requests for different collections
    let locationReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      filter: {},
      "collectionName": "location_detail"
    };

    let cityReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      filter: {},
      "collectionName": "city_detail"
    };
    // Use forkJoin to make parallel requests and get all data at once
    forkJoin([
      this.masterService.masterPost('generic/get', locationReq),
      this.masterService.masterPost('generic/get', cityReq),
    ]).pipe(
      map(([locationRes, cityRes]) => {
        // Combine all the data into a single object
        return {
          locationData: locationRes?.data,
          cityData: cityRes?.data,
        };
      })
    ).subscribe((mergedData) => {
      this.allData = mergedData;
      console.log(this.allData);
      // Access the merged data here
      const locationDet = mergedData.locationData.map(element => ({
        name: element.locName,
        value: element.locCode,
      }));
      const cityDet = mergedData.cityData.map(element => ({
        name: element.cityName,
        value: element.cityName,
      }));
      this.displayedColumns1.cityName.option = cityDet;
      this.displayedColumns1.onw_ret.option =
        [
          { "name": "Onward", "value": "Onward" },
          { "name": "Return", "value": "Return" },
        ];
      if (this.isUpdate) {
        this.updateRoute = locationDet.find((x) => x.name == this.data.controlLoc);
        this.tripRouteTableForm.controls.controlLoc.setValue(this.updateRoute);
      }
      this.filter.Filter(
        this.jsonControlArray,
        this.tripRouteTableForm,
        locationDet,
        this.controlLoc,
        this.controlLocStatus,
      );
      this.tableLoad = true;

    });

  }
  calRouteKm() {
    let totalDistKm = 0;
    for (let i = 0; i < this.tableData.length; i++) {
      const distKm = parseInt(this.tableData[i].distKm);
      if (!isNaN(distKm)) {
        totalDistKm += distKm;
      }
      this.tripRouteTableForm.controls["distKm"].setValue(totalDistKm);
    }
  }
  calTransitTime() {
    let totalTransitTime = 0;
    for (let i = 0; i < this.tableData.length; i++) {
      const transitTime = parseInt(this.tableData[i].transitTime);
      if (!isNaN(transitTime)) {
        totalTransitTime += transitTime;
      }
      this.tripRouteTableForm.controls["transitTime"].setValue(totalTransitTime);
    }
  }
  defineRouteDes() {
    this.tripRouteTableForm.controls["routeDescription"].setValue(this.tableData.map((item) => item.cityName).join("~"));
  }
}
