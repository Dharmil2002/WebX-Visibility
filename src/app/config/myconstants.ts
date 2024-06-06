import { NgxMatDateFormats } from "@angular-material-components/datetime-picker";
import { OwlDateTimeFormats } from "@danielmoncada/angular-datetime-picker";

export const MY_CUSTOM_FORMAT: OwlDateTimeFormats = {
    parseInput: 'dd MMM yy HH:mm',         // Correct date and time parsing format
    fullPickerInput: 'dd MMM yy HH:mm',    // Full date-time input format
    datePickerInput: 'dd MMM yy',          // Date input format
    timePickerInput: 'HH:mm',              // Time input format
    monthYearLabel: 'MMM yy',              // Month-Year label format
    dateA11yLabel: 'dd MMMM yyyy',         // Accessibility label for full date
    monthYearA11yLabel: 'MMMM yyyy'        // Accessibility label for Month-Year
};

export const MY_DATE_FORMAT = {
    parse: {
        dateInput: 'DD MMM YY',
        dateTimeInput: 'DD MMM YY HH:mm'
    },
    display: {
        dateInput: 'DD MMM YY',                // used for the date input displayed value
        dateTimeInput: 'DD MMM YY HH:mm',      // used for the date-time input displayed value
        monthYearLabel: 'MMM YYYY',            // used for the date picker's month and year label
        dateA11yLabel: 'LL',                   // used for the long format accessibility label
        monthYearA11yLabel: 'MMMM YYYY',       // used for the month and year accessibility label
    },
};

export const MY_DATETIME_FORMAT: NgxMatDateFormats = {
    parse: {
        dateInput: 'DD MMM YY HH:mm'
    },
    display: {
        dateInput: 'DD MMM YY HH:mm',
        monthYearLabel: "MMM YYYY",
        dateA11yLabel: "LL",
        monthYearA11yLabel: "MMMM YYYY"
    }
};



export const StoreKeys = {
    CompanyCode: 'companyCode',
    UserId: 'UserName',
    UserName: 'Name',
    Role: 'role',
    CurrentUser: 'currentUser',
    CurrentBranch: 'currentBranch',
    Branch: 'branch',
    Mode: 'Mode',
    TimeZone: 'timeZone',
    PunchLine: 'SJ5E9neu',
    Token: 'token',
    RefreshToken: 'refreshToken',
    UserLocations: 'userLocations',
    LoginLocations: 'loginLocations',
    CompanyLogo: 'companyLogo',
    CompanyAlias: 'company_Code',
    MenuOption: 'menuOption',
    Menu: 'menu',
    MenuToBind: 'menuToBind',
    SearchData: 'searchData',
    SearchResults: 'searchResults',
    DocCallAs: 'docCallAs',
    DocNames: 'DocNames',
    AccountMaster: 'AccountMaster',

    Theme: 'theme',
    Choose_LogoHeader: 'choose_logoheader',
    Sidebar_Status: 'sidebar_status',
    Choose_Skin: 'choose_skin',
    Choose_Skin_Active: 'choose_skin_active',
    IsRtl: 'isRtl',
    WorkingLoc: 'WorkingLoc'
}

export const Collections = {
    CompanyMaster: 'company_master',
    VehicleMaster: 'vehicle_master',
    MarketVehicles: 'market_vehicles',
    vehicleStatus: 'vehicle_status',
    Dockets: 'dockets',
    PrqDetails: 'prq_summary',
    ThcDetails: 'thc_detail',
    docketOp: 'docket_ops_det',
    thc_movement: 'thc_movement',
    thcsummary: 'thc_summary',
    chaHeaders: 'cha_headers',
    chaDetails: 'cha_details',
    rake_headers: 'rake_headers',
    route_headers: 'route_schedules_headers',
    trip_Route_Schedule: 'trip_Route_Schedule',
    route_details: 'route_schedules_details',
    thc_summary_ltl: 'thc_summary_ltl',
    Doccument_names: 'doc_names',
    route_Master_LocWise: 'routeMasterLocWise',
    adhoc_routes: "adhoc_routes"
};

export const GenericActions = {
    Get: 'generic/get',
    GetOne: 'generic/getOne',
    Create: 'generic/create',
    Update: 'generic/update',
    UpdateMany: "generic/updateAll",
    UpdateBulk: 'generic/updateBulk',
    Query: 'generic/query',
    FindLastOne: 'generic/findLastOne'
};

export const OperationActions = {
    CreateThc: "operation/thc/create",
    getThc: "operation/thc/get",
    createCha: "operation/cha/create",
    createRake: "operation/rake/create"
}

export const UploadFieldType = {
    Upload: 'UPLOAD',
    Derived: 'DERIVED',
    Key: 'KEY',
}

export const RateTypeCalculation = [
    {
        "codeId": "RTTYP-0004",
        "codeDesc": "% of Freight",
        "cD": "",
        "calculationRatio": 100
    },
    {
        "codeId": "RTTYP-0005",
        "codeDesc": "Per Kg",
        "calculationRatio": 1000,
        "cD": "kg",
    },
    {
        "codeId": "RTTYP-0003",
        "codeDesc": "Per Km",
        "calculationRatio": 1
    },
    {
        "codeId": "RTTYP-0006",
        "codeDesc": "Per Pkg",
        "calculationRatio": 1
    },
    {
        "codeId": "RTTYP-0001",
        "codeDesc": "Flat",
        "calculationRatio": 1
    },
    {
        "codeId": "RTTYP-0002",
        "codeDesc": "Per Ton",
        "calculationRatio": 1,
        "cD": "kg",
    },
    {
        "codeId": "RTTYP-0007",
        "codeDesc": "Per Container",
        "calculationRatio": 1
    },
    {
        "codeId": "RTTYP-0008",
        "codeDesc": "Per Litre",
        "calculationRatio": 1000
    }]

// View-Print
export const ViewName = {
    CB: 'CB',
    DKT: 'DKT',
    JOB: 'JOB',
    PRQ: 'PRQ',
    THC: 'THC',
    LS: 'LS',
    MF: 'MF',
    DMR: 'DMR',
    VR: 'VR',
    DRS: 'DRS',
    CDN: 'CDN',
    MR: 'MR',
    VB: "VB",
}
// export const ViewPrintPartyCode = {
//     CUST00014: 'CUST00014',
//     CONSRAJT23: 'CONSRAJT23',
//     CUST00018: 'CUST00018',
//     CONSRAJT22: 'CONSRAJT22',
//     CONSRAJT20: 'CONSRAJT20',
// } 