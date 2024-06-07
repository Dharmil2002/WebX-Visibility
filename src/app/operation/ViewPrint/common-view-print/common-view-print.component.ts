import { Component, OnInit, Renderer2 } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { MasterService } from "src/app/core/service/Masters/master.service";
import { StorageService } from "src/app/core/service/storage.service";

@Component({
  selector: "app-common-view-print",
  templateUrl: "./common-view-print.component.html",
})
export class CommonViewPrintComponent implements OnInit {
  showView = false;
  HtmlTemplate;
  FieldMapping: any;
  companyCode = 0;
  JsonData;
  templateBody: any;
  copyName: any;

  constructor(
    private renderer: Renderer2,
    private router: ActivatedRoute,
    private masterService: MasterService,
    private storage: StorageService
  ) {
    this.companyCode = this.storage.companyCode;

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
      this.templateBody = JSON.parse(params["templateBody"]);
    }); //Get Parameters
  }

  ngOnInit(): void {
    this.GetviewPrint(); // Template Data
  }

  async GetviewPrint() {
    let req = {
      companyCode: this.companyCode,
      docType: this.templateBody.templateName,
      PartyField: this.templateBody?.PartyField,
      DocNo: this.templateBody.DocNo,
    };
    const Res = await firstValueFrom(this.masterService.masterPost("viewprint/ViewV2", req));
    if (Res.success) {
      this.JsonData = Res.data.jsonData || {};
      this.FieldMapping = Res.data.fieldMapping || [];
      this.HtmlTemplate = Res.data.Template || '';
      this.copyName = Res.data?.copyName || ["Primary Copy"];
      this.showView = true;
    }
  }
}
