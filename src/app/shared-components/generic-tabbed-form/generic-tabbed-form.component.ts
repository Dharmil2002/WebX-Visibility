import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterUtils } from 'src/app/Utility/dropdownFilter';

@Component({
  selector: 'generic-tabbed-form-webxpress',
  templateUrl: './generic-tabbed-form.component.html',
})
export class GenericTabbedFormComponent implements OnInit {
  @Input() tabGroup: any;
  @Input() tabForm: any;
  @Output() functionCallEmitter = new EventEmitter();
  tabFormGroupList: any[]
  location: any;
  locationStatus: any;
  Route: any;
  RouteStatus: any;
  constructor(private filter: FilterUtils) { }

  ngOnInit(): void {
    // get the key name as a array.
    this.tabFormGroupList = Object.keys(this.tabGroup);
    this.InitializeFormControl()

  }

  functionCallHandler($event) {
    // we are listing events from child component (app-form-without-auto-complete-webxpress), 
    // and passing the event to parent of current component, who is using this component. 
    this.functionCallEmitter.emit($event);
  }


    save(){
      let context = {};
      context['functionName'] = 'save';
      this.functionCallEmitter.emit(context)
    }
    InitializeFormControl() {

      /**
       * this function sets validation for different fields, dynamically.
       */
      this.tabGroup['Driver Details'].forEach(data => {
   
        if (data.name === 'LocationcontrolHandler') {
          this.location = data.name;
          this.locationStatus = data.additionalData.showNameAndValue;
        }
        if (data.name === 'RoutecontrolHandler') {
          this.Route = data.name;
          this.RouteStatus = data.additionalData.showNameAndValue;
        }

        // let dataAdd=data.additionalData?.support==='controlHandler1'||''
        // if(dataAdd && data.type=='select')
       
      });

  
    }

  cancel() {
    let context = {};
    context['functionName'] = 'cancel';

  }

}
