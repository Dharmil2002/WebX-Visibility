import { DOCUMENT } from "@angular/common";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
} from "@angular/core";

@Component({
  selector: "app-dashboard-layout",
  templateUrl: "./dashboard-layout.component.html",
  styleUrls: [],
})
export class DashboardLayoutComponent implements OnInit {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    public elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    var selectedBgColor = "blue";
    this.renderer.addClass(this.document.body, "theme-" + selectedBgColor);
    localStorage.setItem("choose_skin", "theme-" + selectedBgColor);
    localStorage.setItem("choose_skin_active", selectedBgColor);
  }
}
