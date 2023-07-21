import { Component, Input, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { SnackBarUtilityService } from 'src/app/Utility/SnackBarUtility.service';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { UnsubscribeOnDestroyAdapter } from 'src/app/shared/UnsubscribeOnDestroyAdapter';
import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';

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

  constructor(
    public objSnackBarUtility: SnackBarUtilityService, private masterService: MasterService
  ) {
    super();
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

    // Prepare the requests for different collections
    let locationReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "type": "masters",
      "collection": "location_detail"
    };

    let userReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "type": "masters",
      "collection": "user_detail"
    };

    let vendorReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "type": "masters",
      "collection": "vendor_detail"
    };

    let customerReq = {
      "companyCode": parseInt(localStorage.getItem("companyCode")),
      "type": "masters",
      "collection": "customer_detail"
    };

    // Use forkJoin to make parallel requests and get all data at once
    forkJoin([
      this.masterService.masterPost('common/getall', locationReq),
      this.masterService.masterPost('common/getall', userReq),
      this.masterService.masterPost('common/getall', vendorReq),
      this.masterService.masterPost('common/getall', customerReq)
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
    if (
      this.tableData[0].documentType.length === 0 ||
      this.tableData[0].bookCode === "" ||
      this.tableData[0].seriesFrom === "" ||
      this.tableData[0].seriesTo === "" ||
      this.tableData[0].totalLeaf === "" ||
      this.tableData[0].allotTo.length === 0 ||
      this.tableData[0].allocateTo.length === 0
    ) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Data",
        text: "Please fill in all the required fields.",
        showConfirmButton: true,
      });
    } else if (this.isBookCodeUnique()) {
      this.tableData.forEach(tableItem => {
        const optionItem = this.displayedColumns1.allocateTo.option.find(optItem => optItem.value === tableItem.allocateTo);
        if (optionItem) {
          tableItem.type = optionItem.type;
        }
      });
      // Now, add the 'id' property to each object in the 'tableData' array
      this.tableData = this.tableData.map(item => {
        return { ...item, id: item.bookCode };
      });

      // Continue with the rest of the code (e.g., exporting data)
      let req = {
        companyCode: parseInt(localStorage.getItem("companyCode")),
        type: "masters",
        collection: "dcr",
        data: this.tableData
      };
      this.masterService.masterPost('common/create', req).subscribe({
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
    const seriesFrom = this.tableData[0].seriesFrom;
    let seriesTo = this.tableData[0].seriesTo;
    let totalLeaf = this.tableData[0].totalLeaf;

    if (seriesFrom.length !== 12) {
      Swal.fire({
        icon: "warning",
        title: "Alert",
        text: `Series From should have a length of 12.`,
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
    this.tableData[0].seriesTo = seriesTo;
    this.tableData[0].totalLeaf = totalLeaf;
  }


  // getAllocateToDropdown() {
  //   // Prepare the requests for different collections
  //   let locationReq = {
  //     "companyCode": parseInt(localStorage.getItem("companyCode")),
  //     "type": "masters",
  //     "collection": "location_detail"
  //   };

  //   let userReq = {
  //     "companyCode": parseInt(localStorage.getItem("companyCode")),
  //     "type": "masters",
  //     "collection": "user"
  //   };

  //   let vendorReq = {
  //     "companyCode": parseInt(localStorage.getItem("companyCode")),
  //     "type": "masters",
  //     "collection": "vendor"
  //   };

  //   let customerReq = {
  //     "companyCode": parseInt(localStorage.getItem("companyCode")),
  //     "type": "masters",
  //     "collection": "customer"
  //   };

  //   // Use forkJoin to make parallel requests and get all data at once
  //   forkJoin([
  //     this.masterService.masterPost('common/getall', locationReq),
  //     this.masterService.masterPost('common/getall', userReq),
  //     this.masterService.masterPost('common/getall', vendorReq),
  //     this.masterService.masterPost('common/getall', customerReq)
  //   ]).pipe(
  //     map(([locationRes, userRes, vendorRes, customerRes]) => {
  //       // Combine all the data into a single object
  //       return {
  //         locationData: locationRes?.data,
  //         userData: userRes?.data,
  //         vendorData: vendorRes?.data,
  //         customerData: customerRes?.data
  //       };
  //     })
  //   ).subscribe((mergedData) => {
  //     // Access the merged data here
  //     const locdet = mergedData.locationData.map(element => ({
  //       name: element.locName,
  //       value: element.locCode,
  //       type: 'L'
  //     }));

  //     const userdet = mergedData.userData.map(element => ({
  //       name: element.name,
  //       value: element.userId,
  //       type: 'E'
  //     }));

  //     const vendordet = mergedData.vendorData.map(element => ({
  //       name: element.vendorName,
  //       value: element.vendorCode,
  //       type: 'B'
  //     }));

  //     const custdet = mergedData.customerData.map(element => ({
  //       name: element.customerName,
  //       value: element.customerCode,
  //       type: 'C'
  //     }));

  //     // Combine all arrays into one flat array with extra data indicating the sections
  //     const allData = [
  //       { name: '---Location---', value: '', type: 'L' },
  //       ...locdet,
  //       { name: '---Employee---', value: '', type: 'E' },
  //       ...userdet,
  //       { name: '---BA---', value: '', type: 'B' },
  //       ...vendordet,
  //       { name: '---Customer---', value: '', type: 'C' },
  //       ...custdet,
  //     ];
  //     console.log(allData);
  //   });
  // }

}
