import { Component, EventEmitter, Input, OnInit, Output, Renderer2 } from "@angular/core";
//import { FieldMapping, HtmlTemplate, JsonData } from "./InvoiceTemplate";

@Component({
  selector: 'app-generic-view-print-webxpress',
  templateUrl: './generic-view-print.component.html',
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
    this.renderer.setStyle(document.querySelector('nav.navbar'), 'display', 'none'); // Hide Navbar
    this.renderer.setStyle(document.querySelector('#leftsidebar'), 'display', 'none'); //Hide Sidebar
  }

  ngOnInit(): void {
    this.updateTableHtml();
  }

  private updateTableHtml(): void {
    const template = this.HtmlTemplate;
    const doc = this.parseHTML(template);

    const elementsWithDataRow = Array.from(doc.querySelectorAll('[data-row]'));

    const processedRowKeys: string[] = [];
    const rows: { Key: string; Value: string }[] = [];

    this.FieldMapping
      .filter((f) => f.Value.includes(".[#]."))
      .forEach((f) => {
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
                this.FieldMapping.filter((f) =>
                  f.Value.includes(`${key}.[#].`)
                ).forEach((f) => {
                  const val = f.Value.replace(".[#].", `.${i}.`);
                  row = row.replace(f.Key, this.getValueByFieldName(this.JsonData, val));
                });
                const tr = this.createElementFromHTML(row);
                parent.appendChild(tr);
              }
              parent.removeChild(ele);
            }
          }
        });
      });

    let updatedTemplate = doc.documentElement.innerHTML;

    this.FieldMapping
      .filter((f) => !f.Value.includes(".[#]."))
      .forEach((f) => {
        updatedTemplate = updatedTemplate.replace(f.Key, this.getValueByFieldName(this.JsonData, f.Value));
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
    this.functionCallEmitter.emit({ functionName: name, data: element })
  }
}
