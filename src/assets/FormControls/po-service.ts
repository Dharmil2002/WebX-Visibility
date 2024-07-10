import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { poserviceDetail } from 'src/app/core/models/finance/poservice/poservice';
// Get the current date


/* here i create class for the bind controls in formGrop */
export class PoServiceControls {
currentDate = new Date();
  
oneMonthAgo = new Date();
afterOneMt= new Date();
oneday: Date;
  private fieldMapping: FormControls[];
  // Constructor for initializing form controls.
  constructor(
      public poserviceDetail: poserviceDetail, isUpdate,rules
      ) {
        this.oneMonthAgo.setMonth(this.currentDate.getMonth() - parseInt(rules.prqBackDate));
        this.afterOneMt.setMonth(this.currentDate.getMonth() + parseInt(rules.prqFutureDate));
        this.oneday = new Date(this.currentDate);
        this.oneday.setHours(this.currentDate.getHours() + 1);

    this.fieldMapping = [
      {
        name: "pOID",
        label: "PO ID",
        placeholder: "PO ID",
        type: "text",
        value: poserviceDetail.pOID,
        generatecontrol: true,
        disable: true,
        Validations: [],
      },
      {
        name: "cPONO",
        label: "Customer PO No",
        placeholder: "Customer PO No",
        type: "text",
        value: poserviceDetail.cPONO,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "pattern",
            message:"Please Enter alphanumeric Order Number of length 4 to 25",
            pattern: "^.{4,25}$",
          },
        ],
      },
      {
        name: "pODT",
        label: "PO Date & Time",
        placeholder: "",
        type: "datetimerpicker",
        value: poserviceDetail.pODT,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "PO Date is required",
          },
        ],
        functions: {
          onDate: 'formatDate'
        },
        additionalData: {
           minDate: isUpdate ? "" :this.oneMonthAgo,
           maxDate: isUpdate ? "" :this.afterOneMt,
        },
      },
      {
        name: "pOENTRYDT",
        label: "PO Entry Date",
        placeholder: "",
        type: "datetimerpicker",
        value: poserviceDetail.pOENTRYDT,
        filterOptions: "",
        autocomplete: "",
        displaywith: "",
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "PO Entry Date is required",
          },
        ],
        functions: {
          onDate: 'formatDate'
        },
        additionalData: {
           minDate: isUpdate ? "" :this.oneMonthAgo,
           maxDate: isUpdate ? "" :this.afterOneMt,
        },
      },
      {
        name: "pOAMT",
        label: "PO Amount(₹)",
        placeholder: "PO Amount",
        type: "number",
        value: poserviceDetail.pOAMT,
        generatecontrol: true,
        disable: false,
        Validations: [
          {
            name: "required",
            message: "PO Amount(₹) is required",
          },
        ],
      }
      
    ];
  }
  getPrqEntryFieldControls() {
    return this.fieldMapping;
  }
}
