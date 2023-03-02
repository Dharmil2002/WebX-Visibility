import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-dkt-component',
  templateUrl: './dkt-component.component.html',
  styleUrls: ['./dkt-component.component.sass']
})
export class DktComponentComponent implements OnInit {
  @Input() myData: any;
  constructor() { }

  ngOnInit(): void {
  }

}
