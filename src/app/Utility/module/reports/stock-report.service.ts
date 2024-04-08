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

    const matchQuery = {
      'D$and': [{ sTS: { D$nin: [10,13] } },
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
      data.locationType === 'OriginLocation' ? { 'oRGN': { 'D$in': data.cumulativeLocation } } : { 'cLOC': { 'D$in': data.cumulativeLocation } },
      ...(data.fromLocation ? [{ 'oRGN': { 'D$eq': data.fromLocation } }] : []),
      ...(data.toLocation ? [{ 'dEST': { 'D$eq': data.toLocation } }] : []),
      ...(data.stockType ? this.getStockTypeQuery(data) : []),
      ...(data.modeList.length > 0 ? [{ 'D$expr': { D$in:["$details.tRNMOD", data.modeList]} }] : []),
      ...(data.paybasisList.length > 0 ? [{ 'D$expr': { D$in:["$details.pAYTYP", data.paybasisList]} }] : [])
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
        ...this.getLookupQuery(data),
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
              D$ifNull: ["$pKGS", 0],
            },
            ActualWeight: {
              D$ifNull: ["$aCTWT", 0],
            },
            ChargedWeight: {
              D$ifNull: ["$cHRWT", 0],
            },
            Freight: {
              D$ifNull: ["$details.fRTAMT", 0],
            },
            SubTotal: {
              D$ifNull: ["$details.gROAMT", 0],
            },
            GSTCharged: {
              D$ifNull: ["$details.gSTCHAMT", 0],
            },
            CnoteTotal: {
              D$ifNull: ["$details.tOTAMT", 0],
            },
            StockType: {
              D$ifNull: ["$StockType", 0],
            },
            StockTypeId: {
              D$ifNull: ["$StockTypeId", 0],
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
      res.data.forEach(item => {
        item.CDate = item.CDate ? moment(item.CDate).format('DD MMM YY') : '';
        item.ArrivedDate = item.ArrivedDate ? moment(item.ArrivedDate).format('DD MMM YY') : '';
      });
      return res.data.filter(item => item.StockTypeId > 0);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return [];
    }
  }

  //#endregion
  
  async getStockSummary(data) {

    const matchQuery = {
      'D$and': [{ sTS: { D$nin: [10,13] } },
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
      data.locationType === 'OriginLocation' ? { 'oRGN': { 'D$in': data.cumulativeLocation } } : { 'cLOC': { 'D$in': data.cumulativeLocation } },
      ...(data.fromLocation ? [{ 'oRGN': { 'D$eq': data.fromLocation } }] : []),
      ...(data.toLocation ? [{ 'dEST': { 'D$eq': data.toLocation } }] : []),
      ...(data.stockType ? this.getStockTypeQuery(data) : []),      
      ...(data.modeList.length > 0 ? [{ 'D$expr': { D$in:["$details.tRNMOD", data.modeList]} }] : []),
      ...(data.paybasisList.length > 0 ? [{ 'D$expr': { D$in:["$details.pAYTYP", data.paybasisList]} }] : [])
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
        ...this.getLookupQuery(data),
        {
          D$group: {
            _id: {
              D$concat: [
                "$cLOC",
                "-",
                {
                  D$toString: "$StockTypeId",
                },
              ],
            },
            loc: {
              D$first: "$cLOC",
            },
            StockTypeId: {
              D$first: "$StockTypeId",
            },
            StockType: {
              D$first: "$StockType",
            },
            Dockets: {
              D$sum: 1,
            },
            Packages: {
              D$sum: "$pKGS",
            },
            ActWeight: {
              D$sum: "$aCTWT",
            },
            ChgWeight: {
              D$sum: "$cHRWT",
            },
            Freight: {
              D$sum: "$details.fRTAMT",
            },
            OtherAmt: {
              D$sum: "$details.oTHAMT",
            },
            SubTotal: {
              D$sum: "$details.gROAMT",
            },
            GST: {
              D$sum: "$details.gSTCHAMT",
            },
            Total: {
              D$sum: "$details.tOTAMT",
            },
          },
        },
      ]
    }

    try {
      const res = await firstValueFrom(this.masterService.masterMongoPost('generic/query', reqBody));        
      return res.data.filter(item => item.StockTypeId > 0);
    } catch (error) {
      console.error('Error fetching stock data:', error);
      return [];
    }
  }

  //#endregion

  getStockTypeQuery(data) {
    var stockTypeQuery = [];
    switch (data.stockType.toString()) {
      case '1':
        stockTypeQuery.push({
          D$or: [
            {
              sTS: { D$in: [0, 1] },
            },
            {
              D$and: [
                { sTS: { D$in: [2, 3] } } ,
                { $expr: { D$eq: ["$cLOC", "$oRGN" ] } }              ],
            },
          ]
        });
        break;
      case '2':
        stockTypeQuery.push({
          sTS: { D$eq: 4 },
        });
        break;
      case '3':
        stockTypeQuery.push({
          D$or: [
            { sTS: { D$eq: 6 }},
            {
              D$and: [
                { sTS: { D$eq: 5 } } ,
                { $expr: { D$ne: ["$cLOC", "$dEST" ] } }
              ]
            },
            {
              D$and: [
                { sTS: { D$in: [2, 3] } } ,
                { $expr: { D$ne: ["$cLOC", "$oRGN" ] } },
                { $expr: { D$ne: ["$cLOC", "$dEST" ] } }
              ],
            }
          ]
        });
        break;
      case '4':
        stockTypeQuery.push({
          D$or: [
            {
              D$and: [
                { sTS: { D$eq: 5 } } ,
                { $expr: { D$eq: ["$cLOC", "$dEST" ] } }
              ]
            },
            {
              sTS: { D$in: [7, 8, 11]}
            }
          ]
        });
        break;
      case '5':
        stockTypeQuery.push({
          sTS: { D$eq: 9 }    
        });
        break;
      default:
        stockTypeQuery = [];
        break;
    }
    return stockTypeQuery;
  }

  getLookupQuery(data) {
    return [
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
                D$in: ["$sTS", [10,13] ],
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
                    D$eq: [ "$StockTypeId", 1],
                  },
                  then: "Booking Stock",
                },
                {
                  case: {
                    D$eq: [ "$StockTypeId", 2],
                  },
                  then: "In Transit Stock",
                },
                {
                  case: {
                    D$eq: [ "$StockTypeId", 3],
                  },
                  then: "Transhipment Stock",
                },
                {
                  case: {
                    D$eq: [ "$StockTypeId", 4],
                  },
                  then: "Delivery Stock",
                },
                {
                  case: {
                     D$eq: [ "$StockTypeId", 5],
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
    ]
  }
}
