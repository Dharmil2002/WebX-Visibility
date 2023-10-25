import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html'
})
export class ImagePreviewComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { imageUrl: string },
    private dialogRef: MatDialogRef<ImagePreviewComponent>
  ) {
    //console.log(this.data.imageUrl);
  }
  onCloseClick(): void {
    this.dialogRef.close();
  }
}