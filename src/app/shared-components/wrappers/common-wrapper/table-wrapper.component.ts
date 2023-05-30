import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-common-wrapper-webxpress',
  templateUrl: './table-wrapper.component.html',
})
export class CommonWrapperComponent implements OnInit {

  @Input() breadscrums:any
  @Input() loadTable:any
  constructor() { }

  ngOnInit(): void {    
  }

}
