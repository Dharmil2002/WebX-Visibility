import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { VendorContract } from 'src/app/core/models/Masters/Vendor Contract/VendorContract';
import Swal from 'sweetalert2';
import { BasicInformationComponent } from '../../Vendor Contract/vendor-tabs/basic-information/basic-information.component';
import { ServiceSelectionComponent } from '../../Vendor Contract/vendor-tabs/service-selection/service-selection.component';

@Component({
  selector: 'app-customer-contract-tabs-index',
  templateUrl: './customer-contract-tabs-index.component.html',
})
export class CustomerContractTabsIndexComponent implements AfterViewInit {
  @ViewChild(MatTabGroup) tabGroup: MatTabGroup;
  @ViewChild(BasicInformationComponent) basicInfo: BasicInformationComponent;
  @ViewChild(ServiceSelectionComponent) serviceselection: ServiceSelectionComponent;
  @Output() Submit: EventEmitter<any> = new EventEmitter();
  data: any;
  lastindex = 0;
  showcity = false;
  showdistance = false;

  selectedTabIndex = 0;
  previousTabIndex = 0;

  VendorInfo = new VendorContract()
  ngOnInit() {
    this.GetVendorContractDetails();
  }
  ngAfterContentChecked(): void {

  }
  onValueEmitted(value: any) {
    this.showcity = value.showcity;
    this.showdistance = value.showdistance;
  }
  breadscrums = [
    {
      title: "Vendor Contract",
      items: ["Home"],
      active: "Dashboard",
    },
  ];
  //#endregion
  initial_selected_value = 0;
  constructor(private router: Router, private route: ActivatedRoute,
    private changeDetectorRef: ChangeDetectorRef) {
    if (this.router.getCurrentNavigation()?.extras?.state != null) {
      this.data = this.router.getCurrentNavigation().extras.state.data;
    } else {
      const queryParams = this.route.snapshot.queryParams;
      if (queryParams && queryParams.details) {
        this.data = JSON.parse(atob(queryParams.details));
      }
    }


  }
  ngAfterViewInit(): void {
    //this.basicInfo;
    this.tabGroup._handleClick = this.customTabChange.bind(this);
  }

  customTabChange(tab: any, tabHeader: any, tabIndex: number): void {
    let changetab = true;
    let tabtoadd = this.showcity ? "Trip Lane Based" : "Trip Distance Based";
    const tabnames = ["Basic Information", "Service Selection", "Standard Charges", tabtoadd, "Special Charges"];

    // Check if the tabname is "Trip Lane Based" and skip the confirmation dialog
    if (tabnames[this.previousTabIndex] === "Trip Lane Based") {
      this.BindTab(tabIndex); // Move to another tab
    } else {
      this.SwalConfirm(tabnames[this.previousTabIndex]).then((result) => {
        if (result.isConfirmed) {
          if (this.previousTabIndex == 0) {
            changetab = this.basicInfo.CheckContractDate("");
            if (changetab) this.BindTab(tabIndex);
            else this.tabGroup.selectedIndex = this.previousTabIndex;
          } else if (this.previousTabIndex == 1) {
            //changetab = this.serviceselection.onSubmit("");
            if (changetab) {
              this.showcity = this.data.contractType === "1" || this.data.contractType === "2";
              this.showdistance = this.data.contractType === "3";
              this.BindTab(tabIndex);
            }
          } else if (this.previousTabIndex == 2) {
            //changetab = this.standardcharges.submit("");
            if (changetab) this.BindTab(tabIndex);
          } else if (this.showcity && this.previousTabIndex == 3) {
            this.BindTab(tabIndex);
          }
        } else {
          this.BindTab(tabIndex);
        }
      });
    }

  }
  BindTab(index) {
    this.previousTabIndex = index;
    this.tabGroup.selectedIndex = index;
    this.tabGroup._handleClick = this.customTabChange.bind(this);
  }
  SwalConfirm(message) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success msr-2',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    return swalWithBootstrapButtons.fire({
      title: `<h4><strong>Are you sure you want to save details in ${message}?</strong></h4>`,
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes!',
      showLoaderOnConfirm: true,
      allowOutsideClick: false,
    });
  }
  GetVendorContractDetails() {
    var request = {
      CompanyCode: +localStorage.getItem("CompanyCode"),
      VendorCode: this.data.vendorCode,
      ContractCode: this.data.contractCode
    }
    // this.IVendorContractService.VendorContractPost('Master/VendorContract/GetVendorContractDetails',request).subscribe({
    //   next:(res:any)=>{
    //     this.data=res[0];
    //     this.showcity = this.data.contractType === '1' || this.data.contractType === '2' || !this.data.contractType
    //     this.showdistance = this.data.contractType === '3';
    //   }
    // });
  }
}

