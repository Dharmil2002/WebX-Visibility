import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html'
})
export class ImagePreviewComponent implements OnInit {
  imageUrl: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageUrl: string }) { }

  ngOnInit(): void {
    if (this.data.imageUrl) {
      this.imageUrl = this.data.imageUrl;
      
    }
  }

}
