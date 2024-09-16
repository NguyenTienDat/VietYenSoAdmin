import { CommonService } from '../../../shared/services/common.service';
import { FirebaseService } from '../../../shared/services/firebase.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, OnInit } from '@angular/core';
import { NO_IMG } from 'src/app/shared/utils';
import { INews } from 'src/app/shared/models';
import { ToastService } from 'src/app/shared/services/toast.service';
import { HeadersTable } from '../highlight-news-table/highlight-news-table.component';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.scss'],
})
export class AddModalComponent implements OnInit {
  data!: HeadersTable[];
  output: INews | any = {};

  IMG_DEFAULT = NO_IMG;

  constructor(
    private dialogService: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    public firebaseService: FirebaseService,
    private toastService: ToastService,
    public commonService: CommonService
  ) {
    this.data = this.dialogService.data.data;
    this.data?.forEach((item) => {
      this.output[item.field] = item.defaultIfNoData;
    });
  }

  ngOnInit() {}

  changeValue(td: HeadersTable, value: any) {
    this.output[td.field] = value;
    this.output.updated = Date.now();
    console.log(td, value);
    console.log('output', this.output);
    this.output = JSON.parse(JSON.stringify(this.output));
  }

  submit() {
    console.log('Submit', this.output);
    this.dialogService.data.callBackAdded(this.output);
  }

  close() {
    this.ref.close();
  }
}
