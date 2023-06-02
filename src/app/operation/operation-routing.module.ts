import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoadingSheetViewComponent } from "./loading-sheet-view/loading-sheet-view.component";
import { CreateLoadingSheetComponent } from "./create-loading-sheet/create-loading-sheet.component";
import { LodingSheetGenerateSuccessComponent } from "./loding-sheet-generate-success/loding-sheet-generate-success.component";

const routes: Routes = [
    {
        path: "LoadingSheetView",
        component: LoadingSheetViewComponent,
      },
      {
        path: "CreateLoadingSheet",
        component: CreateLoadingSheetComponent,
      },
      {
        path: "LodingSheetGenerate",
        component: LodingSheetGenerateSuccessComponent,
      }
    ]
    
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class OperationRoutingModule {}
  