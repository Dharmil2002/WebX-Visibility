import { FormControls } from "src/app/Models/FormControl/formcontrol";
import { GeneralService } from "src/app/Utility/module/masters/general-master/general-master.service";
import { DocCalledAs } from "src/app/shared/constants/docCalledAs";

export class BaseControl {
    constructor(
        public generalService: GeneralService,
        public mode: string,
        public classes: string[]
    )
    { 
        this.mode = mode;
        this.classes = classes;
    }

    async applyFieldRules(companyCode) {
        var data = await this.generalService.getData("field_rules", { cID: companyCode, Mode: this.mode, Class: { "D$in": this.classes } });    
        if(data != null && data.length > 0){
            data.map(f => {
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
    }

    configureControl(field: any) { 
        var c = this[field.FormControl].find((x) => x.name === field.Field);
        if(!c)
          return;
    
        c["label"] = field.Caption;
        c["placeholder"] = field["Place Holder"];
        c["visible"] = field.Visible;
        c["disable"] = field.ReadOnly;     
        
        if(field.IsSystemGenerated) {
          c["value"] = "Computerized";
        }
        if(field.Required === true) {      
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