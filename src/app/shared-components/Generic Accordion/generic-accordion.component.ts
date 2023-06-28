import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'generic-accordion-webxpress',
  templateUrl: './generic-accordion.component.html'
})
export class GenericAccordionComponent implements OnInit {
  /* accordionGroup is object, received from parent component, in which single key value pair, is set as 
  < accordion_title : Array of fields, that should be in that particular expansion panel >   
  */
  @Input() accordionGroup: any;
  @Input() AccordionForm: any;

  @Output() functionCallEmitter = new EventEmitter();

  expandedIndex = 0;
  panelOpenState: boolean = true;
  accordionTitles: string[];

  // here showSaveAndCancelButton is false as we show that button from this component directly. see its html for better understanding.
  showSaveAndCancelButton: false;

  //Called after the constructor, initializing input properties, 
  ngOnInit(): void {
    //extracting accordion titles from AccordionGroup.
    this.accordionTitles = Object.keys(this.accordionGroup);
    console.log(this.AccordionForm);
    console.log(this.accordionGroup);
    
  }
  functionCallHandler($event){
      // we are listing events from child component (app-form-without-auto-complete-webxpress), 
    // and passing the event to parent of current component, who is using this component. 
    this.functionCallEmitter.emit($event);
  }

  save(){
    let context = {};
    context['functionName']='save';
    console.log("called Save",this.AccordionForm);
    // calling 'save' named function of parent component. 
    this.functionCallEmitter.emit(context);
    
  }
  
  cancel(){
    let context = {};
    context['functionName']='cancel';
    // calling 'cancel' named function of parent component. 
    this.functionCallEmitter.emit(context);

  }

  

}
