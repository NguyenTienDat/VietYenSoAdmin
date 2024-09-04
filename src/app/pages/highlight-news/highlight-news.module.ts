import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HighlightNewsComponent } from './highlight-news.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AddModalComponent } from './add-modal/add-modal.component';
import { DialogService } from 'primeng/dynamicdialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiHandlerModalComponent } from './multi-handler-modal/multi-handler-modal.component';

const routes: Routes = [
  {
    path: '',
    component: HighlightNewsComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    HighlightNewsComponent,
    AddModalComponent,
    MultiHandlerModalComponent,
  ],
  providers: [DialogService],
  exports: [],
})
export class HighlightNewsModule {}
