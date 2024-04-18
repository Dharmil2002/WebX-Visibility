import { Key } from "angular-feather/icons";

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

    Theme: 'theme',
    Choose_LogoHeader: 'choose_logoheader',
    Sidebar_Status: 'sidebar_status',
    Choose_Skin: 'choose_skin',
    Choose_Skin_Active:'choose_skin_active',
    IsRtl: 'isRtl'
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
};

export const GenericActions = {
    Get: 'generic/get',
    GetOne: 'generic/getOne',
    Create: 'generic/create',
    Update: 'generic/update',
    UpdateBulk: 'generic/updateBulk',
    Query: 'generic/query',
    FindLastOne: 'generic/findLastOne'
};

export const OperationActions = {
    CreateThc: "operation/thc/create",
    getThc: "operation/thc/get",
    createCha:"operation/cha/create",
    createRake:"operation/rake/create"
}

export const UploadFieldType = {
    Upload: 'UPLOAD',
    Derived: 'DERIVED',
    Key: 'KEY',
}