import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-generic-chart-dashboard-webxpress',
  templateUrl: './generic-chart-dashboard.component.html'
 
})
export class GenericChartDashboardComponent implements OnInit {
  @Input() dashboardControls: any[];
  @Input()columnData:{ seriesdata: any[]; labels: any[]; text:string; };
  @Input()pieChartData: { seriesdata: any[]; labels: any[]; text:string;};
  @Input()lineChartData: { seriesdata: any[]; labels: any[]; text:string;};
  @Input()advancePieChart: { seriesdata: any[]; labels: any[]; text:string;};

  public pieNewChartOptions: any;
  public avgLecChartOptions: any;
  public chartOptions:any;
  public pieChartOptions:any
  public timeLinechartOptions:any
  DashboadChartsdata: any;
  ngOnChanges(changes: SimpleChanges) {
    this.columnData=changes.columnData.currentValue
    this.pieChartData=changes.pieChartData.currentValue
    this.lineChartData=changes.lineChartData.currentValue
    this.advancePieChart=changes.advancePieChart.currentValue
    this.initChartReport3() 
    this.getNewReport();
    this.ColumnChart();
    this.initChartReport4();
    }
  constructor() {    
    this.initChartReport3();
    this.getNewReport();
    this.ColumnChart();
    this.initChartReport4();
   
  }

  ngOnInit(): void {
    this.DashboadChartsdata=this.dashboardControls.filter((x)=>x.Type !='box')
  }
  initChartReport3() {
  
    this.pieChartOptions = {
      series: this.advancePieChart?.seriesdata||[],
      chart: {
        type: 'donut',
        width: 200
      },
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      labels: this.advancePieChart?.labels||[],
      responsive: [
        {
          breakpoint: 480,
          options: {}
        }
      ]
    };
  }
  getNewReport() {
    this.pieNewChartOptions = {
      series: this.pieChartData?.seriesdata||[],
      chart: {
        width: 380,
        type: "pie"
      },
      labels: this.pieChartData?.labels||[],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
 ColumnChart(){
    this.chartOptions = {
      series: [
        {
          data: this.columnData?.seriesdata||[]
        },
       
      ],
      chart: {
        type: "bar",
        height: 350
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "55%",
          endingShape: "rounded"
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        show: true,
        width: 2,
        colors: ["transparent"]
      },
      xaxis: {
        categories: this.columnData?.labels||[]
      },
      yaxis: {
        title: {
          text: this.columnData?.text||''
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return  val + this.columnData?.text||'';
          }
        }
      }
    };
  }

  initChartReport4() {
    this.avgLecChartOptions = {
      series: [
        {
          name: this.lineChartData?.labels||[],
          data: this.lineChartData?.seriesdata||[]
        }
      ],
      chart: {
        height: 350,
        type: 'line',
        dropShadow: {
          enabled: true,
          color: '#000',
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        },
        foreColor: '#9aa0ac'
      },
      stroke: {
        curve: 'smooth'
      },
      xaxis: {
        categories: this.lineChartData?.labels||[],
        title: {
          text:this.lineChartData?.text||''
        }
      },
      yaxis: {
        title: {
          text: this.lineChartData?.text||''
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'dark',
          gradientToColors: ['#35fdd8'],
          shadeIntensity: 1,
          type: 'horizontal',
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100, 100, 100]
        }
      },
      markers: {
        size: 4,
        colors: ['#FFA41B'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
          size: 7
        }
      },
      tooltip: {
        theme: 'dark',
        marker: {
          show: true
        },
        x: {
          show: true
        }
      }
    };
  }

}
