import { RouteInfo } from "./sidebar.metadata";

export const ROUTES: RouteInfo[] = [
  {
    path: "Masters/Docket/Create",
    title: "Menu",
    moduleName: "CNote",
    icon: "check-circle",
    class: "",
    groupTitle: false,
    submenu: [],
  },
  {
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
  }
  ,
  {
    path: "Masters/StateMaster/StateMasterView",
    title: "Masters",
    moduleName: "Masters",
    icon: "",
    class: "",
    groupTitle: false,
    submenu: [
      {
      path: "Masters/StateMaster/StateMasterView",
      title: "State Masters",
      moduleName: "Masters",
      icon: "",
      class: "",
      groupTitle: false,
      submenu: []
    },
    {
      path: "Masters/CityMaster/CityMasterView",
      title: "City Masters",
      moduleName: "Masters",
      icon: "",
      class: "",
      groupTitle: false,
      submenu: []
    }]
  }
];
