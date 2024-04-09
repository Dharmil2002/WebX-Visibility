export const DocCalledAs = {
    Docket:  "GCN",
    THC:  "Trip",
    LS:  "Loadingsheet",
    MF:  "Menifest",
    DRS:  "Delivery Run Sheet",
}

export interface DocCalledAsModel {
    cID: number;
    Docket: string;
    THC: string;
    LS: string;
    MF: string;
    DRS: string;
  }