export class Holiday
{
    CompanyCode:number;
    holidayDate:any;
    holidayNote:string;
    ActiveFlag:boolean;
    DateType:string;
    Id:string;
    isActive: boolean;
    constructor(Holiday)
    {
        if(Holiday)
        {
            this.CompanyCode=Holiday.CompanyCode??+localStorage.getItem("CompanyCode");
            this.holidayDate=new Date(Holiday.holidayDate)??new Date();
            this.holidayNote=Holiday.holidayNote??"";
            this.isActive=Holiday.isActive??false;
            this.DateType=Holiday.type??"";
            this.Id=Holiday._id??""
        }
        else
        {
            this.holidayDate=new Date();
        }
        
    }
}