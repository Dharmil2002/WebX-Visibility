export class Child2 {
  level: number;
  childs?: any;
  menuID: number;
  parentID: number;
  path: string;
  name: string;
  desc: string;
  url: string;
  class: string;
  icon: string;
  target: string;
  isActive: boolean;
  id: string;
  entryBy: string;
  entryDate: Date;
  updateBy: string;
  updateDate?: any;
}

export class Child {
  level: number;
  childs: Child2[];
  menuID: number;
  parentID: number;
  path: string;
  name: string;
  desc: string;
  url: string;
  class: string;
  icon: string;
  target: string;
  isActive: boolean;
  id: string;
  entryBy: string;
  entryDate: Date;
  updateBy: string;
  updateDate?: any;
}

export class MainMenu {
  level: number;
  childs: Child[];
  menuID: number;
  parentID?: any;
  path: string;
  name: string;
  desc: string;
  url: string;
  class: string;
  icon: string;
  target: string;
  isActive: boolean;
  id: string;
  entryBy: string;
  entryDate: Date;
  updateBy: string;
  updateDate?: any;
}
