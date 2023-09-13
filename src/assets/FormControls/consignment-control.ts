import { FormControls } from "src/app/Models/FormControl/formcontrol";


export class ConsignmentControl{
  private ConsignmentControlArray: FormControls[];
  constructor() {
    this.ConsignmentControlArray = [
      {name: "CONSNO",label: "Consignment Note No",placeholder: "Consignment Note No",type: "text",
        value:"System Generated",filterOptions: "",autocomplete: "",displaywith: "",Validations: [],generatecontrol: true,disable: true,},
      {name: 'freightAmount',label: 'Freight Amount',placeholder: 'Freight Amount',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
      {name: 'freightRatetype',label: 'Freight Rate type',placeholder: 'Freight Rate type',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
      {name: 'otherAmount',label: 'Other Amount',placeholder: 'Other Amount',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
      {name: 'grossAmount',label: 'Gross Amount',placeholder: 'Gross Amount',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
      {name: 'rcm',label: 'RCM',placeholder: 'RCM',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
      {name: 'gstAmount',label: 'GST Amount',placeholder: 'GST Amount',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
      {name: 'gstChargedAmount',label: 'GST Charged Amount',placeholder: 'GST Charged Amount',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
      {name: 'totalAmount',label: 'Total Amount',placeholder: 'Total Amount',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
    ]
  }
  getConsignmentControlControls() {
    return this.ConsignmentControlArray;
  }
}
export class FreightControl {
  private FreightControlArray: FormControls[];
  constructor() {
    this.FreightControlArray = [
      {name: 'CND',label: 'Consignment Note Date',placeholder: 'Consignment Note Date',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
      {name: 'billingParty',label: 'Billing Party',placeholder: 'Billing Party',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
      {name: 'paymentMode',label: 'Payment Mode',placeholder: 'Payment Mode',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
      {name: 'fromCity',label: 'From City',placeholder: 'From City',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
      {name: 'toCity',label: 'To City',placeholder: 'To City',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
      {name: 'transportMode',label: 'Transport Mode ',placeholder: 'Transport Mode ',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
      {name: 'containerSize',label: 'Container Size',placeholder: 'Container Size',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
      {name: 'containerNumber',label: 'Container Number',placeholder: 'Container Number',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
      {name: 'vendorType',label: 'Vendor Type',placeholder: 'Vendor Type',type: 'text',
        value:'',Validations: [],generatecontrol: true,disable: false},
    ]
  }
  getFreightControlControls() {
    return this.FreightControlArray;
  }
}
