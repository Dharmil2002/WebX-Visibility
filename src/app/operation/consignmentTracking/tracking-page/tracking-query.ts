import { StoreKeys } from 'src/app/config/myconstants';
import * as StorageService from 'src/app/core/service/storage.service';

export const GetTrakingDataPipeLine = () => {
  const Mode = StorageService.getItem(StoreKeys.Mode);
  if (Mode == "FTL") {
    return [
      {
        D$lookup: {
            from: "docket_ops_det",
            localField: "dKTNO",
            foreignField: "dKTNO",
            as: "opsData"
        }
      },
      {
          D$unwind: "$opsData"
      },
      {
          D$replaceRoot: {
              newRoot: {
                  D$mergeObjects: ["$opsData", { "docketData": "$$ROOT" }]
              }
          }
      },
      {
        D$lookup: {
            "from": "docket_invoices",
            "localField": "dKTNO",
            "foreignField": "dKTNO",
            "as": "invoiceData"
        }
      },
      {
          D$unwind:  {
            "path": "$invoiceData",
            "preserveNullAndEmptyArrays": true
          }
      },
      {
        D$addFields: {
          eWBNO: "$invoiceData.eWBNO",
          eXPDT: "$invoiceData.eXPDT",
        }
      },
      {
          D$sort: {  "eXPDT": 1  }
      },
      {
        D$group: {
          _id: "$dKTNO",
          doc: {
            D$first: "$$ROOT",
          },
        },
      },
      {
        D$replaceRoot: {
          newRoot: "$doc",
        }, 
      },
      {
        D$addFields: {
          TransitMode: [ 
            { D$ifNull: ["$docketData.pAYTYPNM", ""] },
            { D$ifNull: [ "$docketData.tRNMODNM", "Road"] },
            { D$ifNull: ["$docketData.mODNM", "LTL"] },
          ],
          Consignee: {
            D$concat: [
              {
                D$ifNull: [ { D$toString: "$docketData.cSGECD" }, ""],
              },
              " : ",
              "$docketData.cSGENM",
            ],
          },
          Consignor: {
            D$concat: [
              {
                D$ifNull: [ { D$toString: "$docketData.cSGNCD" }, ""],
              },
              " : ",
              "$docketData.cSGNNM",
            ],
          },
          ATD: {
            D$cond: {
              if: { D$eq: ["$sTS", 3] },
              then: "$sTSTM",
              else: null
            },
          }
        },
      },
      {
        D$lookup: {
          from: "docket_events",
          localField: "dKTNO",
          foreignField: "dKTNO",
          as: "DocketTrackingData",
        },
      },
      {
        D$addFields: {
          MoveFrom: "$docketData.fCT",
          MoveTo: "$docketData.tCT",
          GroupId: {
            D$switch: {
              branches: [
                {
                  case: {
                    D$in: ["$sTS", [1]],
                  },
                  then: 1,
                },
                {
                  case: {
                    D$in: ["$sTS", [2]],
                  },
                  then: 2,
                },
                {
                  case: {
                    D$in: ["$sTS", [4]],
                  },
                  then: 3,
                },
                {
                  case: {
                    D$in: ["$sTS", [3]],
                  },
                  then: 5,
                },
              ],
              default: 0,
            },
          },
        },
      },
      
    ];
  } else {
    return [
      {
        D$lookup: {
            from: "docket_ops_det_ltl",
            localField: "dKTNO",
            foreignField: "dKTNO",
            as: "opsData"
        }
      },
      {
          D$unwind: "$opsData"
      },
      {
          D$replaceRoot: {
              newRoot: {
                  D$mergeObjects: ["$opsData", { "docketData": "$$ROOT" }]
              }
          }
      },
      {
        D$lookup: {
          from: "docket_invoices_ltl",
          localField: "dKTNO",
          foreignField: "dKTNO",
          as: "invoiceData",
        },
      },
      {
        D$unwind: {
          path: "$invoiceData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        D$addFields: {
          eWBNO: "$invoiceData.eWBNO",
          eXPDT: "$invoiceData.eXPDT",
        },
      },
      {
        D$sort: {
          eXPDT: 1,
        },
      },
      {
        D$group: {
          _id: "$dKTNO",
          doc: {
            D$first: "$$ROOT",
          },
        },
      },
      {
        D$replaceRoot: {
          newRoot: "$doc",
        },
      },
      {
        D$addFields: {
          TransitMode: [ 
            { D$ifNull: ["$docketData.pAYTYPNM", ""] },
            { D$ifNull: ["$docketData.tRNMODNM", "Road"] },
            { D$ifNull: ["$docketData.mODNM", "LTL"] },
          ], 
          Consignee: {
            D$concat: [
              {
                D$ifNull: [ { D$toString: "$docketData.cSGE.cD" }, ""],
              },
              " : ",
              "$docketData.cSGE.nM",
            ],
          },
          Consignor: {
            D$concat: [
              {
                D$ifNull: [ { D$toString: "$docketData.cSGN.cD" }, ""],
              },
              " : ",
              "$docketData.cSGN.nM",
            ],
          },
          ATD: {
            D$cond: {
              if: { D$eq: ["$iSDEL", true] },
              then: {
                D$ifNull: ["$dELDT", "$sTSTM"],
              },
              else: null
            },
          }
        },
      },
      {
        D$lookup: {
          from: "docket_events_ltl",
          localField: "dKTNO",
          foreignField: "dKTNO",
          as: "DocketTrackingData",
        },
      },
      {
        D$addFields: {
          MoveFrom: "$docketData.oRGN",
          MoveTo: "$docketData.dEST",
          GroupId: {
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
                  then: 3,
                },
                {
                  case: {
                    D$in: ["$sTS", [7, 8, 11]],
                  },
                  then: 3,
                },
                {
                  case: {
                    D$eq: ["$sTS", 9],
                  },
                  then: 4,
                },
                {
                  case: {
                    D$in: ["$sTS", [10, 13]],
                  },
                  then: 5,
                },
              ],
              default: 0,
            },
          },
        },
      },
    ];
  }
};

export const formArray = [
  {
    name: "StartDate",
    label: "Select Date Range Search",
    placeholder: "Select Date",
    type: "daterangpicker",
    value: "",
    filterOptions: "",
    autocomplete: "",
    displaywith: "",
    generatecontrol: true,
    disable: true,
    Validations: [],
    additionalData: {
      support: "EndDate",
    },
  },
  {
    name: "EndDate",
    label: "",
    placeholder: "Select Data Range",
    type: "",
    value: "",
    filterOptions: "",
    autocomplete: "",
    generatecontrol: false,
    disable: true,
    Validations: [
      {
        name: "Select Data Range",
      },
      {
        name: "required",
        message: "StartDateRange is Required...!",
      },
    ],
  },
]

export const headerForCsv = {
  CnoteNo: "Cnote No",
  EDD: "EDD",
  ATD: "ATD",
  Status: "Status",
  docketDate: "Booking Date",
  TransitMode: "Transit Mode",
  EWB: "EWB",
  Valid: "Valid",
  Movement: "Movement",
  Consignor: "Consignor",
  Consignee: "Consignee",
}
