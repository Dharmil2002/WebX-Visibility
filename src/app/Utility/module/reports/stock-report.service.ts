import { Injectable } from '@angular/core';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class StockReportService {

  constructor(private masterService: MasterService,
    private storage: StorageService,) { }

  //#region to get cheque register report data as per the query
  async getStockData(data) {

    // const reqBody = {
    //   companyCode: this.storage.companyCode,
    //   collectionName: 'docket_ops_det_ltl',
    //   filters: [
    //     {
    //       D$match: {
    //         D$and: [
    //           { sTS: { D$ne: 10 } },
    //           // ...(data.dateType === 'ArrivedDate') ? {
    //           //   'D$and': [
    //           //     { 'sTS': { 'D$eq': 5 } },
    //           { 'sTSTM': { 'D$gte': data.startDate, 'D$lte': data.endDate } },
    //           // ]              },
    //           ...(data.locationType === 'OriginLocation' ? [{ oRGN: { 'D$in': data.cumulativeLocation } }] : [{ 'cLOC': { 'D$in': data.cumulativeLocation } }]),
    //           ...(data.fromLocation ? [{ 'oRGN': { 'D$eq': data.fromLocation } }] : []),
    //           ...(data.toLocation ? [{ 'dEST': { 'D$eq': data.toLocation } }] : []),
    //           ...(data.stockType ? [{ 'sTSNM': { 'D$eq': data.stockType } }] : []),
    //           //cLOC: "MUMB",              
    //           {
    //             iSDEL: {
    //               D$in: [null, false],
    //             },
    //           },
    //         ],
    //       },
    //     },
    //     {
    //       D$lookup: {
    //         from: "dockets_ltl",
    //         let: {
    //           dKTNO: "$dKTNO",
    //         },
    //         pipeline: [
    //           {
    //             D$match: {
    //               D$expr: {
    //                 D$eq: ["$dKTNO", "$$dKTNO"],
    //               },
    //               cNL: {
    //                 D$in: [false, null],
    //               },
    //               // dKTDT: {
    //               //   D$gte: data.startDate,
    //               //   D$lte: data.endDate,
    //               // },
    //               ...(data.modeList.length > 0 ? [{ 'tRNMOD': { 'D$in': data.modeList } }] : []),
    //               ...(data.paybasisList.length > 0 ? [{ 'pAYTYP': { 'D$in': data.paybasisList } }] : [])
    //             },
    //           },
    //         ],
    //         as: "details",
    //       },
    //     },
    //     {
    //       D$addFields: {
    //         details: {
    //           D$arrayElemAt: ["$details", 0],
    //         },
    //       },
    //     },
    //     {
    //       D$addFields: {
    //         ConsigneeName: {
    //           D$concat: [
    //             "$details.cSGE.cD",
    //             " : ",
    //             "$details.cSGE.nM",
    //           ],
    //         },
    //         ConsinorName: {
    //           D$concat: [
    //             "$details.cSGN.cD",
    //             " : ",
    //             "$details.cSGN.nM",
    //           ],
    //         },
    //         InStock: {
    //           D$cond: {
    //             if: {
    //               D$eq: ["$sTS", 10],
    //             },
    //             then: false,
    //             else: true,
    //           },
    //         },
    //         StockTypeId: {
    //           D$switch: {
    //             branches: [
    //               {
    //                 case: {
    //                   D$in: ["$sTS", [0, 1]],
    //                 },
    //                 then: 1,
    //               },
    //               {
    //                 case: {
    //                   D$and: [
    //                     {
    //                       D$in: ["$sTS", [2, 3]],
    //                     },
    //                     {
    //                       D$eq: ["$cLOC", "$oRGN"],
    //                     },
    //                   ],
    //                 },
    //                 then: 1,
    //               },
    //               {
    //                 case: {
    //                   D$in: ["$sTS", [4]],
    //                 },
    //                 then: 2,
    //               },
    //               {
    //                 case: {
    //                   D$and: [
    //                     {
    //                       D$in: ["$sTS", [5]],
    //                     },
    //                     {
    //                       D$ne: ["$cLOC", "$dEST"],
    //                     },
    //                   ],
    //                 },
    //                 then: 3,
    //               },
    //               {
    //                 case: {
    //                   D$in: ["$sTS", [6]],
    //                 },
    //                 then: 3,
    //               },
    //               {
    //                 case: {
    //                   D$and: [
    //                     {
    //                       D$in: ["$sTS", [2, 3]],
    //                     },
    //                     {
    //                       D$ne: ["$cLOC", "$oRG"],
    //                     },
    //                     {
    //                       D$ne: ["$cLOC", "$dEST"],
    //                     },
    //                   ],
    //                 },
    //                 then: 3,
    //               },
    //               {
    //                 case: {
    //                   D$and: [
    //                     {
    //                       D$in: ["$sTS", [5]],
    //                     },
    //                     {
    //                       D$eq: ["$cLOC", "$dEST"],
    //                     },
    //                   ],
    //                 },
    //                 then: 4,
    //               },
    //               {
    //                 case: {
    //                   D$in: ["$sTS", [7, 8, 11]],
    //                 },
    //                 then: 4,
    //               },
    //               {
    //                 case: {
    //                   D$eq: ["$sTS", 9],
    //                 },
    //                 then: 5,
    //               },
    //             ],
    //             default: 0,
    //           },
    //         },
    //       },
    //     },
    //     {
    //       D$addFields: {
    //         StockType: {
    //           D$switch: {
    //             branches: [
    //               {
    //                 case: {
    //                   StockTypeId: 1,
    //                 },
    //                 then: "Booking Stock",
    //               },
    //               {
    //                 case: {
    //                   StockTypeId: 2,
    //                 },
    //                 then: "In Transit Stock",
    //               },
    //               {
    //                 case: {
    //                   StockTypeId: 3,
    //                 },
    //                 then: "Transhipment Stock",
    //               },
    //               {
    //                 case: {
    //                   StockTypeId: 4,
    //                 },
    //                 then: "Delivery Stock",
    //               },
    //               {
    //                 case: {
    //                   StockTypeId: 5,
    //                 },
    //                 then: "Gone For Delivery",
    //               },
    //             ],
    //             default: "Not In Stock",
    //           },
    //         },
    //       },
    //     },
    //     {
    //       D$lookup: {
    //         from: "trip_Route_Schedule",
    //         let: {
    //           tHC: "$tHC",
    //         },
    //         pipeline: [
    //           {
    //             D$match: {
    //               D$and: [
    //                 {
    //                   D$expr: {
    //                     D$eq: ["$tHC", "$$tHC"],
    //                   },
    //                 },
    //                 {
    //                   cNL: {
    //                     D$in: [false, null],
    //                   },
    //                 },
    //                 {
    //                   sTS: {
    //                     D$in: [4, 5],
    //                   },
    //                 },
    //               ],
    //             },
    //           },
    //         ],
    //         as: "tHCdetails",
    //       },
    //     },
    //     {
    //       D$addFields: {
    //         tHCdetails: {
    //           D$arrayElemAt: ["$tHCdetails", 0],
    //         },
    //       },
    //     },
    //     {
    //       D$project: {
    //         _id: 0,
    //         CNote: {
    //           D$ifNull: ["$dKTNO", ""],
    //         },
    //         CDate: {
    //           D$ifNull: ["$details.dKTDT", ""],
    //         },
    //         OriginLocation: {
    //           D$ifNull: ["$oRGN", ""],
    //         },
    //         DestinationLocation: {
    //           D$ifNull: ["$dEST", ""],
    //         },
    //         CurrentLocation: {
    //           D$ifNull: ["$cLOC", ""],
    //         },
    //         EDD: "",
    //         Paybas: {
    //           D$ifNull: ["$details.pAYTYPNM", ""],
    //         },
    //         TransportMode: {
    //           D$ifNull: ["$details.tRNMODNM", ""],
    //         },
    //         FlowType: {
    //           D$ifNull: ["$details.oSTSN", ""],
    //         },
    //         ArrivedDate: {
    //           D$cond: {
    //             if: {
    //               D$eq: ["$details.oSTS", 5],
    //             },
    //             then: "$sTSTM",
    //             else: "",
    //           },
    //         },
    //         THCNextLocation: {
    //           D$ifNull: ["$tHCdetails.nXTLOC", ""],
    //         },
    //         PackagesNo: {
    //           D$ifNull: ["$pKGS", ""],
    //         },
    //         ActualWeight: {
    //           D$ifNull: ["$aCTWT", ""],
    //         },
    //         ChargedWeight: {
    //           D$ifNull: ["$cHRWT", ""],
    //         },
    //         Freight: {
    //           D$ifNull: ["$details.fRTAMT", ""],
    //         },
    //         SubTotal: {
    //           D$ifNull: ["$details.gROAMT", ""],
    //         },
    //         GSTCharged: {
    //           D$ifNull: ["$details.gSTCHAMT", ""],
    //         },
    //         CnoteTotal: {
    //           D$ifNull: ["$details.tOTAMT", ""],
    //         },
    //         StockType: {
    //           D$ifNull: ["$StockType", ""],
    //         },
    //         FromCity: {
    //           D$ifNull: ["$details.fCT", ""],
    //         },
    //         ToCity: {
    //           D$ifNull: ["$details.tCT", ""],
    //         },
    //         ConsigneeName: {
    //           D$ifNull: ["$ConsigneeName", ""],
    //         },
    //         ConsinorName: {
    //           D$ifNull: ["$ConsinorName", ""],
    //         },
    //         PackageType: {
    //           D$ifNull: ["$details.pKGTYN", ""],
    //         },
    //         PickupDelivery: {
    //           D$ifNull: ["$details.dELTYN", ""],
    //         },
    //         DocketStatus: {
    //           D$ifNull: ["$details.oSTSN", ""],
    //         },
    //       },
    //     },
    //   ]
    // };

    const matchQuery = {
      'D$and': [{ sTS: { D$ne: 10 } },
      (data.dateType === 'BookingDate') ? {
        'D$and': [
          { 'D$expr': { 'D$gte': ['$details.dKTDT', data.startDate] } },
          { 'D$expr': { 'D$lte': ['$details.dKTDT', data.endDate] } }
        ]
      } : (data.dateType === 'ArrivedDate') ? {
        'D$and': [
          { 'D$expr': { 'sTS': { 'D$eq': 5 } } },
          { 'sTSTM': { 'D$gte': data.startDate, 'D$lte': data.endDate } }
        ]
      } : {
        'D$and': [
          { 'D$expr': { 'D$gte': ['$details.dKTDT', data.startDate] } },
          { 'D$expr': { 'D$lte': ['$details.dKTDT', data.endDate] } }
        ]
      },
      { 'iSDEL': { 'D$in': [null, false] } },
      data.locationType === 'OriginLocation' ? { 'oRGN': { '$in': data.cumulativeLocation } } : { 'cLOC': { '$in': data.cumulativeLocation } },
      ...(data.fromLocation ? [{ 'oRGN': { 'D$eq': data.fromLocation } }] : []),
      ...(data.toLocation ? [{ 'dEST': { 'D$eq': data.toLocation } }] : []),
      ...(data.stockType ? [{ 'sTSNM': { 'D$eq': data.stockType } }] : []),
      ...(data.modeList.length > 0 ? [{ 'D$expr': { '$details.tRNMOD': { 'D$in': data.modeList } } }] : []),
      ...(data.paybasisList.length > 0 ? [{ 'D$expr': { '$details.pAYTYP': { 'D$in': data.paybasisList } } }] : [])
      ]
    };
    const reqBody = {
      companyCode: this.storage.companyCode,
      collectionName: 'docket_ops_det_ltl',
      filters: [
        {
          D$lookup: {
            from: "dockets_ltl",
            localField: "dKTNO",
            foreignField: "dKTNO",
            as: "details",
          }
        },
        {
          D$unwind: "$details"
        },
        { D$match: matchQuery },

        {
          D$addFields: {
            ConsigneeName: {
              D$concat: [
                "$details.cSGE.cD",
                " : ",
                "$details.cSGE.nM",
              ],
            },
            ConsinorName: {
              D$concat: [
                "$details.cSGN.cD",
                " : ",
                "$details.cSGN.nM",
              ],
            },
            InStock: {
              D$cond: {
                if: {
                  D$eq: ["$sTS", 10],
                },
                then: false,
                else: true,
              },
            },
            StockTypeId: {
              D$switch: {
                branches: [
                  {
                    case: {
                      D$in: ["$sTS", [0, 1]],
                    },
                    then: 1,
                  },
                  {
                    case: {
                      D$and: [
                        {
                          D$in: ["$sTS", [2, 3]],
                        },
                        {
                          D$eq: ["$cLOC", "$oRGN"],
                        },
                      ],
                    },
                    then: 1,
                  },
                  {
                    case: {
                      D$in: ["$sTS", [4]],
                    },
                    then: 2,
                  },
                  {
                    case: {
                      D$and: [
                        {
                          D$in: ["$sTS", [5]],
                        },
                        {
                          D$ne: ["$cLOC", "$dEST"],
                        },
                      ],
                    },
                    then: 3,
                  },
                  {
                    case: {
                      D$in: ["$sTS", [6]],
                    },
                    then: 3,
                  },
                  {
                    case: {
                      D$and: [
                        {
                          D$in: ["$sTS", [2, 3]],
                        },
                        {
                          D$ne: ["$cLOC", "$oRG"],
                        },
                        {
                          D$ne: ["$cLOC", "$dEST"],
                        },
                      ],
                    },
                    then: 3,
                  },
                  {
                    case: {
                      D$and: [
                        {
                          D$in: ["$sTS", [5]],
                        },
                        {
                          D$eq: ["$cLOC", "$dEST"],
                        },
                      ],
                    },
                    then: 4,
                  },
                  {
                    case: {
                      D$in: ["$sTS", [7, 8, 11]],
                    },
                    then: 4,
                  },
                  {
                    case: {
                      D$eq: ["$sTS", 9],
                    },
                    then: 5,
                  },
                ],
                default: 0,
              },
            },
          },
        },
        {
          D$addFields: {
            StockType: {
              D$switch: {
                branches: [
                  {
                    case: {
                      StockTypeId: 1,
                    },
                    then: "Booking Stock",
                  },
                  {
                    case: {
                      StockTypeId: 2,
                    },
                    then: "In Transit Stock",
                  },
                  {
                    case: {
                      StockTypeId: 3,
                    },
                    then: "Transhipment Stock",
                  },
                  {
                    case: {
                      StockTypeId: 4,
                    },
                    then: "Delivery Stock",
                  },
                  {
                    case: {
                      StockTypeId: 5,
                    },
                    then: "Gone For Delivery",
                  },
                ],
                default: "Not In Stock",
              },
            },
          },
        },
        {
          D$lookup: {
            from: "trip_Route_Schedule",
            let: {
              tHC: "$tHC",
            },
            pipeline: [
              {
                D$match: {
                  D$and: [
                    {
                      D$expr: {
                        D$eq: ["$tHC", "$$tHC"],
                      },
                    },
                    {
                      cNL: {
                        D$in: [false, null],
                      },
                    },
                    {
                      sTS: {
                        D$in: [4, 5],
                      },
                    },
                  ],
                },
              },
            ],
            as: "tHCdetails",
          },
        },
        {
          D$addFields: {
            tHCdetails: {
              D$arrayElemAt: ["$tHCdetails", 0],
            },
          },
        },
        {
          D$project: {
            _id: 0,
            CNote: {
              D$ifNull: ["$dKTNO", ""],
            },
            CDate: {
              D$ifNull: ["$details.dKTDT", ""],
            },
            OriginLocation: {
              D$ifNull: ["$oRGN", ""],
            },
            DestinationLocation: {
              D$ifNull: ["$dEST", ""],
            },
            CurrentLocation: {
              D$ifNull: ["$cLOC", ""],
            },
            EDD: "",
            Paybas: {
              D$ifNull: ["$details.pAYTYPNM", ""],
            },
            TransportMode: {
              D$ifNull: ["$details.tRNMODNM", ""],
            },
            FlowType: {
              D$ifNull: ["$details.oSTSN", ""],
            },
            ArrivedDate: {
              D$cond: {
                if: {
                  D$eq: ["$details.oSTS", 5],
                },
                then: "$sTSTM",
                else: "",
              },
            },
            THCNextLocation: {
              D$ifNull: ["$tHCdetails.nXTLOC", ""],
            },
            PackagesNo: {
              D$ifNull: ["$pKGS", ""],
            },
            ActualWeight: {
              D$ifNull: ["$aCTWT", ""],
            },
            ChargedWeight: {
              D$ifNull: ["$cHRWT", ""],
            },
            Freight: {
              D$ifNull: ["$details.fRTAMT", ""],
            },
            SubTotal: {
              D$ifNull: ["$details.gROAMT", ""],
            },
            GSTCharged: {
              D$ifNull: ["$details.gSTCHAMT", ""],
            },
            CnoteTotal: {
              D$ifNull: ["$details.tOTAMT", ""],
            },
            StockType: {
              D$ifNull: ["$StockType", ""],
            },
            FromCity: {
              D$ifNull: ["$details.fCT", ""],
            },
            ToCity: {
              D$ifNull: ["$details.tCT", ""],
            },
            ConsigneeName: {
              D$ifNull: ["$ConsigneeName", ""],
            },
            ConsinorName: {
              D$ifNull: ["$ConsinorName", ""],
            },
            PackageType: {
              D$ifNull: ["$details.pKGTYN", ""],
            },
            PickupDelivery: {
              D$ifNull: ["$details.dELTYN", ""],
            },
            DocketStatus: {
              D$ifNull: ["$details.oSTSN", ""],
            },
          },
        },
      ]
    }



    try {
      const res = await firstValueFrom(this.masterService.masterMongoPost('generic/query', reqBody));
      console.log(res);
      res.data.forEach(item => {
        item.CDate = item.CDate ? moment(item.CDate).format('DD MMM YY') : '';
        item.ArrivedDate = item.ArrivedDate ? moment(item.ArrivedDate).format('DD MMM YY') : '';
      });
      return res.data;
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return [];
    }
  }

  //#endregion
}
