import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-breadcrumb",
  templateUrl: "./breadcrumb.component.html",
  styleUrls: ["./breadcrumb.component.sass"],
})
export class BreadcrumbComponent {
  @Input() title: string;
  @Input() items: string[];
  @Input() active_item: string;
  @Input() generatecontrol: boolean; // Assuming this controls the toggle visibility
  @Input() toggle: boolean;
  @Output() toggleChange = new EventEmitter<boolean>();

  onToggleChange(event: any) {
    this.toggleChange.emit(event.checked);
  }
}