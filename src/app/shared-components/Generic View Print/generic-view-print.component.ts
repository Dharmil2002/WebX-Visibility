import moment from "moment";
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
} from "@angular/core";
import { ConvertToNumber, generateQR, isValidDate } from "src/app/Utility/commonFunction/common";
import { ToWords } from 'to-words';
import { isValid } from "date-fns";

//import { FieldMapping, HtmlTemplate, JsonData } from "./InvoiceTemplate";

@Component({
  selector: "app-generic-view-print-webxpress",
  templateUrl: "./generic-view-print.component.html",
})
export class GenericViewPrintComponent implements OnInit {
  breadscrums = [
    {
      title: "view-print-json",
      items: ["Home"],
      active: "view-print-json",
    },
  ];
  @Input() HtmlTemplate: any;
  @Input() isLandscape: any = true;
  @Input() JsonData: any;
  @Input() FieldMapping: any[];
  @Input() EventButton;
  @Input() barcode6: boolean = false;
  @Input() barcode6Details: any = {};
  @Input() CopysName: any[] = ['Primary Copy']; // MULTIPLE COPY ARRAY
  @Output() functionCallEmitter = new EventEmitter();

  printStyles = { '@page': { size: `${this.isLandscape?'landscape':'portrait'} !important` } }
  constructor(private renderer: Renderer2) {
    this.renderer.setStyle(
      document.querySelector("nav.navbar"),
      "display",
      "none"
    ); // Hide Navbar
    this.renderer.setStyle(
      document.querySelector("#leftsidebar"),
      "display",
      "none"
    ); //Hide Sidebar
  }

  ngOnInit(): void {
    this.updateTableHtml();
  }

