export const GetTrakingDataPipeLine = ()=>{
  const Mode = localStorage.getItem("Mode");
  if(Mode == "FTL"){
    return [
      {
       D$lookup: {
          from: "dockets",
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
              "$docketData.mODNM",
            ],
          },
          Consignee: {
           D$concat: [
              {
               D$toString: "$docketData.cSGECD",
              },
              " : ",
              "$docketData.cSGENM",
            ],
          },
          Consignor: {
           D$concat: [
              {
               D$toString: "$docketData.cSGNCD",
              },
              " : ",
              "$docketData.cSGNNM",
            ],
          },
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
    ]
    
  }else{
    return [
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
    ]
  }

}
