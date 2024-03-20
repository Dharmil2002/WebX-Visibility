export const PipeLine = [
  {
    D$lookup: {
      from: "dockets_ltl",
      localField: "dKTNO",
      foreignField: "dKTNO",
      as: "docketData",
    },
  },
  {
    D$unwind: "$docketData",
  },
  {
    D$addFields: {
      TransitMode: {
        D$concat: [
          "$docketData.pAYTYPNM",
          " / ",
          "$docketData.tRNMODNM",
          " / ",
          "$docketData.sVCTYPN",
        ],
      },
      Consignee: {
        D$concat: [
          {
            D$toString: "$docketData.cSGE.cD",
          },
          " : ",
          "$docketData.cSGE.nM",
        ],
      },
      Consignor: {
        D$concat: [
          {
            D$toString: "$docketData.cSGN.cD",
          },
          " : ",
          "$docketData.cSGN.nM",
        ],
      },
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
];
