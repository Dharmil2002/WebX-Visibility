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
            }
          ]
        },
        // below commented code is for to add menu under the stakeholder
        // {
        //   "path": "Masters/DriverMaster/DriverMasterList",
        //   "title": "Stakeholders",
        //   "moduleName": "Stakeholders",
        //   "icon": "",
        //   "class": "ml-menu",
        //   "groupTitle": false,
        //   "submenu": [
        //     // {
        //     //   "path": "Masters/UserMaster/UserMasterView",
        //     //   "title": "User Master",
        //     //   "moduleName": "User Master",
        //     //   "icon": "",
        //     //   "class": "ml-menu",
        //     //   "groupTitle": false,
        //     //   "submenu": [
        //     //   ]
        //     // },
        //   ]
        // },
      ]
    },
  ]