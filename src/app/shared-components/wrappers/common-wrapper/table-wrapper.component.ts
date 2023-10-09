import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-wrapper-webxpress',
  templateUrl: './table-wrapper.component.html',
})
export class CommonWrapperComponent implements OnInit {

  @Input() breadscrums:any
  @Input() backPath;
  @Input() loadTable:any
  @Output() toggleChange = new EventEmitter<boolean>();
  @Input() toggle: boolean;
  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  cancel() {
    this.router.navigateByUrl(this.backPath);
  }

  onToggleChange(event: any) {
    this.toggleChange.emit(event);
  }
}
