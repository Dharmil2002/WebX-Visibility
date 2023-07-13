export class UserMaster {
    id: number;
    secretAnswer: string;
    secretQuestion: string;
    dateOfBirth: any;
    dateOfJoining: any;
    location: any;
    residentialAddress:string;
    mobileNo:number;
  
    userId: string;
    companyId: number;
    name: string;
    email: string;
    internalId: string;
    password: string;
    userType: string;
    Address: string;
    address: string;
    userRole: any;
    department: any;
    //dateOfBirth: Date;
    //dateOfJoining: Date;
    srNo: any;
    //mobileNo: string;
    isActive: boolean;
    entryBy: string;
    entryDate: Date;
    updateBy: string;
    IsSuccess: string;
    Action: string;
    Message: string;
    updateDate: Date;
    IsUpdate: string;
    emailId: any;
    gender: any;
    userStatus: any;
    manageID: any;
    securatAns: any;
    securatQue: any;
  
    BranchCode: any;
    ROLEID: any;
    ManagerId: any;
    Username: any;
    
    roleid: any;
    status: any;
    empId: string;
    emptype: string;
    userLocations: string;
    branchCode: string;
    user_Type: any;
    managerId: any;
    deptId: string;
    BranchId: any;
    UserId: any;
    value: any;
    EmpId: any;
    PasswordQues: any;
    EmailId: any;
    DOB: any;
    divId: string;
    userPwd: any;
    CountryCode: any;
    countryCode: any;
    Loc: any;
    Role: any;
    User_Type: any;
    username: any;
    managerID: any;
    role: any;
    internalID: any;
    country: any;
      division: any;
  
    constructor(UserMaster) {
      {
        this.id = UserMaster.id || this.getRandomID();
        this.userId = UserMaster.userId || "";
        this.name = UserMaster.name || "";
        //this.name = UserMaster.name || "";
        this.email = UserMaster.email || "";
        this.password = UserMaster.password || "";
        this.countryCode = UserMaster.countryCode || "";
        this.mobileNo = UserMaster.mobileNo || "";
        this.empId = UserMaster.empId || "";
        this.internalId = UserMaster.empId || "";
        this.userRole = UserMaster.userRole || "";
        this.userType = UserMaster.userType || "";
        this.isActive = UserMaster.isActive || false;
        this.address = UserMaster.address || "";
        this.department = UserMaster.department || "";
        this.entryBy = UserMaster.entryBy || "";
        this.updateBy = UserMaster.updateBy || "";
        this.status = UserMaster.status || 200;
        this.divId = UserMaster.divId || '';
      }
    }
    public getRandomID(): string {
      const S4 = () => {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return S4() + S4();
    }
  }