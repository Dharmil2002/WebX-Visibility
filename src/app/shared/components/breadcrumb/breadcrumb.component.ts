import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.sass"],
})
export class BreadcrumbComponent {
  @Input() title: string;
  @Input() items: string[];
  @Input() backPath;
  @Input() active_item: string;
  @Input() generatecontrol: boolean; // Assuming this controls the toggle visibility
  @Input() toggle: boolean;
  @Output() toggleChange = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  onToggleChange(event: any) {
    this.toggleChange.emit(event.checked);
  }
  cancel() {
    this.router.navigateByUrl(this.backPath);
  }
}
