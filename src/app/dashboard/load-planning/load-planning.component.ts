import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/core/service/auth.service";
import { EChartOption } from "echarts";
import { UnsubscribeOnDestroyAdapter } from "./../../shared/UnsubscribeOnDestroyAdapter";
import * as L from "leaflet";
import * as moment from "moment";
import "leaflet.gridlayer.googlemutant";
import { environment } from "src/environments/environment";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-load-planning',
  templateUrl: './load-planning.component.html',
  styleUrls: ['./load-planning.component.sass']
})
export class LoadPlanningComponent extends UnsubscribeOnDestroyAdapter
implements OnInit {
  numberFormat = environment.localNumberFormat;
  error = "";
  hide = true;
  Spinner=0;
  LayerGroup = L.layerGroup();
  public smallBarChart: any;
  public smallAreaChart: any;
  public smallColumnChart: any;
    displayProgressSpinner = false;

    breadscrums = [
    {
      title: "Order Dashboard",
      items: ["Home"],
      active: "Dashboard",
    },
  ];
  
  breadscrumsRoute = [
    {
      title: "Route Plans",
    },
  ];

  showDataLabel: boolean = true;
 
  constructor() { 
    super();
  }

  ngOnInit(): void {
  }

}
