import { Component, Input, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { AddDcrSeriesControl } from 'src/assets/FormControls/add-dcr-series';
import { formGroupBuilder } from 'src/app/Utility/formGroupBuilder';
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
@Component({
  selector: 'app-add-dcr-series',
  templateUrl: './add-dcr-series.component.html'
})
export class AddDcrSeriesComponent extends UnsubscribeOnDestroyAdapter implements OnInit {
  @Input() data: any;

  // Breadcrumbs
  breadScrums = [
    {
      title: "Add DCR Series",
      items: ["Document Control"],
      active: "Add DCR Series",
    },
  ];

  // Table data
  tableData: any = [];

  // Action buttons configuration
  actionObject = {
    addRow: true,
    submit: true,
    search: true
  };

  // Displayed columns configuration
  displayedColumns1 = {
    srNo: {
      name: "Sr No",
      key: "index",
      style: "",
    },
    documentType: {
      name: "Document Type",
      key: "Dropdown",
      option: [],
      style: "",
    },
    bookCode: {
      name: "Book Code",
      key: "inputString",
      style: "",
    },
    seriesFrom: {
      name: "Series From",
      key: "input",
      style: "",
      functions: {
        'onChange': "getSeriesFrom" // Function to be called on change event
      }
    },
    seriesTo: {
      name: "Series To",
      key: "input",
      style: "",
      functions: {
        'onChange': "getSeriesFrom" // Function to be called on change event
      }
    },
    totalLeaf: {
      name: "Total Leaf",
      key: "input",
      style: "",
      readonly: true,
    },
    allotTo: {
      name: "Allot To",
      key: "Dropdown",
      option: [],
      style: "",
    },
    allocateTo: {
      name: "Allocate To",
      key: "Dropdown",
      option: [],
      style: "",
    },
    action: {
      name: "Action",
      key: "Action",
      style: "",
    },
    allotType: {
      name: "",
      key: "",
      style: "",
    },
  };
  tableLoad: boolean;
  addDcrFormControl: AddDcrSeriesControl;
  jsonControlArray: any;
  addDcrTableForm: UntypedFormGroup;

  constructor(
    public objSnackBarUtility: SnackBarUtilityService,
    private masterService: MasterService,
    private fb: UntypedFormBuilder,
  ) {
    super();
    this.initializeFormControl();
  }

  ngOnInit() {
    this.loadTempData();
    this.getAllMastersData();
  }

  // Load temporary data
  loadTempData() {
    this.tableData = [{
      documentType: [],
      srNo: 0,
      bookCode: "",
      seriesFrom: "",
      seriesTo: "",
      totalLeaf: "",
      allotTo: [],
      allocateTo: []
    }];
  }

  // Add a new item to the table
  addItem() {
    const AddObj = {
      documentType: [],
      srNo: 0,
      bookCode: "",
      seriesFrom: "",
      seriesTo: "",
      totalLeaf: "",
      allotTo: [],
      allocateTo: []
    };
    this.tableData.splice(0, 0, AddObj);
  }
  documentTypeOptions = [
    { "name": "CNote", "value": "1" },
    { "name": "Delivery MR", "value": "2" },
    { "name": "UBI Series", "value": "3" }
  ];
  // Get all dropdown data
  getAllMastersData() {
    // Options for documentType dropdown
    this.displayedColumns1.documentType.option = this.documentTypeOptions;

    // Prepare the requests for different collectionNames
    let locationReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "filter": {},
      "collectionName": "location_detail"
    };

    let userReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "filter": {},
      "collectionName": "user_master"
    };

    let vendorReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "filter": {},
      "collectionName": "vendor_detail"
    };

    let customerReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "filter": {},
      "collectionName": "customer_detail"
    };

    // Use forkJoin to make parallel requests and get all data at once
    forkJoin([
      this.masterService.masterPost('generic/get', locationReq),
      this.masterService.masterPost('generic/get', userReq),
      this.masterService.masterPost('generic/get', vendorReq),
      this.masterService.masterPost('generic/get', customerReq)
    ]).pipe(
      map(([locationRes, userRes, vendorRes, customerRes]) => {
        // Combine all the data into a single object
        return {
          locationData: locationRes?.data,
          userData: userRes?.data,
          vendorData: vendorRes?.data,
          customerData: customerRes?.data
        };
      })
    ).subscribe((mergedData) => {
      // Access the merged data here
      const locdet = mergedData.locationData.map(element => ({
        name: element.locName,
        value: element.locCode,
        type: 'L'
      }));

      const userdet = mergedData.userData.map(element => ({
        name: element.name,
        value: element.userId,
        type: 'E'
      }));

      const vendordet = mergedData.vendorData.map(element => ({
        name: element.vendorName,
        value: element.vendorCode,
        type: 'B'
      }));

      const custdet = mergedData.customerData.map(element => ({
        name: element.customerName,
        value: element.customerCode,
        type: 'C'
      }));
      // Options for allotTo dropdown
      this.displayedColumns1.allotTo.option = locdet;
      this.tableLoad = true;

      // Combine all arrays into one flat array with extra data indicating the sections
      const allData = [
        { name: '---Location---', value: '', type: 'L' },
        ...locdet,
        { name: '---Employee---', value: '', type: 'E' },
        ...userdet,
        { name: '---BA---', value: '', type: 'B' },
        ...vendordet,
        { name: '---Customer---', value: '', type: 'C' },
        ...custdet,
      ];
      // Options for allocateTo dropdown
      this.displayedColumns1.allocateTo.option = allData
    });

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

  // Handle function calls
  functionCallHandler($event) {
    let functionName = $event.functionName;     // name of the function , we have to call

    try {
      this[functionName]($event);
    } catch (error) {
      console.log("failed");
    }
  }

  // Save data
  saveData() {
    let incompleteData = false;

    this.tableData.forEach(data => {
      if (
        data.documentType.length === 0 ||
        data.bookCode === "" ||
        data.seriesFrom === "" ||
        data.seriesTo === "" ||
        data.totalLeaf === "" ||
        data.allotTo.length === 0 ||
        data.allocateTo.length === 0
      ) {
        incompleteData = true;
        return;
      }
    });

    if (incompleteData) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Data",
        text: "Please fill in all the required fields.",
        showConfirmButton: true,
      });
      return;
    }

    if (this.isBookCodeUnique()) {
      this.tableData.forEach(tableItem => {
        const optionItem = this.displayedColumns1.allocateTo.option.find(optItem => optItem.value === tableItem.allocateTo);
        if (optionItem) {
          tableItem.type = optionItem.type;
          tableItem.status = 'Unused';
          tableItem.action = 'Allocated';
          tableItem.usedLeaves = 0;
          tableItem.entryBy = localStorage.getItem('Username');
          tableItem.entryDate = new Date().toISOString();
        }
      });
      // Now, add the 'id' property to each object in the 'tableData' array
      this.tableData = this.tableData.map(item => {
        return { ...item, _id: item.bookCode };
      });

      // Continue with the rest of the code (e.g., exporting data)
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        collectionName: "dcr",
        data: this.tableData
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
            window.location.reload();
          }
        }
      });
    } else {
      Swal.fire({
        icon: "warning",
        title: "Duplicate Book Code",
        text: "Each book code should be unique.",
        showConfirmButton: true,
      });
    }
  }

  isBookCodeUnique(): boolean {
    const bookCode = this.tableData[0].bookCode;
    // Check if any other item in the tableData has the same bookCode
    const isUnique = this.tableData.filter((item) => item.bookCode === bookCode).length === 1;
    return isUnique;
  }

  // Get series from input
  getSeriesFrom(): void {
    const seriesFrom = this.addDcrTableForm.value.seriesFrom;
    let seriesTo = this.addDcrTableForm.value.seriesTo;
    let totalLeaf = this.addDcrTableForm.value.totalLeaf;

    if (seriesFrom.length !== 12) {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: `Series From should have a length of 12 like S0000000000001.`,
        showConfirmButton: true,
      });
      return;
    }
    if (seriesTo !== '' && seriesTo.length !== 12) {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: `Series To should have a length of 12.`,
        showConfirmButton: true,
      });
      return;
    }
    if (seriesTo !== '' && seriesTo <= seriesFrom) {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: `Series To should be greater than Series From.`,
        showConfirmButton: true,
      });
      return;
    }

    if (seriesTo !== '') {
      const difference = parseInt(seriesTo, 10) - parseInt(seriesFrom, 10);
      totalLeaf = difference;
    } else {
      seriesTo = '';
      totalLeaf = '';
    }
    // this.tableData[0].seriesTo = seriesTo;
    // this.tableData[0].totalLeaf = totalLeaf;
  }
  //#region to initilize form control
  initializeFormControl() {
    this.addDcrFormControl = new AddDcrSeriesControl();
    this.jsonControlArray = this.addDcrFormControl.getAddDcrFormControls();
    this.addDcrTableForm = formGroupBuilder(this.fb, [this.jsonControlArray]);
    this.addDcrTableForm.controls["documentType"].setValue("CNote");

  }
  //#endregion

  //#region to set series to.
  getSeriesTo() {
    // Get the 'seriesFrom' and 'totalLeaf' values from the form control
    const { seriesFrom, totalLeaf } = this.addDcrTableForm.value;

    // Calculate the result by parsing 'seriesFrom' and 'totalLeaf' to numbers
    const resultNumber = parseInt(seriesFrom.slice(1), 10) + parseInt(totalLeaf, 10);

    // Build the 'ans' string with the calculated result and leading zeros
    const ans = seriesFrom[0] + resultNumber.toString().padStart(16, "0");

    // Set the 'seriesTo' value in the form control to 'ans'
    this.addDcrTableForm.controls.seriesTo.setValue(ans);
  }
  //#endregion
  //#region to add data in table
  async addData() {
    this.tableLoad = true;
    // this.isLoad = true;
    // const tableData = this.tableData;
    // const gstNumber = this.otherDetailForm.controls.gstNumber.value;
    // if (tableData.length > 0) {
    //   // Check if the gstNumber already exists in tableData
    //   const isDuplicate = this.tableData.some((item) => item.gstNumber === gstNumber);

    //   if (isDuplicate) {
    //     this.otherDetailForm.controls['gstNumber'].setValue('');
    //     // Show an error message using Swal (SweetAlert)
    //     Swal.fire({
    //       title: 'GST Number already exists! Please try with another.',
    //       toast: true,
    //       icon: 'error',
    //       showCloseButton: false,
    //       showCancelButton: false,
    //       showConfirmButton: true,
    //       confirmButtonText: 'OK'
    //     });
    //     this.tableLoad = false;
    //     this.isLoad = false;
    //     return false
    //   }
    // }
    // const delayDuration = 1000;
    // // Create a promise that resolves after the specified delay
    // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    // // Use async/await to introduce the delay
    // await delay(delayDuration);
    // const json = {
    //   id: tableData.length + 1,
    //   gstNumber: this.otherDetailForm.value.gstNumber,
    //   gstState: this.otherDetailForm.value.gstState,
    //   gstAddress: this.otherDetailForm.value.gstAddress,
    //   gstPincode: this.otherDetailForm.value.gstPincode.value,
    //   gstCity: this.otherDetailForm.value.gstCity,
    //   // invoice: false,
    //   actions: ['Edit', 'Remove']
    // }
    // this.tableData.push(json);
    // this.otherDetailForm.reset(); // Reset form values
    // this.isLoad = false;
    // this.tableLoad = false;
  }
  //#endregion

}