import { Component, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MasterService } from 'src/app/core/service/Masters/master.service';

@Component({
  selector: 'app-common-view-print',
  templateUrl: './common-view-print.component.html'
})
export class CommonViewPrintComponent implements OnInit {
  showView = false;
  HtmlTemplate;
  FieldMapping: any;
  companyCode = localStorage.getItem("companyCode");
  JsonData;
  templateBody: any;
  constructor(
    private renderer: Renderer2,
    private router: ActivatedRoute,
    private masterService: MasterService
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
      this.templateBody = JSON.parse(params["templateBody"]) ;
    }); //Get Parameters
   }

  ngOnInit(): void {
    this.GetviewPrint() // Template Data
  }

  async GetviewPrint() {
    let req = {
      companyCode: this.companyCode,
      templateName: this.templateBody.templateName,
      DocNo: this.templateBody.DocNo,
    };
    const Res = await this.masterService
      .masterPost("viewprint/View", req)
      .toPromise();
    if (Res.success) {
      this.JsonData = Res.data.jsonData;
      this.FieldMapping = Res.data.fieldMapping;
      this.HtmlTemplate = Res.data.Template;
      this.showView = true;
    }
  }
}
