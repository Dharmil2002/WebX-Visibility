import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import{CnoteService} from 'src/app/core/service/Masters/CnoteService/cnote.service'
@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html'
})
export class DashboardPageComponent implements OnInit {
  @ViewChild('myTabGroup') tabGroup!: MatTabGroup;

  breadscrums = [
    {
      title: "Network Logistics Management",
      items: ["Home"],
      active: "Network Logistics Management"
    }
  ]
  @ViewChild('myTabGroup') myTabGroup: MatTabGroup;
  detailtab: number;
  constructor(private changeDetectorRef: ChangeDetectorRef,private activeRoute: ActivatedRoute,private Route:Router,private ICnoteServicevice: CnoteService) {
    if (this.Route.getCurrentNavigation()?.extras?.state != null) {
    
    }
   }

  ngOnInit() {
   
  }
  ngAfterContentChecked(): void {
    this.changeDetectorRef?.detectChanges();
  }
  GetSelectedIndex(Index: number) {
    if(Index==2){
   
  }
    this.myTabGroup.selectedIndex = Index;
  }

  ngAfterViewInit(): void {
    this.activeRoute.queryParams.subscribe(params => {
      const selectedTabIndex = params['tab'];
      if (selectedTabIndex) {
        const index = Number(selectedTabIndex);
        this.tabGroup.selectedIndex = index;
      }
    });
  }

}
