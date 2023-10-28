import { Component, OnInit, Renderer2 } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { FieldMapping, GetHtmlTemplate } from "./westerncarriers";
import moment from "moment";

@Component({
  selector: "app-westerncarriers",
  templateUrl: "./westerncarriers.component.html",
})
export class WESTERNCARRIERSComponent implements OnInit {
  companyCode = localStorage.getItem("companyCode");
  JsonData:any
  showView = false
  DocketNo: any;
  HtmlTemplate = ''
  FieldMapping = FieldMapping
  loopData = ['Accounts Copy' , 'Consignor Copy' , 'Consignee Copy' , 'Driver Copy' , 'Office Copy']

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
    this.HtmlTemplate = GetHtmlTemplate(this.loopData)
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
      const invoiceDetails = this.JsonData.invoiceDetails[0]
      const containerDetail = this.JsonData.containerDetail[0]

      this.JsonData = {
        ...this.JsonData,
        invoiceNo:invoiceDetails.invoiceNo,
        ewayBillNo:invoiceDetails.ewayBillNo,
        invoiceDetails:invoiceDetails,
        containerDetail:containerDetail,
        docketDate:moment(this.JsonData.docketDate).format('DD-MM-YYYY')
      }
      this.getCustomer()
    }
  }

  async getCustomer(){
    let req = {
      companyCode: this.companyCode,
      filter: {customerName:this.JsonData.billingParty},
      collectionName: "customer_detail",
    };
    const Res = await this.masterService
      .masterPost("generic/get", req)
      .toPromise();
      console.log('Res' ,Res)
      if(Res.success && Res.data.length > 0){
        const GSTdetails = Res.data[0].GSTdetails[0]
        this.JsonData = {
          ...this.JsonData,
          PANnumber:Res.data[0].PANnumber,
          gstNo:GSTdetails.gstNo,
          CINnumber:Res.data[0].CINnumber,
          Customer_Emails:typeof(Res.data[0].Customer_Emails)=='string'?Res.data[0].Customer_Emails:Res.data[0].Customer_Emails[0],
        }
      this.showView=true
      }
  }
}
