import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-generic-card-webxpress',
  templateUrl: './generic-card.component.html'
})
export class GenericCardComponent implements OnInit {
  @Input() boxData: any;
  @Input() kpiData: any;
  ngOnChanges(changes: SimpleChanges) {
    this.boxData = changes.boxData?.currentValue
    this.kpiData = changes.kpiData?.currentValue
  }
  constructor() {
  }

  ngOnInit(): void {
  }

}
