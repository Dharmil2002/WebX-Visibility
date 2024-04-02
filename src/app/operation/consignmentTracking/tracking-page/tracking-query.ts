export const GetTrakingDataPipeLine = () => {
  const Mode = localStorage.getItem("Mode");
  if (Mode == "FTL") {
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
            Party: "$docketData.pAYTYPNM",
            Mod: "$docketData.tRNMODNM",
            Servis: "$docketData.mODNM",
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
    ];
  } else {
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
            Party: "$docketData.pAYTYPNM",
            Mod: "$docketData.tRNMODNM",
            Servis: "$docketData.sVCTYPN",
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
