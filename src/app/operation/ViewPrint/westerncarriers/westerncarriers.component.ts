import { Component, OnInit, Renderer2 } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MasterService } from "src/app/core/service/Masters/master.service";

@Component({
  selector: "app-westerncarriers",
  templateUrl: "./westerncarriers.component.html",
})
export class WESTERNCARRIERSComponent implements OnInit {
  companyCode = localStorage.getItem("companyCode");
  JsonData:any
  showView = false
  DocketNo: any;
  constructor(
    private renderer: Renderer2,
    private masterService: MasterService,
    private router: ActivatedRoute,
  ) {
    this.renderer.setStyle(
      document.querySelector("nav.navbar"),
      "display",
      "none"
    ); // Hide Navbar
    this.renderer.setStyle(
      document.querySelector("#leftsidebar"),
      "display",
      "none"
    ); //Hide Sidebars

    this.router.queryParams.subscribe((params) => {
      this.DocketNo = params["Docket"];
    });
  }

  ngOnInit(): void {
    this.getDocketData();
  }

  async getDocketData() {
    let req = {
      companyCode: this.companyCode,
      filter: { docketNumber: this.DocketNo },
      collectionName: "docket_temp",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
    console.log("Res", Res);
    if(Res.success && Res.data.length > 0){
      this.JsonData = Res.data[0];
      this.JsonData = {
        ...this.JsonData,
      }
      this.showView=true
    }
  }

  // data = {
  //   _id: "10065-CNDELB2324000011",
  //   docketNumber: "CNDELB2324000011",
  //   docketDate: "2023-10-18T02:42:19.000Z",
  //   billingParty: "HINDUSTAN UNILEAVER LIMITED",
  //   payType: "TBB",
  //   origin: "New Delhi",
  //   fromCity: "New Delhi",
  //   toCity: "Mumbai",
  //   destination: "Mumbai",
  //   prqNo: "",
  //   transMode: "Road",
  //   vendorType: "Own",
  //   vendorName: "WESTERN CARRIER LIMITED",
  //   pAddress: "Mahipalpur, Near Govt School, New Delhi - 110037",
  //   deliveryAddress:
  //     "45/36, Lower Parel Raod, Near to Lower Parel Railway Station, Mumbai",
  //   pr_lr_no: "6756778",
  //   edd: "2023-10-18T02:42:13.376Z",
  //   packaging_type: "BAG",
  //   weight_in: "Fixed",
  //   cargo_type: "Volume Cargo",
  //   gp_ch_del: "45564",
  //   risk: "owner",
  //   delivery_type: "Door Pickup - Door Delivery",
  //   rake_no: "24345",
  //   "issuing_from ": "None",
  //   vehicleNo: "HR55L3232",
  //   ccbp: true,
  //   cd: true,
  //   consignorName: "HINDUSTAN UNILEAVER LIMITED",
  //   ccontactNumber: "9311555369",
  //   calternateContactNo: "8989898989",
  //   consigneeName: "HINDUSTAN UNILEAVER LIMITED",
  //   cncontactNumber: "9311555369",
  //   cnalternateContactNo: "8989898989",
  //   companyCode: "10065",
  //   status: "1",
  //   freight_rate: "25000",
  //   freightRatetype: "F",
  //   freight_amount: "25000",
  //   otherAmount: "2000",
  //   grossAmount: "27000",
  //   rcm: "Y",
  //   gstAmount: "3500",
  //   gstChargedAmount: "0",
  //   totalAmount: "27000",
  //   invoiceDetails: [],
  //   containerDetail: [],
  //   isComplete: 1,
  //   unloading: 0,
  //   lsNo: "",
  //   mfNo: "",
  //   entryBy: null,
  //   entryDate: "2023-10-18T03:14:30.464Z",
  //   unloadloc: "",
  //   docNo: "CNDELB2324000011",
  // };
}
