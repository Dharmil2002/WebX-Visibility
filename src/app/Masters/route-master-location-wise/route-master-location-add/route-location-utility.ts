export const columnHeader = {
    Srno: {
        Title: "Sr.No.",
        class: "matcolumncenter",
        Style: "min-width:5%",
    },
    loccd: {
        Title: "Branch Name",
        class: "matcolumncenter",
        Style: "min-width:10%",
    },
    distKm: {
        Title: "Distance(KM)",
        class: "matcolumncenter",
        Style: "min-width:10%",
    },
    trtimeHr: {
        Title: "Transit(Minutes)",
        class: "matcolumncenter",
        Style: "min-width:10%",
    },
    sttimeHr: {
        Title: "Stoppage(Minutes)",
        class: "matcolumncenter",
        Style: "min-width:10%",
    },
    speedLightVeh: {
        Title: "Speed-Light Vehicle",
        class: "matcolumncenter",
        Style: "min-width:10%",
    },
    speedHeavyVeh: {
        Title: "Speed-Heavy Vehicle",
        class: "matcolumncenter",
        Style: "min-width:10%",
    },
    nightDrivingRestricted: {
        Title: "Night Driving Restricted",
        class: "matcolumncenter",
        Style: "min-width:10%",
    },
    restrictedHoursFrom: {
        Title: "Restricted Hrs (From)",
        class: "matcolumncenter",
        Style: "min-width:10%",
    },
    restrictedHoursTo: {
        Title: "Restricted Hrs (To)",
        class: "matcolumncenter",
        Style: "min-width:10%",
    },
    actionsItems: {
        Title: "Action",
        class: "matcolumncenter",
        Style: "min-width:10%",
    },
};

export const staticField = ["Srno", "loccd", "distKm", "trtimeHr", "sttimeHr", "speedLightVeh", "speedHeavyVeh", "nightDrivingRestricted", "restrictedHoursFrom", "restrictedHoursTo"];
export function generateRouteCode(initialCode: number = 0) {
    const nextRouteCode = initialCode + 1;
    const routeNumber = nextRouteCode.toString().padStart(4, '0');
    const routeCode = `R${routeNumber}`;
    return routeCode;
}