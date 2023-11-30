import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-generic-card-with-menu-actions',
  templateUrl: './generic-card-with-menu-actions.component.html',
})
export class GenericCardWithMenuActionsComponent {
  @Input() boxData: any;
  @Output() functionCallEmitter = new EventEmitter();
  ngOnChanges(changes: SimpleChanges) {
    this.boxData = changes.boxData?.currentValue
  }
  handleItemClick(item) {
    this.functionCallEmitter.emit({ functionName: "MultiLevelMenuClick", data: item })
  }

  //    this.Transactions = {
  //   Title: "Transactions",
  //   Items: [
  //     {
  //       title: "THC Advance / Balance",
  //       class: "info-box7  bg-c-Bottle-light order-info-box7",
  //       Menu: [
  //         {
  //           id: 1,
  //           title: "THC Payments",
  //           SubMenu: [
  //             {
  //               id: 11,
  //               title: "Advance Payment",
  //               InnerMenu: [
  //                 {
  //                   id: 111,
  //                   title: "THC Amount details",
  //                 },
  //               ],
  //             },
  //             {
  //               id: 21,
  //               title: "Balance Payment",
  //               InnerMenu: [
  //                 {
  //                   id: 211,
  //                   title: "THC Amount details",
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       title: "Payment to Business Associates",
  //       class: "info-box7 bg-c-Grape-light order-info-box7",
  //     },
  //     {
  //       title: "Pick up and Delivery Payments",
  //       class: "info-box7 bg-c-Daisy-light order-info-box7",
  //     },
  //     {
  //       title: "Payment against PO",
  //       class: "info-box7  bg-c-Grape-light order-info-box7",
  //     },
  //     {
  //       title: "Payment Against Consignments",
  //       class: "info-box7 bg-c-Grape-light order-info-box7",
  //     },
  //     {
  //       title: "Payment Against Trips",
  //       class: "info-box7 bg-c-Daisy-light order-info-box7",
  //     },
  //   ],
  // };

}
