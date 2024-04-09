import { DOCUMENT } from "@angular/common";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
} from "@angular/core";
import { StoreKeys } from "src/app/config/myconstants";
import { StorageService } from "src/app/core/service/storage.service";

@Component({
  selector: "app-dashboard-layout",
  templateUrl: "./dashboard-layout.component.html",
  styleUrls: [],
})
export class DashboardLayoutComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public elementRef: ElementRef,
    private renderer: Renderer2,
    private storageService: StorageService
  ) {}

  ngOnInit(): void {
    const selectedBgColor = "blue";    
    this.renderer.addClass(this.document.body, "theme-" + selectedBgColor);
    this.storageService.setItem(StoreKeys.Choose_Skin, "theme-" + selectedBgColor);
    this.storageService.setItem(StoreKeys.Choose_Skin_Active, selectedBgColor);
    this.storageService.setItem(StoreKeys.MenuOption, "menu_dark");
    this.storageService.setItem(StoreKeys.Choose_LogoHeader, "logo-black");
  }
}
