import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { NbLayoutModule } from '@nebular/theme';
import { ToastService } from '../shared/services/toast.service';
const routers: Routes = [
  {
    path: 'highlight-news',
    loadChildren: () =>
      import('./highlight-news/highlight-news.module').then((m) => m.HighlightNewsModule),
  },
  {
    path: 'customer',
    loadChildren: () =>
      import('./customer/customer.module').then((m) => m.CustomerModule),
  },
  {
    path: '',
    redirectTo: 'highlight-news',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(routers)],
  providers: [ToastService],
})
export class PagesModule {}
