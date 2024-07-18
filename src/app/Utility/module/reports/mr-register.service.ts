import { Injectable } from '@angular/core';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';
import { SalesRegisterService } from './sales-register';

@Injectable({
  providedIn: 'root'
})
export class MrRegisterService {

  constructor(private masterService: MasterService,
    private storage: StorageService,
    private salesRegisterService: SalesRegisterService) { }

  /**
    * Retrieves MR register data based on the provided filters.
    * @param data - The filter data for the MR register.
    * @param optionalRequest - Optional request parameters for additional filtering.
    * @returns A Promise that resolves to an array of MR register data.
    */

  async getMrRegisterData(data, optionalRequest) {
    // Check if docNoArray exists and is not empty
    const hasMRNO = optionalRequest.docNoArray?.length > 0;
    // Check if CnotenosArray exists and is not empty
    const hasCnoteno = optionalRequest.CnotenosArray?.length > 0;

    // Set isEmptyDocNo based on the conditions
    const isEmptyDocNo = !hasCnoteno && !hasMRNO;

    let matchQuery

    if (isEmptyDocNo) {
      matchQuery = {
        'D$and': [
          { eNTDT: { 'D$gte': data.startDate } },
          { eNTDT: { 'D$lte': data.endDate } },
          ...(data.branch ? [{ 'eNTLOC': { 'D$eq': data.branch } }] : []),
          ...(data.customerList.length > 0 ? [{ bILNGPRT: { 'D$in': data.customerList } }] : [])
        ]
      };
    }

    if (!isEmptyDocNo) {
      matchQuery = {
        'D$and': []
      };

      // Condition: rNO in optionalRequest.docNoArray
      if (optionalRequest.docNoArray && optionalRequest.docNoArray.length > 0) {
        matchQuery['D$and'].push({ 'docNo': { 'D$in': optionalRequest.docNoArray } });
      }

      // Condition: details.tOT greater than or equal to optionalRequest.CnotenosArray
      if (optionalRequest.CnotenosArray && optionalRequest.CnotenosArray.length > 0) {
        matchQuery['D$and'].push({ 'gCNNO': { 'D$in': optionalRequest.CnotenosArray } });
      }
    }

    const reqBody = {
      companyCode: this.storage.companyCode,
      collectionName: 'delivery_mr_header',
      filters: [
        { D$match: matchQuery },
        {
          D$lookup: {
            from: "delivery_mr_details",
            localField: "docNo",
            foreignField: "dLMRNO",
            as: "details",
          }
        },

        {
          D$lookup: {
            from: "dockets_ltl",
            localField: "gCNNO", //base collection field
            foreignField: "dKTNO",//lookup collection field
            as: "docketDetails",
          },
        },
        {
          D$addFields: {
            Party: {
              D$concat: [
                { D$arrayElemAt: ["$docketDetails.bPARTY", 0] },
                " : ",
                { D$arrayElemAt: ["$docketDetails.bPARTYNM", 0] },
              ],
            },

          },
        },
        {
          D$addFields: {
            "charge": {
              D$map: {
                "input": "$details",
                "as": "item",
                "in": "$$item.cHG"
              }
            }
          }
        },
        {
          D$project: {
            _id: 0,   // Exclude the _id field
            MRNo: {
              D$ifNull: ["$docNo", ""],
            },
            MRDate: {
              D$ifNull: ["$eNTDT", ""],
            },
            MRTime: {
              D$ifNull: ["$eNTDT", ""],
            },
            MRType: "Delivery MR",
            MRLocation: {
              D$ifNull: ["$eNTLOC", ""],
            },
            PartyName: "$Party",
            MRAmount: {
              D$ifNull: ["$dLVRMRAMT", ""],
            },
            TDS: {
              D$ifNull: ["$tDSAmt", ""],
            },
            GSTAmount: {
              D$ifNull: ["$gSTAMT", ""],
            },
            // FreightRebate: {
            //   D$ifNull: ["$FreightRebate", 0],
            // },
            CLAIM: {
              D$ifNull: ["$CLAIM", ""],
            },
            OtherDeduction: {
              D$ifNull: ["$OtherDeduction", ""],
            },
            NetMRCloseAmt: {
              D$ifNull: ["$cLLCTAMT", ""],
            },
            MRCloseDate: {
              D$ifNull: ["$eNTDT", ""],
            },
            MRCloseBy: {
              D$ifNull: ["$eNTBY", ""],
            },
            PayMode: {
              D$ifNull: ["$mOD", ""],
            },
            ChequeNo: {
              D$ifNull: ["$cHQNo", ""],
            },
            ChequeDate: {
              D$ifNull: ["$cHQDT", ""],
            },
            ChequeAmount: {
              D$ifNull: ["$cLLCTAMT", ""],
            },
            CancelledBy: "",
            // Add your logic here
            CancelledOn: "",
            // Add your logic here
            CancelledReason: "",
            // Add your logic here
            GatePassNo: {
              D$ifNull: ["$docNo", ""],
            },
            GCNNo: "$gCNNO",
            BillNo: "",
            Origin: {
              D$arrayElemAt: ["$docketDetails.oRGN", 0], // Extracts the first element from the array
            },
            Destination: {
              D$arrayElemAt: ["$docketDetails.dEST", 0],
            },

            BasicFreight: {
              D$sum: {
                D$map: {
                  input: "$docketDetails",
                  as: "totaltfRTAMT",
                  in: "$$totaltfRTAMT.fRTAMT",
                },
              }
            },
            SubTotal: {
              D$sum: {
                D$map: {
                  input: "$docketDetails",
                  as: "totalgROAMT",
                  in: "$$totalgROAMT.gROAMT",
                },
              }
            },
            DocketTotal: {
              D$sum: {
                D$map: {
                  input: "$docketDetails",
                  as: "totaltOTAMT",
                  in: "$$totaltOTAMT.tOTAMT",
                },
              }
            },

            ActualWeight: {
              D$sum: {
                D$map: {
                  input: "$docketDetails",
                  as: "totalaCTWT",
                  in: "$$totalaCTWT.aCTWT",
                },
              },
            },
            ChargedWeight: {
              D$sum: {
                D$map: {
                  input: "$docketDetails",
                  as: "totalcHRWT",
                  in: "$$totalcHRWT.cHRWT",
                },
              },
            },
            NoPkg: {
              D$sum: {
                D$map: {
                  input: "$docketDetails",
                  as: "totalPKG",
                  in: "$$totalPKG.pKGS",
                },
              },
            },

            GodownNoName: "",

            DeliveryDateandTime: {
              D$ifNull: ["$eNTDT", ""],
            },
            PrivateMarka: "",
            VehicleNo: {
              D$arrayElemAt: ["$docketDetails.vEHNO", 0],
            },
            Status: "Delivered",
            SaidToContains: "",
            Receiver: {
              D$ifNull: ["$rCEIVNM", ""],
            },
            ReceiverNo: {
              D$ifNull: ["$cNTCTNO", ""],
            },
            Remark: "",
            chargeList: "$charge"
          },
        },
      ]
    }

    try {
      const res = await firstValueFrom(this.masterService.masterMongoPost('generic/query', reqBody));

      const details = await Promise.all(
        res.data.map(async (item) => {
          const userName = await this.salesRegisterService.getUserName(item.MRCloseBy);

          return {
            ...item,
            MRCloseBy: userName, // Use the fetched userName here
            MRTime: item.MRTime ? moment(item.MRDate).format('hh:mmA') : '',
            MRDate: item.MRDate ? moment(item.MRDate).local().format("DD MMM YYYY HH:mm") : "",
            DeliveryDateandTime: item.DeliveryDateandTime ? moment(item.DeliveryDateandTime).local().format("DD MMM YYYY HH:mm") : "",
            ChequeDate: item.ChequeDate ? moment(item.ChequeDate).local().format("DD MMM YYYY HH:mm") : "",
            MRCloseDate: item.MRCloseDate ? moment(item.MRCloseDate).local().format("DD MMM YYYY HH:mm") : "",
            chargeList: this.setchargeList(item.chargeList)
          };
        })
      );
      return details
    } catch (error) {
      console.error('Error fetching Mr data:', error);
      return [];
    }
  }
  setchargeList(chargeArray) {

    const chargeTotals: { [key: string]: number } = {}; // Initialize chargeTotals to store totals for each charge name

    // Check if chargeArray is valid and not [null]
    if (chargeArray && chargeArray.length && chargeArray[0] !== null) {
      chargeArray.forEach(chrge => {
        chrge.forEach(charge => {
          if (!chargeTotals[charge.cHGNM]) {
            chargeTotals[charge.cHGNM] = charge.aMT; // Initialize total for charge name if not already present
          } else {
            if (charge.oPS === "+") {
              chargeTotals[charge.cHGNM] += charge.aMT; // Add amount for addition operation
            } else if (charge.oPS === "-") {
              chargeTotals[charge.cHGNM] -= Math.abs(charge.aMT); // Subtract amount for subtraction operation
            }
          }
        });
      });

      // Convert chargeTotals object to array of objects with desired format
      const result = Object.keys(chargeTotals).map(chargeName => ({
        [chargeName]: chargeTotals[chargeName],
      }));

      return result; // Return the transformed data
    }
  }
}