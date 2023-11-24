import { Injectable } from "@angular/core";
import { IFieldDefinition } from "../../Interface/IFieldDefinition.interface";

@Injectable({
  providedIn: "root",
})

export class JobSummaryModel implements IFieldDefinition {
  constructor() {}
 
 /*below Block are Job Details Block*/
  public columnContainorDetail = {
    contNo: {
      Title: "Container No",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    contType: {
      Title: "Container Type",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    noOfpkg: {
      Title: "No of Package",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    loadedWeight: {
      Title: "Loaded Weight",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
  };

  public columnCnoteDetail = {
    cnoteNo: {
      Title: "Cnote No",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    cnoteDate: {
      Title: "Cnote Date",
      class: "matcolumncenter",
      Style: "min-width:80px",
    },
    noOfpkg: {
      Title: "No of Package",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    loadedWeight: {
      Title: "Loaded Weight",
      class: "matcolumncenter",
      Style: "min-width:2px",
    },
    actionsItems: {
      Title: "Action",
      class: "matcolumnleft",
      Style: "max-width:150px",
    },
  };
  public staticField =
   [
    "contNo", 
    "contType",
    "cnoteNo",
    "cnoteDate",
    "noOfpkg",
    "loadedWeight"
  ]
 /*below Block are Job invoice Details Block*/
 public columnExport = {
  invNum: {
    Title: "InvNum",
    class: "matcolumncenter",
    Style: "min-width:80px",
  },
  invDate: {
    Title: "InvDate",
    class: "matcolumncenter",
    Style: "min-width:80px",
  },
  sbNum: {
    Title: "SBNum",
    class: "matcolumncenter",
    Style: "min-width:2px",
  },
  sbDt: {
    Title: "SBDate",
    class: "matcolumncenter",
    Style: "min-width:2px",
  },
  pod: {
    Title: "POD",
    class: "matcolumncenter",
    Style: "min-width:2px",
  },
  cod: {
    Title: "COD",
    class: "matcolumncenter",
    Style: "min-width:2px",
  },
  containerType: {
    Title: "ContainerType",
    class: "matcolumncenter",
    Style: "min-width:2px",
  },
  containerNum: {
    Title: "ContainerNum",
    class: "matcolumncenter",
    Style: "min-width:2px",
  },
  actionsItems: {
    Title: "Action",
    class: "matcolumnleft",
    Style: "max-width:150px",
  },
}
 public columnImport = {
  blNum: {
    Title: "BLNum",
    class: "matcolumncenter",
    Style: "min-width:80px",
  },
  blDate: {
    Title: "BLDate",
    class: "matcolumncenter",
    Style: "min-width:80px",
  },
  beNum: {
    Title: "BENum",
    class: "matcolumncenter",
    Style: "min-width:2px",
  },
  beDT: {
    Title: "BEDate",
    class: "matcolumncenter",
    Style: "min-width:2px",
  },
  pod: {
    Title: "POD",
    class: "matcolumncenter",
    Style: "min-width:2px",
  },
  cod: {
    Title: "COD",
    class: "matcolumncenter",
    Style: "min-width:2px",
  },
  // containerType: {
  //   Title: "ContainerType",
  //   class: "matcolumncenter",
  //   Style: "min-width:2px",
  // },
  // containerNum: {
  //   Title: "ContainerNum",
  //   class: "matcolumncenter",
  //   Style: "min-width:2px",
  // },
  actionsItems: {
    Title: "Action",
    class: "matcolumnleft",
    Style: "max-width:150px",
  },
}

public invoiceStaticField =[
  "invNum",
  "invDate",
  "sbNum",
  "sbDt",
  "sbD",
  "cod",
  "pod",
  "containerType",
  "containerNum",
  "blNum",
  "blDate",
  "beNum",
  "beDT"
  ];
  
/* End */

getColumn(columnName: string): any | undefined {
  return this.columnCnoteDetail[columnName] ?? undefined;
}

getColumnDetails(columnName: string, field: string): any | undefined {
  const columnInfo = this.columnCnoteDetail[columnName];
  return columnInfo ? columnInfo[field] : undefined;
}

getColumnTitle(columnName: string): string | undefined {
  return this.getColumnDetails(columnName, "Title");
}

getColumnClass(columnName: string): string | undefined {
  return this.getColumnDetails(columnName, "class");
}

getColumnStyle(columnName: string): string | undefined {
  return this.getColumnDetails(columnName, "Style");
}
}
