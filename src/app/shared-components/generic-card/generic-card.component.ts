import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-generic-card-webxpress',
  templateUrl: './generic-card.component.html'
})
export class GenericCardComponent implements OnInit {
  @Input() boxData: any[];
  ngOnChanges(changes: SimpleChanges) {
    this.boxData=changes.boxData.currentValue

    }
  constructor() {
    console.log(this.boxData);
   }

  ngOnInit(): void {
  }

}
