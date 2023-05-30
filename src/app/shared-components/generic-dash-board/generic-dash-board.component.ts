import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import ApexCharts from 'apexcharts';
import moment from 'moment';
@Component({
  selector: 'app-generic-dash-board-webxpress',
  templateUrl: './generic-dash-board.component.html'
})
export class GenericDashBoardComponent implements OnInit {
  @Input() boxData: any[];
  @Input()series:any[];
  @Input()labels:any[]
  @Input()pieCharData:any[];
  public pieNewChartOptions: any;
  public avgLecChartOptions: any;
  public chartOptions:any;
  public pieChartOptions:any
  public timeLinechartOptions:any
  ngOnChanges(changes: SimpleChanges) {
  this.series=changes.series.currentValue
  this.labels=changes.labels.currentValue
  this.pieCharData=changes.pieCharData.currentValue
  this.initChartReport3() 
  this.initChartReport4();
  this.getNewReport();
  this.ColumnChart();
  }
  constructor() { }

  ngOnInit(): void {
    this.initChartReport3();
    this.initChartReport4();
    this.getNewReport();
    this.ColumnChart();
    this.timeLineChart()
  }
 initChartReport4() {
    this.avgLecChartOptions = {
      series: [
        {
          name: 'Avg. Lecture',
          data: this.series
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
        categories: this.labels,
        title: {
          text: 'Docket Branch'
        }
      },
      yaxis: {
        title: {
          text: 'Total Booked Docket'
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
  private initChartReport3() {
  
    this.pieChartOptions = {
      series: this.series,
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
      labels: this.labels,
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
      series: this.series,
      chart: {
        width: 380,
        type: "pie"
      },
      labels: this.labels,
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
  private ColumnChart(){
    let dataCountDetails = [];
    
    this.chartOptions = {
      series: [
        {
          data: this.series
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
        categories: this.labels
      },
      yaxis: {
        title: {
          text: "(docket)"
        }
      },
      fill: {
        opacity: 1
      },
      tooltip: {
        y: {
          formatter: function(val) {
            return  val + " docket";
          }
        }
      }
    };
  }
  private timeLineChart(){
    this.timeLinechartOptions = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "straight"
      },
      title: {
        text: "Product Trends by Month",
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep"
        ]
      }
    };
  }
  }
