import { Injectable } from '@angular/core';
import moment from 'moment';
import { firstValueFrom } from 'rxjs';
import { MasterService } from 'src/app/core/service/Masters/master.service';
import { StorageService } from 'src/app/core/service/storage.service';

@Injectable({
  providedIn: 'root'
})
export class MrRegisterService {

  constructor(private masterService: MasterService,
    private storage: StorageService,) { }

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
    const isEmptyDocNo = !hasCnoteno ?? !hasMRNO;

    let matchQuery

    if (isEmptyDocNo) {
      matchQuery = {
        'D$and': [
          { eNTDT: { 'D$gte': data.startDate } },
          { eNTDT: { 'D$lte': data.endDate } },
          ...(data.branch ? [{ 'eNTLOC': { 'D$eq': data.branch } }] : []),
          ...(data.customerList.length > 0 ? [{ bPARTY: { 'D$in': data.customerList } }] : [])
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
            from: "docket_ops_det_ltl",
            localField: "docNo",
            foreignField: "dLMRNO",
            as: "docketDetails",
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
            PartyName: {
              D$ifNull: ["$bILNGPRT", ""],
            },
            MRAmount: {
              D$ifNull: ["$dLVRMRAMT", ""],
            },
            TDS: {
              D$ifNull: ["$tDSAmt", ""],
            },
            GSTAmount: {
              D$ifNull: ["$gSTAMT", ""],
            },
            FreightRebate: {
              D$ifNull: ["$FreightRebate", 0],
            },
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
            GCNNo: {
              D$reduce: {
                input: "$gCNNO",
                initialValue: "",
                in: {
                  D$concat: [
                    "$$value",
                    {
                      D$cond: [
                        {
                          D$eq: ["$$value", ""],
                        },
                        "",
                        ", ",
                      ],
                    },
                    "$$this",
                  ],
                },
              },
            },
            BillNo: "",
            Origin: {
              D$arrayElemAt: ["$docketDetails.oRGN", 0], // Extracts the first element from the array
            },
            Destination: {
              D$arrayElemAt: ["$docketDetails.dEST", 0],
            },

            BasicFreight: "",
            SubTotal: "",
            DocketTotal: "",

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
    console.log(reqBody.filters);

    try {
      const res = await firstValueFrom(this.masterService.masterMongoPost('generic/query', reqBody));

      res.data.forEach(item => {
        item.MRTime = item.MRTime ? moment(item.MRDate).format('hh:mmA') : '';
        item.MRDate = item.MRDate ? moment(item.MRDate).format('DD MMM YY') : '';
        item.DeliveryDateandTime = item.DeliveryDateandTime ? moment(item.DeliveryDateandTime).format('DD MMM YY') : '';
        item.ChequeDate = item.ChequeDate ? moment(item.ChequeDate).format('DD MMM YY') : '';
        item.MRCloseDate = item.MRCloseDate ? moment(item.MRCloseDate).format('DD MMM YY') : '';

        item.chargeList = item.chargeList.map(chargeArray => {

          // Pick unique charge names
          const uniqueChargeNames = [...new Set(chargeArray.map(charge => charge.cHGNM))];

          // Initialize totals for each unique charge name
          const chargeTotals: { [key: string]: number } = {}; // Define the type of chargeTotals

          uniqueChargeNames.forEach((chargeName: string) => {
            chargeTotals[chargeName] = 0; // Use chargeName as the key directly
          });

          chargeArray.forEach(charge => {
            if (charge.oPS === "+") { // Addition operation
              chargeTotals[charge.cHGNM] += charge.aMT; // Add amount to total for the charge type
            } else if (charge.oPS === "-") { // Subtraction operation
              chargeTotals[charge.cHGNM] -= charge.aMT; // Subtract amount from total for the charge type
            }
          });

          // Update cHGNM with total amount for each unique charge type
          chargeArray.forEach(charge => {
            charge.cHGNM = chargeTotals[charge.cHGNM]; // Update cHGNM with total amount for the charge type
          });

          return chargeArray; // Return the updated chargeArray
        });

      });
      console.log(res.data);

      return res.data
    } catch (error) {
      console.error('Error fetching Mr data:', error);
      return [];
    }
  }
}
