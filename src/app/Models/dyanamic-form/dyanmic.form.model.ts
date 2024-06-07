export class InvoiceModel {
    id?:number;
    name: string;
    label: string;
    placeholder: string;
    type: string;
    value: string;
    filterOptions?: string;
    displaywith?: string;
    generatecontrol: boolean;
    disable: boolean;
    Validations: any[]; // Replace 'any[]' with a more specific type for validations
    additionalData?: {
      showNameAndValue?: boolean;
      metaData?: string;
    };
    functions?: any; // Replace 'any' with a more specific type for functions
  
    constructor(data: any) {
      this.name = data.name || '';
      this.label = data.label || '';
      this.placeholder = data.placeholder || '';
      this.type = data.type || 'text';
      this.value = data.value || 0;
      this.filterOptions = data.filterOptions || '';
      this.displaywith = data.displaywith || '';
      this.generatecontrol = data.generatecontrol || true;
      this.disable = data.disable || true;
      this.Validations = data.Validations || [];
      this.additionalData = {
        showNameAndValue: data.additionalData?.showNameAndValue || false,
        metaData: data.additionalData?.metaData || ''
      };
      this.functions = data.functions || {};
    }
  }
  