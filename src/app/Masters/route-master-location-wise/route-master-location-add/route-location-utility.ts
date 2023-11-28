export const columnHeader = {
    Srno: {
        Title: "#",
        class: "matcolumncenter",
        Style: "max-width:5%",
    },
    loccd: {
        Title: "Branch Name",
        class: "matcolumncenter",
        Style: "min-width:9%",
    },
    distKm: {
        Title: "Distance (In Km)",
        class: "matcolumncenter",
        Style: "min-width:8%",
    },
    trtimeHr: {
        Title: "Transit(Hours)",
        class: "matcolumncenter",
        Style: "min-width:8%",
    },
    sttimeHr: {
        Title: "Stoppage(Hours)",
        class: "matcolumncenter",
        Style: "min-width:8%",
    },
    speedLightVeh: {
        Title: "Speed-Light Veh.",
        class: "matcolumncenter",
        Style: "min-width:8%",
    },
    speedHeavyVeh: {
        Title: "Speed-Heavy Veh.",
        class: "matcolumncenter",
        Style: "min-width:8%",
    },
    nightDrivingRestricted: {
        Title: "Night Driving Restricted",
        class: "matcolumncenter",
        Style: "min-width:8%",
    },
    restrictedHoursFrom: {
        Title: "Restricted Hrs (From)",
        class: "matcolumncenter",
        Style: "min-width:8%",
    },
    restrictedHoursTo: {
        Title: "Restricted Hrs (To)",
        class: "matcolumncenter",
        Style: "min-width:8%",
    },
    actionsItems: {
        Title: "Action",
        class: "matcolumncenter",
        Style: "min-width:8%",
    },
};

export const staticField = ["Srno", "loccd", "distKm", "trtimeHr", "sttimeHr", "speedLightVeh", "speedHeavyVeh", "nightDrivingRestricted", "restrictedHoursFrom", "restrictedHoursTo"];
export function generateRouteCode(initialCode: number = 0) {
    const nextRouteCode = initialCode + 1;
    const routeNumber = nextRouteCode.toString().padStart(4, '0');
    const routeCode = `R${routeNumber}`;
    return routeCode;
}