  onToggleChange(event){
    this.printStyles = { '@page': { size: `${event?'landscape':'portrait'} !important` } }
  }
  private async updateTableHtml(): Promise<void> {
    const template = this.HtmlTemplate;
    const doc = this.parseHTML(template);
    const processedRowKeys: string[] = [];
    const rows: { Key: string; Value: string }[] = [];

    // DATA ROW PROCESS
    const elementsWithDataRow = Array.from(doc.querySelectorAll("[data-row]"));
    const filteredFieldMapping = this.FieldMapping.filter((f) => f.Value.includes(".[#].") && !f.Value.includes(".[##]."));
    for (const f of filteredFieldMapping) {
      const key = f.Value.slice(0, f.Value.indexOf(".[#]."));
      for (const ele of elementsWithDataRow) {
        if (ele.textContent && ele.textContent.includes(f.Key)) {
          if (!rows.some((r) => r.Key === key)) {
            processedRowKeys.push(key);
            rows.push({ Key: key, Value: ele.outerHTML });
            const dataArray = this.JsonData[key] || [];
            const parent = ele.parentNode as HTMLElement;
            if (dataArray.length !== 0) {
              for (let i = 0; i < dataArray.length; i++) {
                let row = ele.outerHTML;
                const innerFields = this.FieldMapping.filter((f) => f.Value.includes(`${key}.[#].`) && !f.Value.includes(`.[##].`));
                for (const f of innerFields) {
                  const val = f.Value.replace(".[#].", `.${i}.`);
                  if (val.endsWith("{index}")) {
                    row = row.replace(f.Key, `${i+1}`);
                  } else {
                    row = row.replace(f.Key, await this.getValueByFieldName(this.JsonData, val, f.type || ""));
                  }
                }
                const tr = this.createElementFromHTML(row);
                parent.appendChild(tr);
              }
            } else {
              let row = ele.outerHTML;
              const blankFields = this.FieldMapping.filter((f) => f.Value.includes(`${key}.[#].`) && !f.Value.includes(`.[##].`));
              for (const f of blankFields) {
                row = row.replace(f.Key, "");
              }
              const tr = this.createElementFromHTML(row);
              parent.appendChild(tr);
            }
            parent.removeChild(ele);
          }
        }
      }
    }

    // DATA HEADER PROCESS
    const elementsWithDataHeader = Array.from(doc.querySelectorAll("[data-header]"));
    for (const header of elementsWithDataHeader) {
      // Get the parent element of the header
      const parent = header.parentNode as HTMLElement;
      // Filter field mappings that include the specific pattern for headers
      const fieldsMapping = this.FieldMapping.filter((f) => f.Value.includes(`.[#H].`));
      for (const f of fieldsMapping) {
        // Extract the key from the field mapping
        const key = f.Value.split(".[#H].")[0];
        // Get the data array for the key, ensuring it's non-empty
        const dataArray = this.JsonData[key] && this.JsonData[key].length > 0 ? this.JsonData[key] : [];
        if (dataArray.length !== 0) {
          // Create and insert elements for non-empty data array
          for (let i = 0; i < dataArray.length; i++) {
            const nestedVal = f.Value.replace(".[#H].", `.${i}.`);
            const element = document.createElement(header.tagName.toLowerCase());
            element.textContent = await this.getValueByFieldName(this.JsonData, nestedVal, f.type || "");
            element.style.textAlign = "center";
            element.className = header.className;
            insertElementAtPosition(parent, element, "data-header");
          }  
        } else {
          // Create and insert an empty element if data array is empty
          const element = document.createElement(header.tagName.toLowerCase());
          element.textContent = "";
          element.style.textAlign = "center";
          element.className = header.className;
          insertElementAtPosition(parent, element, "data-header");  
        }
      }
      // Remove the original header element
      header.remove();
    }


    // DATA COLUMN PROCESS
    const elementsWithDatacolumn = Array.from(doc.querySelectorAll("[data-column]"));
    for (const coll of elementsWithDatacolumn) {
      // Get attribute value and key index
      const AttributeValue = coll.getAttribute("data-column");
      const keyindex = AttributeValue.split(".")[1] || 0;
      const parent = coll.parentNode as HTMLElement;
      // Filter field mappings that include specific pattern
      const fieldsMapping = this.FieldMapping.filter((f) => f.Value.includes(`.[##].`));
      for (const f of fieldsMapping) {
        // Replace placeholder with actual key index
        let val = f.Value.replace(".[#].", `.${keyindex}.`);
        const key = f.Value.split(".[#].")[0];
        const nestedKey = f.Value.slice(f.Value.indexOf(".[#].") + 5, f.Value.indexOf(".[##]."));
        // Get data array based on key and index
        const dataArray = this.JsonData[key] && this.JsonData[key][keyindex] ? this.JsonData[key][keyindex][nestedKey] : [];
        if (dataArray.length !== 0) {
          // Create and insert elements for non-empty data array
          for (let i = 0; i < dataArray.length; i++) {
            const nestedVal = val.replace(".[##].", `.${i}.`);
            const element = document.createElement(coll.tagName.toLowerCase());
            element.textContent = await this.getValueByFieldName(this.JsonData, nestedVal, f.type || "");
            element.style.textAlign = "center";
            element.className = coll.className;
            insertElementAtPosition(parent, element, "data-column");
          }    
        } else {
          // Create and insert empty element
          const element = document.createElement(coll.tagName.toLowerCase());
          element.textContent = "";
          element.style.textAlign = "center";
          element.className = coll.className;
          insertElementAtPosition(parent, element, "data-column");
        }  
      }
      // Remove original element
      coll.remove();
    }    

    let updatedTemplate = doc.documentElement.innerHTML;
    for (const f of this.FieldMapping.filter((f) => !f.Value.includes(".[#].") && !f.Value.includes(".[##]."))) {
      if(f.type == "qrCode") {
        const qrCode = "";
      }
      let val = await this.getValueByFieldName(this.JsonData, f.Value, f.type || "");
      updatedTemplate = updatedTemplate.replace(f.Key, val);
    }
    // MULTIPLE COPY PROCESS
    let TempletCopys = ''
    for (const item of this.CopysName) {
      TempletCopys += `\n<div class="page-break" style="page-break-before: always;margin-top:25px;">\n${updatedTemplate.replace('[[copyName]]',item)}\n</div>`
    }
    //SET TEMPLET 
    document.getElementById("TemplateData").innerHTML = TempletCopys;


    // INSERT ELEMENT AT SPESIFIC POSITION
    function insertElementAtPosition(parent, element, AttributeKey) {
      // Convert the parent's children to an array
      const children = Array.from(parent.children);
      // Find the child with the specified attribute
      const column = children.find(child => {
          const childElement = child as HTMLElement; // Cast to HTMLElement
          return childElement.getAttribute(AttributeKey) !== null;
      }) ;
      // Insert the element at the found or append if not found
      if (column) {
          parent.insertBefore(element, column);
      } else {
          parent.appendChild(element);
      }
    }
  }

