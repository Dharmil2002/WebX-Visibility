import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  Renderer2,
} from "@angular/core";
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
  @Input() JsonData: any;
  @Input() FieldMapping: any[];
  @Input() EventButton;
  @Input() barcode6: boolean = false;
  @Input() barcode6Details: any = {};
  @Output() functionCallEmitter = new EventEmitter();

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

  private updateTableHtml(): void {

    const template = this.HtmlTemplate;
    const doc = this.parseHTML(template);

    const elementsWithDataRow = Array.from(doc.querySelectorAll("[data-row]"));

    const processedRowKeys: string[] = [];
    const rows: { Key: string; Value: string }[] = [];

    this.FieldMapping.filter((f) => f.Value.includes(".[#].")).forEach((f) => {
      const key = f.Value.slice(0, f.Value.indexOf(".[#]."));

      elementsWithDataRow.forEach((ele) => {
        if (ele.textContent && ele.textContent.includes(f.Key)) {
          if (!rows.find((r) => r.Key === key)) {
            processedRowKeys.push(key);
            rows.push({ Key: key, Value: ele.outerHTML });

            const dataArray = this.JsonData[key];
            const parent = ele.parentNode as HTMLElement;

            for (let i = 0; i < dataArray.length; i++) {
              let row = ele.outerHTML;
              console.log("row", row);
              this.FieldMapping.filter(
                (f) =>
                  f.Value.includes(`${key}.[#].`) && !f.Value.includes(`.[##].`)
              ).forEach((f) => {
                const val = f.Value.replace(".[#].", `.${i}.`);
                row = row.replace(
                  f.Key,
                  this.getValueByFieldName(this.JsonData, val)
                );
              });
              const tr = this.createElementFromHTML(row);
              parent.appendChild(tr);
            }
            parent.removeChild(ele);
          }
        }
      });
    });

    const elementsWithDatacolumn = Array.from(
      doc.querySelectorAll("[data-column]")
    );
    elementsWithDatacolumn.forEach((coll) => {
      const AttributeVelue = coll.getAttribute("data-column");
      const keyindex = AttributeVelue.split(".")[1];
      const parent = coll.parentNode as HTMLElement;
      this.FieldMapping.filter((f) => f.Value.includes(`.[##].`)).forEach(
        (f) => {
          let val = f.Value.replace(".[#].", `.${keyindex}.`);
          const key = f.Value.split(".[#].")[0];
          const nestedKey = f.Value.slice(
            f.Value.indexOf(".[#].") + 5,
            f.Value.indexOf(".[##].")
          );
          const dataArray = this.JsonData[key][keyindex][nestedKey];
          if(dataArray.length !== 0){
            for (let i = 0; i < dataArray.length; i++) {
              const nestedval = val.replace(".[##].", `.${i}.`);
              const element = document.createElement('td')
              element.textContent = this.getValueByFieldName(this.JsonData, nestedval)
              element.style.textAlign = 'center'; 
              parent.appendChild(element)
            }
          }
        }
      );
      coll.remove()
    });

    let updatedTemplate = doc.documentElement.innerHTML;
    this.FieldMapping.filter((f) => !f.Value.includes(".[#].")).forEach((f) => {
      updatedTemplate = updatedTemplate.replace(
        f.Key,
        this.getValueByFieldName(this.JsonData, f.Value)
      );
    });

    document.getElementById("TemplateData").innerHTML = updatedTemplate;
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

  private getValueByFieldName(obj: any, fieldName: string): any {
    const fieldNames = fieldName.split(".");
    let value = obj;

    for (const field of fieldNames) {
      if (value && typeof value === "object" && field in value) {
        value = value[field];
      } else {
        return "";
      }
    }

    return value;
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
