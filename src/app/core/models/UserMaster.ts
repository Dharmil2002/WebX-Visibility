import { formatDate } from '@angular/common';
export class UserMaster {
  id: number;
  userId: string;
  companyId: number;
  userName: string;
  email: string;
  internalId: string;
  password: string;
  userType: string;
  Address: string;
  address: string;
  userRole: any;
  department: any;
  dateOfBirth: Date;
  dateOfJoining: Date;
  location: any;
  mobileNo: string;
  isActive: boolean;
  entryBy: string;
  entryDate: Date;
  updateBy: string;
  IsSuccess:string;
  Action:string;
  Message:string;
  updateDate: Date;
  IsUpdate:string;
  constructor(UserMaster) {
    {
      this.id = UserMaster.id || this.getRandomID();
      this.userId = UserMaster.userId || '';
      this.userName = UserMaster.userName || '';
      this.email = UserMaster.email || '';
      this.password=UserMaster.password||'';  
      this.mobileNo=UserMaster.mobileNo||'';
      this.internalId = UserMaster.internalId || '';
      this.userRole = UserMaster.userRole || '';
      this.userType=UserMaster.userType || '';
      this.isActive=UserMaster.isActive||false;
      this.address=UserMaster.address || '';
      this.department = UserMaster.department || '';
      this.entryBy = UserMaster.entryBy || '';
      this.updateBy = UserMaster.updateBy || '';
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
export class MasteQuery{
  queryOn:any;
}