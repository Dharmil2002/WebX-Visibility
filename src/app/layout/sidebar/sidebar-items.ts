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
        path: "dashboard/Index",
        title: "Globe Dashboard Page",
        moduleName: "Dashboard",
        icon: "",
        class: "",
        groupTitle: false,
        submenu: []
      }
        // {
        //   path: "Masters/Docket/Ewaybill",
        //   title: "Eway Bill",
        //   moduleName: "Masters",
        //   icon: "",
        //   class: "",
        //   groupTitle: false,
        //   submenu: []
        // },
        // {
        //   path: "Masters/Docket/Create",
        //   title: "Manual docket",
        //   moduleName: "Masters",
        //   icon: "",
        //   class: "",
        //   groupTitle: false,
        //   submenu: []
        // },
        // {
        //   path: "Masters/Docket/Ewaybill-Config",
        //   title: "Eway-Bill Config",
        //   moduleName: "Masters",
        //   icon: "",
        //   class: "",
        //   groupTitle: false,
        //   submenu: []
        // },
        // {
        //   path: "Masters/Docket/LoadingSheet",
        //   title: "Loading Sheet",
        //   moduleName: "Masters",
        //   icon: "",
        //   class: "",
        //   groupTitle: false,
        //   submenu: []
        // },
        // {
        //   path: "Masters/Docket/ManifestGeneration",
        //   title: "Manifest Generation ",
        //   moduleName: "Masters",
        //   icon: "",
        //   class: "",
        //   groupTitle: false,
        //   submenu: []
        // }],
      ]
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
          "path": "",
          "title": "Account",
          "moduleName": "Account",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": [
            {
              "path": "Masters/AccountMaster/AccountMasterList",
              "title": "Account Master",
              "moduleName": "Account Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            // {
            //   "path": "Masters/AccountMaster/ListAccountGroup",
            //   "title": "Account Group Master",
            //   "moduleName": "Account Group Master",
            //   "icon": "",
            //   "class": "ml-menu",
            //   "groupTitle": false,
            //   "submenu": []
            // },
            {
              "path": "Masters/AccountMaster/BankAccountMasterList",
              "title": "Bank Account Master",
              "moduleName": "Bank Account Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": []
            },
            {
              "path": "Masters/AccountMaster/ListTds",
              "title": "TDS Master",
              "moduleName": "TDS Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": []
            }
          ]
        },
        {
          "path": "Masters/DriverMaster/DriverMasterList",
          "title": "Admin",
          "moduleName": "Admin",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": [
            {
              "path": "Masters/HolidayMaster/HolidayMasterList",
              "title": "Holiday Master",
              "moduleName": "Holiday Master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/Menu/MenuAccessRights",
              "title": "Menu Access Rights",
              "moduleName": "Menu Access Rights",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            }
          ]
        },
        {
          "path": "Masters/DriverMaster/DriverMasterList",
          "title": "Company Structure",
          "moduleName": "Company Structure",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": [
            {
              "path": "Masters/ContainerMaster/ListContainer",
              "title": "Container master",
              "moduleName": "Container master",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            // {
            //   "path": "Masters/StateMaster/StateMasterView",
            //   "title": "State master",
            //   "moduleName": "State master",
            //   "icon": "",
            //   "class": "ml-menu",
            //   "groupTitle": false,
            //   "submenu": [
            //   ]
            // },
            // {
            //   "path": "Masters/CityMaster/CityMasterView",
            //   "title": "City master",
            //   "moduleName": "City master",
            //   "icon": "",
            //   "class": "ml-menu",
            //   "groupTitle": false,
            //   "submenu": [
            //   ]
            // },
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
              "path": "Masters/FleetMaster/FleetMasterList",
              "title": "Fleet Master",
              "moduleName": "Fleet Master",
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
            // {
            //   "path": "Masters/PinCodeMaster/PinCodeMasterList",
            //   "title": "Pin code Master",
            //   "moduleName": "Masters",
            //   "icon": "",
            //   "class": "",
            //   "groupTitle": false,
            //   "submenu": []
            // },
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
            {
              "path": "Masters/PincodeLocation/PincodeLocationMapping",
              "title": "Pincode to Location Mapping",
              "moduleName": "Pincode to Location Mapping",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/CityLocationMapping/CityLocationIndex",
              "title": "City Location Mapping",
              "moduleName": "City Location Mapping",
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
            },
            {
              "path": "Masters/BeneficiaryMaster/AddBeneficiaryMaster",
              "title": "Beneficiary Master",
              "moduleName": "Beneficiary Master",
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
          "title": "Contract Management",
          "moduleName": "Contract Management",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": [
            {
              "path": "Masters/CustomerContract/CustomerContractList",
              "title": "Customer Contract",
              "moduleName": "Customer Contract",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Masters/VendorContract/VendorContractList",
              "title": "Vendor Contract",
              "moduleName": "Vendor Contract",
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
            },
            {
              "path": "Masters/ProductMaster/ListProduct",
              "title": "Product Master",
              "moduleName": "Product Master",
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
        path: "Operation/ConsignmentQuery",
        title: "Consignment Tracking",
        moduleName: "Consignment Tracking",
        icon: "star",
        class: "",
        groupTitle: false,
        submenu: []
      },
      {
        path: "Operation/ConsignmentEntry",
        title: "Consignment Entry",
        moduleName: "Consignment Entry",
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
      },
      {
        path: "Operation/Unbilled",
        title: "Unbilled",
        moduleName: "Unbilled",
        icon: "star",
        class: "",
        groupTitle: false,
        submenu: []
      },
      {
        path: "Operation/IssueTracker",
        title: "Request Outbox",
        moduleName: "Request Outbox",
        icon: "star",
        class: "",
        groupTitle: false,
        submenu: []
      }
      ],
    },
    {
      path: "",
      title: "Finance",
      moduleName: "Finance",
      icon: "book",
      class: "menu-toggle",
      groupTitle: false,
      submenu: [
        {
          "path": "",
          "title": "Voucher Entry",
          "moduleName": "Voucher Entry",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": [
            {
              "path": "Finance/VoucherEntry/DebitVoucher",
              "title": "Debit Voucher",
              "moduleName": "Debit Voucher",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Finance/VoucherEntry/JournalVoucher",
              "title": "Journal Voucher",
              "moduleName": "Journal Voucher",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Finance/VoucherEntry/ContraVoucher",
              "title": "Contra Voucher",
              "moduleName": "Contra Voucher",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Finance/VoucherEntry/CreditVoucher",
              "title": "Credit Voucher",
              "moduleName": "Credit Voucher",
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
          "title": "Fund Transfer",
          "moduleName": "Fund Transfer",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": [
            {
              "path": "Finance/FundTransfer/AdviceGeneration",
              "title": "Advice Generation",
              "moduleName": "Advice Generation",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
            {
              "path": "Finance/FundTransfer/AdviceAcknowledge",
              "title": "Advice Acknowledge",
              "moduleName": "Advice Acknowledge",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },

          ]
        },
        {
          path: "Finance/VendorPayment/Dashboard",
          title: "Vendor Payment",
          moduleName: "Vendor Payment",
          icon: "star",
          class: "",
          groupTitle: false,
          submenu: []
        },
        {
          "path": "",
          "title": "FA Masters",
          "moduleName": "FA Masters",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": [
            {
              "path": "Finance/FAMasters/SetOpeningBalanceLedgerWise",
              "title": "Set Opening Balance Ledger Wise",
              "moduleName": "Set Opening Balance Ledger Wise",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
          ]
        },
      ],
    },
    {
      path: "",
      title: "Reports",
      moduleName: "Reports",
      icon: "pie-chart",
      class: "menu-toggle",
      groupTitle: false,
      submenu: [
        {
          "path": "",
          "title": "Account Report",
          "moduleName": "Account Report",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": [
            {
              "path": "Reports/AccountReport/ProfitAndLoss",
              "title": "Profit & Loss Statement",
              "moduleName": "Profit & Loss Statement",
              "icon": "",
              "class": "ml-menu",
              "groupTitle": false,
              "submenu": [
              ]
            },
          ]
        },
        {
          "path": "Reports/job-query",
          "title": "Job Register Report",
          "moduleName": "Job Register Report",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        },
        {
          "path": "Reports/cnote-GST-register",
          "title": "Consignment Note GST Register Report",
          "moduleName": "Consignment Note GST Register Report",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        },
        {
          "path": "Reports/cnote-Bill-MR-Report",
          "title": "Consignment Note Bill MR Register Report",
          "moduleName": "Consignment Note Bill MR Register Report",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        },
        {
          "path": "Reports/sales-register-report",
          "title": "Sales Register Advanced Report",
          "moduleName": "Sales Register Advanced Report",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        },
        {
          "path": "Reports/vendor-wise-gst-invoice-register-report",
          "title": "Vendor Wise GST Invoice Register Report",
          "moduleName": "Vendor Wise GST Invoice Register Report",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        },
        {
          "path": "Reports/customer-wise-gst-invoice-register-report",
          "title": "Customer wise GST Invoice Register Report",
          "moduleName": "Customer wise GST Invoice Register Report",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        },
        {
          "path": "Reports/unbilled-register-report",
          "title": "UnBilled Register Report",
          "moduleName": "UnBilled Register Report",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        },
        {
          "path": "Reports/customer-outstanding-report",
          "title": "Customer Outstanding Register Report",
          "moduleName": "Customer Outstanding Register Report",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        },
        {
          "path": "Reports/vendor-wise-outstanding-report",
          "title": "Vendor Wise Outstanding Report",
          "moduleName": "Vendor Wise Outstanding Report",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        },
        {
          "path": "Reports/PRQ-Register-report",
          "title": "PRQ Register Report",
          "moduleName": "PRQ Register Report",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        },
        {
          "path": "Reports/Voucher-Register-report",
          "title": "Voucher Register Report",
          "moduleName": "Voucher Register Report",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        },
        {
          "path": "Reports/General-ledger-report",
          "title": "General Ledger Report",
          "moduleName": "General Ledger Report",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        },
        {
          "path": "Reports/Cash-Bank-Book-Report",
          "title": "Cash-Bank Book Report",
          "moduleName": "Cash-Bank Book Report",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        },
        {
          "path": "Reports/Dashboard",
          "title": "Dashboard",
          "moduleName": "Dashboard",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        },
        {
          "path": "Reports/Cheque-Register-Report",
          "title": "Cheque Register Report",
          "moduleName": "Cheque Register Report",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        },
      ],
    },
    {
      path: "",
      title: "Control Panel",
      moduleName: "Control Panel",
      icon: "git-pull-request",
      class: "menu-toggle",
      groupTitle: false,
      submenu: [
        {
          "path": "ControlPanel/gps-rule",
          "title": "GPS Rule",
          "moduleName": "GPS Rule",
          "icon": "",
          "class": "ml-menu",
          "groupTitle": false,
          "submenu": []
        }
      ],
    },
  ]
