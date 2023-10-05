import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-common-wrapper-webxpress',
  templateUrl: './table-wrapper.component.html',
})
export class CommonWrapperComponent implements OnInit {

  @Input() breadscrums:any
  @Input() loadTable:any
  @Output() toggleChange = new EventEmitter<boolean>();
  constructor() { }

  ngOnInit(): void {    
  }
 
  onToggleChange(event: any) {
    this.toggleChange.emit(event);
  }
}