  private parseHTML(html: string): Document {
    const parser = new DOMParser();
    return parser.parseFromString(html, "text/html");
  }

  private createElementFromHTML(html: string): HTMLElement {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstChild as HTMLElement;
  }

  private async getValueByFieldName(obj: any, fieldName: string, type: string = "", decimalPlaces: number = 0): Promise<any> {
    const fieldNames = fieldName.split(".");
    let value = obj;

    for (const field of fieldNames) {
      const toWords = new ToWords();
      //console.log(`${fieldName} -> ${field}`, value[field]);
      if (value && typeof value === "object" && field in value) {        
        if (type) {
          switch (type) {
            case 'date':
              value = isValidDate(value[field]) ? moment(new Date(value[field])).format("DD MMM YY") : value[field];
              break;
            case 'time':
              value = isValidDate(value[field]) ? moment(new Date(value[field])).format("HH:mm") : value[field];
              break;
            case 'datetime':
              value = isValidDate(value[field]) ? moment(new Date(value[field])).format("DD MMM YY HH:mm") : value[field];
              break;
            case "currency":
              value = ConvertToNumber(value[field] || 0, decimalPlaces || 0).toFixed(2);
              break;
            case "currencyToWords":
              value = toWords.convert(ConvertToNumber(value[field] || 0, decimalPlaces || 0), { currency: true, ignoreZeroCurrency: true });
              break;
            case "number":
              value = ConvertToNumber(value[field] || 0, decimalPlaces || 0).toFixed(decimalPlaces || 0);
              break;
            case "numberToWords":
              value = toWords.convert(ConvertToNumber(value[field] || 0, decimalPlaces || 0));
              break;
            case "boolean":
              value = value[field] ? "Yes" : "No";
              break;
            case "qrCode":
              value =  typeof value[field] == 'string' ? await generateQR(value[field]) : value[field];
              break;
            default:
              value = value[field];
              break;
          }
        } else {
          value = value[field];
        }
      }
      else 
      {
        value = "";
      } 
    }

    return value;
  }

  qrGeneration(text: string) {

    generateQR(text).then((res) => {
      return res;
    }).catch((err) => {
      return null;
    });
  }

  functionHandle(name, element) {
    this.functionCallEmitter.emit({ functionName: name, data: element });
  }

  @HostListener("document:keydown", ["$event"])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // Check if the Ctrl (or Command on Mac) key is pressed and the P key is pressed
    if ((event.ctrlKey || event.metaKey) && event.key === "p") {
      event.preventDefault(); // Prevent the default browser print dialog
      this.printLandscapePage(); // Call your print function
    }
  }
  printLandscapePage() {
    const body = document.querySelector("body");
    if (body) {
      body.classList.add("landscape"); // Apply landscape orientation
      window.print(); // Trigger print
      body.classList.remove("landscape"); // Revert to normal orientation
    } else {
      alert("Content not found for printing.");
    }
  }
  setLandscapeOrientation() {
    const style = document.createElement("style");
    style.textContent = `
      @media print {
        @page {
          size: landscape;
        }
      }
    `;
    document.head.appendChild(style);
  }
}
