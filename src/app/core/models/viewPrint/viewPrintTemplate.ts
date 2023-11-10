export class ViewPrint_Template {
  _id: number;
  company: any;
  viewType: string;
  htmleditor: string;
  companyId: number;
  entryBy: string;
  entryDate: Date;
  updateBy: string;
  updateDate: Date;


  constructor(ViewPrint_Template) {
    {
      this._id = ViewPrint_Template._id || this.getRandomID();
      this.company = ViewPrint_Template.company || "";
      this.viewType = ViewPrint_Template.viewType || "";
      this.htmleditor = ViewPrint_Template.htmleditor || "";
      this.entryBy = ViewPrint_Template.entryBy || "";
      this.updateBy = ViewPrint_Template.updateBy || "";
    }
  }
  public getRandomID(): string {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4();
  }
}
