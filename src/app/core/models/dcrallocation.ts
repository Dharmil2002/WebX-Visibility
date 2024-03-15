export class DCRModel {
  location: string;
  customer: string;
  assignTo: string;
  name: string;
  from: string;
  to: string;
  noOfPages: number;
  constructor(allocationData?: DCRModel) {
    // this.allocateTo = allocationData?.allocateTo || "";
    this.location = allocationData?.location || "";
    this.customer = allocationData?.customer || "";
    this.assignTo = allocationData?.assignTo || "";
    this.name = allocationData?.name || "";
    this.from = allocationData?.from || "";
    this.to = allocationData?.to || "";
    this.noOfPages = allocationData?.noOfPages;
  }
}
