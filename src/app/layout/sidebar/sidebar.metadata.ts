// Sidebar route metadata
export interface RouteInfo {
  path: string;
  title: string;
  moduleName: string;
  icon: string;
  class: string;
  groupTitle: boolean;
  submenu: RouteInfo[];
}

// Sidebar route metadata
export class RouteInfoNew {
  path: string;
  title: string;
  moduleName: string;
  icon: string;
  class: string;
  groupTitle: boolean;
  submenu: RouteInfoNew[];
}

export interface MenuData {
  _id: number;
  MenuId: number;
  MenuPath: string;
  MenuName: string;
  MenuLevel: number;
  ParentId?: number;
  MenuGroup?: string
  Type?: string;
  HasLink?: boolean;
  IsActive: boolean;
  GroupTitle?: boolean;
  SubMenu?: MenuData[];
}
