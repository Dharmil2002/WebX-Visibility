export class UserMaster {
  _id: number;
  dateOfBirth: any;
  dateOfJoining: any;
  location: any;
  residentialAddress: string;
  mobileNo: number;
  userId: string;
  companyId: number;
  name: string;
  email: string;
  internalId: string;
  password: string;
  userType: string;
  address: string;
  userRole: any;
  department: any;
  isActive: boolean;
  entryBy: string;
  entryDate: Date;
  updateBy: string;
  message: string;
  updateDate: Date;
  emailId: any;
  gender: any;
  userStatus: string;
  manageID: any;
  roleid: any;
  status: any;
  empId: string;
  emptype: string;
  userLocations: string;
  managerId: any;
  deptId: string;
  countryCode: any;
  username: any;
  managerID: any;
  role: any;
  internalID: any;
  country: any;
  division: any;
  multiDivisionAccess: any;
  multiLocation: any;
  locationName: any;
  manager: any;
  locationList: any;
  roleId: any;
  divId: any;
  userCode: any;
  userPwd: any;
  userTypeValue: any;
  userStatusData: any;
  userpassword: any;
  erpId: any;
  branchCode: any;

  constructor(UserMaster) {
    {
      this._id = UserMaster._id || this.getRandomID();
      this.userId = UserMaster.userId || "";
      this.userStatus = UserMaster.userStatus || "";
      this.name = UserMaster.name || "";
      this.email = UserMaster.email || "";
      this.password = UserMaster.password || "";
      this.countryCode = UserMaster.countryCode || "";
      this.mobileNo = UserMaster.mobileNo || "";
      this.empId = UserMaster.empId || "";
      this.internalId = UserMaster.empId || "";
      this.userRole = UserMaster.userRole || "";
      this.userType = UserMaster.userType || "";
      this.isActive = UserMaster.isActive || true;
      this.address = UserMaster.address || "";
      this.department = UserMaster.department || "";
      this.entryBy = UserMaster.entryBy || "";
      this.updateBy = UserMaster.updateBy || "";
      this.status = UserMaster.status || 200;
      this.divId = UserMaster.divId || '';
      this.residentialAddress = UserMaster.residentialAddress || '';
      this.dateOfJoining = UserMaster.dateOfJoining || '';
      this.dateOfBirth = UserMaster.dateOfBirth || '';
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}