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
    thc_summary_ltl: 'thc_summary_ltl'
};

export const GenericActions = {
    Get: 'generic/get',
    GetOne: 'generic/getOne',
    Create: 'generic/create',
    Update: 'generic/update'
};

export const OperationActions = {
    CreateThc: "operation/thc/create",
    getThc: "operation/thc/get",
    createCha:"operation/cha/create",
    createRake:"operation/rake/create"
}