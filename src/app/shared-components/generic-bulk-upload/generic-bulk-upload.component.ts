import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-generic-bulk-upload',
  templateUrl: './generic-bulk-upload.component.html'
})
export class GenericBulkUploadComponent implements OnInit {
  @Input() title: string = '';
  @Input() isDateMsg: boolean = false;
  @Input() isUploaded: boolean = false;
  @Input() downloadFunction: () => void = () => { };
  @Input() fileName: string = '';
  @Output() closeDialog = new EventEmitter<void>();

 
  constructor() { }

  ngOnInit(): void {
  }
  close() {
    this.closeDialog.emit();
  }
}
