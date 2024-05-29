import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { DocCalledAs } from "src/app/shared/constants/docCalledAs";

export class BaseControl {
    data: any[] = [];
    constructor(
        public generalService: GeneralService,
        public mode: string,
        public classes: string[]
    )
    {
        this.mode = mode;
        this.classes = classes;
    }

    async applyFieldRules(companyCode) : Promise<any[]> {
        this.data = await this.generalService.getData("field_rules", { cID: companyCode, Mode: this.mode, Class: { "D$in": this.classes } });
        if(this.data != null && this.data.length > 0){
          this.data.map(f => {
            if(f.Caption) {
                f.Caption = f.Caption.replace(/{{Docket}}/g, DocCalledAs.Docket)
                                    .replace(/{{THC}}/g, DocCalledAs.THC)
                                    .replace(/{{MF}}/g, DocCalledAs.MF)
                                    .replace(/{{LS}}/g, DocCalledAs.LS)
                                    .replace(/{{DRS}}/g, DocCalledAs.DRS);
            }
            if(f["Place Holder"]) {
                f["Place Holder"] = f["Place Holder"].replace(/{{Docket}}/g, DocCalledAs.Docket)
                                                    .replace(/{{THC}}/g, DocCalledAs.THC)
                                                    .replace(/{{MF}}/g, DocCalledAs.MF)
                                                    .replace(/{{LS}}/g, DocCalledAs.LS)
                                                    .replace(/{{DRS}}/g, DocCalledAs.DRS);
            }
            this.configureControl(f);
            });
        }

        return this.data;
    }

    async assignDefaultValues(form) {
      if(this.data != null && this.data.length > 0) {
        this.data.filter(f => f.Default).map(f => {
          if(f.Field && f.Default) {
            if(form.controls[f.Field]) {
              form.controls[f.Field].setValue(f?.Default || "");
            }
          }});
      }
    }

    configureControl(field: any) {
      if(field.Field){
        let c = this[field.FormControl].filter((x)=>x.name).find((x) => x.name === field.Field);
        if(!c)
          return;

        c["label"] = field.Caption;
        c["placeholder"] = field["Place Holder"];
        c["visible"] = field.Visible;
        c["disable"] = field.ReadOnly;

        if(field.IsSystemGenerated) {
          c["value"] = "Computerized";
        }
        if(field?.Default && field?.Default !== "") {
            c["value"] = field?.Default;
        }

        if(field.Required === true) {
          console.log()
          var r = c.Validations.find(x=>x.name=="required");
          if(!r) {
            c.Validations.push({name:"required",message:`${field.Caption} is required.` });
          }
          else {
            r.message = `${field.Caption} is required.`;
          }
        }
        else {
          var r = c.Validations.find(x=>x.name=="required");
          if(r) {
            c.Validations.splice(c.Validations.indexOf(r),1);
          }
        }

        if(field["Custom Validation"]) {
          var r = c.Validations.find(x=>x.name=="pattern");
          if(!r) {
            c.Validations.push({name:"pattern",message: field["Custom Validation Message"], pattern: field["Custom Validation"]});
          }
          else {
            r.message = field["Custom Validation Message"];
            r.pattern = field["Custom Validation"];
          }
        }
      }
    }
}
