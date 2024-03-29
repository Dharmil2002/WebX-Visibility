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
      'D$and': [{ sTS: { D$ne: 10 } },
      (data.dateType === 'BookingDate') ? {
        'D$and': [
          { 'D$expr': { '$details.dKTDT': { 'D$gte': data.startDate } } },
          { 'D$expr': { '$details.dKTDT': { 'D$lte': data.endDate } } }
        ]
      } : (data.dateType === 'ArrivedDate') ? {
        'D$and': [
          { 'D$expr': { 'sTS': { 'D$eq': 5 } } },
          { 'sTSTM': { 'D$gte': data.startDate, 'D$lte': data.endDate } }
        ]
      } : {
        'D$and': [
          { 'D$expr': { '$details.dKTDT': { 'D$gte': data.startDate } } },
          { 'D$expr': { '$details.dKTDT': { 'D$lte': data.endDate } } }
        ]
      },
      { 'iSDEL': { 'D$in': [null, false] } },
      ...(data.locationType === 'OriginLocation' ? [{ oRGN: { 'D$in': data.cumulativeLocation } }] : [{ 'cLOC': { 'D$in': data.cumulativeLocation } }]),
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
      filters: [{ 'D$match': matchQuery },
      { 'D$lookup': { from: 'dockets_ltl', let: { 'dKTNO': '$dKTNO' }, pipeline: [{ 'D$match': { 'D$and': [{ 'D$expr': { 'D$eq': ['$dKTNO', '$$dKTNO'] } }, { 'cNL': { 'D$in': [false, null] } }] } }], as: 'details' } },
      { 'D$addFields': { 'details': { 'D$arrayElemAt': ['$details', 0] } } },
      { 'D$lookup': { from: 'trip_Route_Schedule', let: { 'tHC': '$tHC' }, pipeline: [{ 'D$match': { 'D$and': [{ 'D$expr': { 'D$eq': ['$tHC', '$$tHC'] } }, { 'cNL': { 'D$in': [false, null] } }, { 'sTS': { 'D$in': [4, 5] } }] } }], as: 'tHCdetails' } },
      { 'D$addFields': { 'tHCdetails': { 'D$arrayElemAt': ['$tHCdetails', 0] } } },

      {
        'D$addFields': {
          'ConsigneeName': { 'D$concat': ['$details.cSGE.cD', ' : ', '$details.cSGE.nM'] },
          'ConsignorName': { 'D$concat': ['$details.cSGN.cD', ' : ', '$details.cSGN.nM'] },
          'InStock': { 'D$cond': { 'if': { 'D$eq': ['$sTS', 10] }, 'then': false, 'else': true } },
          'StockTypeId': {
            'D$switch': {
              'branches': [
                { 'case': { 'D$in': ['$sTS', [0, 1]] }, 'then': 1 },
                { 'case': { 'D$in': ['$sTS', [2, 3]] }, 'then': { 'D$cond': { 'if': { 'D$eq': ['$cLOC', '$oRGN'] }, 'then': 1, 'else': 3 } } },
                { 'case': { 'D$in': ['$sTS', [4]] }, 'then': 2 },
                { 'case': { 'D$in': ['$sTS', [5]] }, 'then': { 'D$cond': { 'if': { 'D$eq': ['$cLOC', '$dEST'] }, 'then': 4, 'else': 3 } } },
                { 'case': { 'D$in': ['$sTS', [6]] }, 'then': 3 },
                { 'case': { 'D$eq': ['$sTS', 9] }, 'then': 5 }
              ],
              'default': 0
            }
          },
          'StockType': {
            'D$switch': {
              'branches': [
                { 'case': { 'D$eq': ['$StockTypeId', 1] }, 'then': 'Booking Stock' },
                { 'case': { 'D$eq': ['$StockTypeId', 2] }, 'then': 'In Transit Stock' },
                { 'case': { 'D$eq': ['$StockTypeId', 3] }, 'then': 'Transhipment Stock' },
                { 'case': { 'D$eq': ['$StockTypeId', 4] }, 'then': 'Delivery Stock' },
                { 'case': { 'D$eq': ['$StockTypeId', 5] }, 'then': 'Gone For Delivery' }
              ],
              'default': 'Not In Stock'
            }
          }
        }
      },
      {
        'D$project': {
          '_id': 0,
          'CNote': { 'D$ifNull': ['$dKTNO', ''] },
          'CDate': { 'D$ifNull': ['$details.dKTDT', ''] },
          'OriginLocation': { 'D$ifNull': ['$oRGN', ''] },
          'DestinationLocation': { 'D$ifNull': ['$dEST', ''] },
          'CurrentLocation': { 'D$ifNull': ['$cLOC', ''] },
          'EDD': { 'D$ifNull': ['', ''] },
          'Paybas': { 'D$ifNull': ['$details.pAYTYPNM', ''] },
          'TransportMode': { 'D$ifNull': ['$details.tRNMODNM', ''] },
          'FlowType': { 'D$ifNull': ['$details.oSTSN', ''] },
          'ArrivedDate': { 'D$cond': { 'if': { 'D$eq': ['$details.oSTS', 5] }, 'then': '$sTSTM', 'else': '' } },
          'THCNextLocation': { 'D$ifNull': ['$tHCdetails.nXTLOC', ''] },
          'PackagesNo': { 'D$ifNull': ['$pKGS', ''] },
          'ActualWeight': { 'D$ifNull': ['$aCTWT', ''] },
          'ChargedWeight': { 'D$ifNull': ['$cHRWT', ''] },
          'Freight': { 'D$ifNull': ['$details.fRTAMT', ''] },
          'SubTotal': { 'D$ifNull': ['$details.gROAMT', ''] },
          'GSTCharged': { 'D$ifNull': ['$details.gSTCHAMT', ''] },
          'CnoteTotal': { 'D$ifNull': ['$details.tOTAMT', ''] },
          'StockType': { 'D$ifNull': ['$StockType', ''] },
          'FromCity': { 'D$ifNull': ['$details.fCT', ''] },
          'ToCity': { 'D$ifNull': ['$details.tCT', ''] },
          'ConsigneeName': { 'D$ifNull': ['$ConsigneeName', ''] },
          'ConsignorName': { 'D$ifNull': ['$ConsignorName', ''] },
          'PackageType': { 'D$ifNull': ['$details.pKGTYN', ''] },
          'PickupDelivery': { 'D$ifNull': ['$details.dELTYN', ''] },
          'DocketStatus': { 'D$ifNull': ['$details.oSTSN', ''] }
        }
      }
      ]
    };
    console.log(reqBody);

    try {
      const res = await firstValueFrom(this.masterService.masterMongoPost('generic/query', reqBody));
      console.log(res.data);
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
