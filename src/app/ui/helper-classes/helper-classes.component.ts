import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-helper-classes',
  templateUrl: './helper-classes.component.html',
  styleUrls: ['./helper-classes.component.scss']
})
export class HelperClassesComponent implements OnInit {
  breadscrums = [
    {
      title: 'Helper Classes',
      items: ['UI'],
      active: 'Helper Classes'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
