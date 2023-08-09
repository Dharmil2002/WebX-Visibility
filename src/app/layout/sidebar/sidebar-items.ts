import { RouteInfo } from "./sidebar.metadata";
export const ROUTES: RouteInfo[] =
  [
    {
      path: "",
      title: "Menu",
      moduleName: "CNote",
      icon: "check-circle",
      class: "menu-toggle",
      groupTitle: false,
      submenu: [{
        path: "dashboard/GlobeDashboardPage",
        title: "Globe Dashboard Page",
        moduleName: "Dashboard",
        icon: "",
        class: "",
        groupTitle: false,
        submenu: []
      },
      {
        path: "Masters/Docket/Ewaybill",
        title: "Eway Bill",
        moduleName: "Masters",
        icon: "",
        class: "",
        groupTitle: false,
        submenu: []
      },
      {
        path: "Masters/Docket/Create",
        title: "Manual docket",
        moduleName: "Masters",
        icon: "",
        class: "",
        groupTitle: false,
        submenu: []
      },
      {
        path: "Masters/Docket/Ewaybill-Config",
        title: "Eway-Bill Config",
        moduleName: "Masters",
        icon: "",
        class: "",
        groupTitle: false,
        submenu: []
      },
      {
        path: "Masters/Docket/LoadingSheet",
        title: "Loading Sheet",
        moduleName: "Masters",
        icon: "",
        class: "",
        groupTitle: false,
        submenu: []
      },
      {
        path: "Masters/Docket/ManifestGeneration",
        title: "Manifest Generation ",
        moduleName: "Masters",
        icon: "",
        class: "",
        groupTitle: false,
        submenu: []
      }],
    },
    {
      "path": "Masters/DriverMaster/DriverMasterList",
      "title": "Master & Utilities",
      "moduleName": "Master & Utilities",
      "icon": "monitor",
      "class": "menu-toggle",
      "groupTitle": false,
      "submenu": [
        {
          "path": "Masters/DriverMaster/DriverMasterList",
          "title": "Company Structure",
          "moduleName": "Company Structure",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": [
            {
              "path": "Masters/StateMaster/StateMasterView",
              "title": "State masters",
              "moduleName": "State masters",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/CityMaster/CityMasterView",
              "title": "City masters",
              "moduleName": "City masters",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/ClusterMaster/ClusterMasterList",
              "title": "Cluster Master",
              "moduleName": "Masters",
              "icon": "",
              "class": "",
              "groupTitle": false,
              "submenu": []
            },
            {
              "path": "Masters/AddressMaster/AddressMasterList",
              "title": "Address Master",
              "moduleName": "Masters",
              "icon": "",
              "class": "",
              "groupTitle": false,
              "submenu": []
            },
            {
              "path": "Masters/LocationMaster/LocationMasterList",
              "title": "Location Master",
              "moduleName": "Location Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/DriverMaster/DriverMasterList",
              "title": "Driver Master",
              "moduleName": "Driver Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/VendorMaster/VendorMasterList",
              "title": "Vendor Master",
              "moduleName": "Vendor Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/CompanyMaster/AddCompany",
              "title": "Company Setup Master",
              "moduleName": "Company Setup Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/CustomerMaster/CustomerMasterList",
              "title": "Customer Master",
              "moduleName": "Customer Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/PinCodeMaster/PinCodeMasterList",
              "title": "Pin code Master",
              "moduleName": "Masters",
              "icon": "",
              "class": "",
              "groupTitle": false,
              "submenu": []
            },
            {
              "path": "Masters/VehicleMaster/VehicleMasterList",
              "title": "Vehicle Master",
              "moduleName": "Vehicle Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/VehicleTypeMaster/VehicleTypeMasterList",
              "title": "Vehicle Type Master",
              "moduleName": "Vehicle Type Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/GeneralMaster/GeneralMasterList",
              "title": "General Master",
              "moduleName": "General Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
          ]
        },
        {
          "path": "",
          "title": "Stakeholders",
          "moduleName": "Stakeholders",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": [
            {
              "path": "Masters/CustomerGroupMaster/CustomerGroupMasterList",
              "title": "Customer Group Master",
              "moduleName": "Customer Group Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/UserMaster/UserMasterView",
              "title": "User Master",
              "moduleName": "User Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },]
        },
        {
          "path": "",
          "title": "Document Control",
          "moduleName": "Document Control",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": [
            {
              "path": "Masters/DocumentControlRegister/AddDCR",
              "title": "Add DCR Series",
              "moduleName": "Add DCR Series",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/DocumentControlRegister/TrackDCR",
              "title": "Track and Manage DCR",
              "moduleName": "Track and Manage DCR",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            }
          ]
        },
        {
          "path": "",
          "title": "Transport Related",
          "moduleName": "Transport Related",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": [
            {
              "path": "Masters/RouteLocationWise/RouteList",
              "title": "Route Master - Location wise",
              "moduleName": "Route Master - Location wise",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/RouteScheduleMaster/RouteScheduleMasterList",
              "title": "Route Schedule Master",
              "moduleName": "Route Schedule Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/TripRouteMaster/TripRouteMasterList",
              "title": "Trip Route Master",
              "moduleName": "Trip Route Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            }
          ]
        },
      ]
    },
    {
      path: "",
      title: "Operations",
      moduleName: "Operations",
      icon: "settings",
      class: "menu-toggle",
      groupTitle: false,
      submenu: [{
        path: "Operation/QuickCreateDocket",
        title: "Quick Create Docket",
        moduleName: "Quick Create Docket",
        icon: "star",
        class: "",
        groupTitle: false,
        submenu: []
      },
      {
        path: "Masters/Docket/EwayBillDocketBookingV2",
        title: "Eway Bill Docket Booking",
        moduleName: "Eway Bill Docket Booking",
        icon: "star",
        class: "",
        groupTitle: false,
        submenu: []
      },
      {
        path: "Operation/DocketTracking",
        title: "Docket Tracking",
        moduleName: "Docket Tracking",
        icon: "star",
        class: "",
        groupTitle: false,
        submenu: []
      },
      {
        path: "Masters/Vehicle/Status",
        title: "Vehicle Status",
        moduleName: "Vehicle Status",
        icon: "star",
        class: "",
        groupTitle: false,
        submenu: []
      }
      ],
    },
  ]