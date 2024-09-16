import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeadersTable } from './highlight-news-table/highlight-news-table.component';
import { CONTEXT_MENU_EVENT, INews } from '../../shared/models';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddModalComponent } from './add-modal/add-modal.component';
import { FirebaseService } from '../../shared/services/firebase.service';
import { ToastService } from '../../shared/services/toast.service';
import { MultiHandlerModalComponent } from './multi-handler-modal/multi-handler-modal.component';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { catchError, finalize, of, Subject, takeUntil } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-facebook',
  templateUrl: './highlight-news.component.html',
  styleUrls: ['./highlight-news.component.scss'],
})
export class HighlightNewsComponent implements OnInit, OnDestroy {
  headers: HeadersTable[] = [];
  actionMenuItems!: MenuItem[];
  orders: INews[] = [];

  ref!: DynamicDialogRef;
  selectedItems: INews[] = [];
  isLoading = true;
  $destroy = new Subject<void>();
  formatDate = 'hh:mm - DD/MM/YYYY';

  constructor(
    private toastService: ToastService,
    public dialogService: DialogService,
    private firebaseService: FirebaseService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.getActionsMenu();
    this.getTableHeader();
    this.getData();
  }

  valueChanged(event: { item: INews; header: HeadersTable; value: any }) {
    console.log(event);
    const update: INews = {
      [event.header.field]: event.value,
    };

    const updateFunc = () => {
      this.firebaseService
        .fbUpdateProduct(update, event?.item?._id || '')
        .pipe(
          takeUntil(this.$destroy),
          catchError((err) => {
            console.error('updateFunc err', err);
            return of(null);
          })
        )
        .subscribe(() => {
          this.toastService.add({
            severity: 'success',
            summary: `Updated [${event.item.title}]`,
            detail: `[${event.header.name}] = ${event.value}`,
          });
          this.getData();
        });
    };
    if (
      event.header.type === 'number' &&
      event.header.field !== 'price' &&
      event.header.field !== 'price2'
    ) {
      this.confirmationService.confirm({
        message: 'Tự động tính giá bán, giá nhập?',
        header: 'Update confirmation',
        icon: 'pi pi-info-circle',
        rejectButtonStyleClass: 'bg-danger',
        accept: () => {
          updateFunc();
        },
        reject: () => {
          updateFunc();
        },
      });
    } else {
      updateFunc();
    }
  }

  showAddModal() {
    this.getTableHeader();
    this.ref = this.dialogService.open(AddModalComponent, {
      header: 'Thêm tin mới',
      contentStyle: { overflow: 'auto' },
      maximizable: true,
      baseZIndex: 10000,
      data: {
        data: this.headers,
        callBackAdded: (output: INews) => {
          this.addItem(output);
        },
      },
    });
    // this.ref.onClose.subscribe(() => {
    //   this.getData();
    // });
  }

  contextMenuClick(event: { type: CONTEXT_MENU_EVENT; value: INews }) {
    console.log(event);
    switch (event.type) {
      case CONTEXT_MENU_EVENT.DELETE_ACCEPT:
        this.firebaseService
          .fbDeleteRealProduct(event.value._id!)
          .subscribe(() => {
            this.toastService.showToastSuccess(
              `Deleted record: ${event.value.title}`
            );
            this.getData();
          });
        break;
      case CONTEXT_MENU_EVENT.DELETE_REJECT_CANCEL:
        break;
      case CONTEXT_MENU_EVENT.CLONE_A_COPY:
        this.addItem(event.value);
        break;
      case CONTEXT_MENU_EVENT.VIEW_DETAIL:
        this.viewItem(event.value);
        break;
      default:
        break;
    }
  }

  private getTableHeader(pathValue?: INews) {
    this.headers = [
      {
        name: 'Image',
        field: 'imageLink',
        type: 'image',
        className: 'image-col',
        filter: { noFilter: true },
        styles: {
          'min-width': '150px',
          'max-width': '150px',
          width: '150px',
        },
        defaultIfNoData: pathValue?.imageLink,
      },
      {
        name: 'Tiêu đề',
        field: 'title',
        type: 'string',
        filter: {},
        styles: {
          'min-width': '20%',
          width: '300px',
        },
        defaultIfNoData: pathValue?.title,
      },
      {
        name: 'Nội dung ngắn',
        field: 'content',
        type: 'string',
        filter: {},
        styles: {
          wordBreak: 'break-all',
          width: '100%',
          'min-width': '100px',
        },
        defaultIfNoData: pathValue?.content,
      },
      {
        name: 'Link',
        field: 'link',
        type: 'string',
        filter: {},
        styles: {
          wordBreak: 'break-all',
          width: '350px',
          'min-width': '100px',
        },
        defaultIfNoData: pathValue?.link,
      },
      {
        name: 'Ngày tạo',
        field: 'createdTxt',
        readonly: true,
        type: 'string',
        filter: {},
        styles: {
          'min-width': '250px',
          'white-space': 'pre-wrap',
        },
        defaultIfNoData: pathValue?.createdTxt,
      },
    ];
  }

  private getActionsMenu() {
    this.actionMenuItems = [
      {
        icon: 'pi pi-trash',
        tooltip: 'Xóa các dòng đã chọn',
        command: () => {
          if (this.selectedItems.length) {
            this.confirmationService.confirm({
              message: `Xóa ${this.selectedItems.length} tin đang chọn?`,
              header: 'Delete Confirmation',
              icon: 'pi pi-info-circle',
              acceptButtonStyleClass: 'bg-danger',
              rejectButtonStyleClass: 'bg-success',
              defaultFocus: 'reject',
              accept: () => {
                this.firebaseService
                  .fbDeleteRealProducts(this.selectedItems)
                  .subscribe((res) => {
                    this.toastService.showToastSuccess(
                      `Xóa ${this.selectedItems.length} tin thành công!`
                    );
                    this.getData();
                  });
              },
              reject: () => {},
            });
          } else {
            this.toastService.showToastWarning(
              'Hãy chọn ít nhất 1 tin để xóa!'
            );
          }
        },
      },
      {
        icon: 'pi pi-plus',
        command: () => {
          this.showAddModal();
        },
      },
    ];
  }

  private getData() {
    this.isLoading = true;
    this.selectedItems = [];
    this.orders = [];
    this.firebaseService
      .fbQueryProducts()
      .pipe(
        takeUntil(this.$destroy),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((res: INews[]) => {
        console.log(res);
        res.map((news) => {
          news.updatedTxt = moment(news.updated).format(this.formatDate);
          news.createdTxt = moment(news.created).format(this.formatDate);
        });
        this.orders = res;
      });
  }

  private viewItem(items: INews) {
    this.getTableHeader(items);
    this.ref = this.dialogService.open(AddModalComponent, {
      header: 'Cập nhật thông tin',
      contentStyle: { overflow: 'auto' },
      maximizable: true,
      baseZIndex: 10000,
      data: {
        items,
        data: this.headers,
        callBackAdded: (output: INews) => {
          output._id = items._id;
          console.log({ output });
          this.updateItem(output, `[Cập nhật thành công] ${output.title}`);
        },
      },
    });
  }

  private addItem(output: INews) {
    this.firebaseService
      .fbAddProducts(output)
      .pipe(takeUntil(this.$destroy))
      .subscribe((res) => {
        console.log('added', res);
        this.toastService.showToastSuccess(
          `Added new order ${output.title} successfully!`
        );
        this.getData();
      });
  }

  private updateItem(output: INews, mess: string) {
    if (!output._id) return;
    this.isLoading = true;
    this.firebaseService
      .fbUpdateProduct(output, output._id)
      .pipe(
        takeUntil(this.$destroy),
        catchError((err) => {
          console.error('fbUpdateProducts err', err);
          return of(null);
        }),
        finalize(() => (this.isLoading = false))
      )
      .subscribe((res) => {
        this.toastService.showToastSuccess(`${mess} successfully!`);
        this.ref.close();
        this.getData();
      });
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
    if (this.ref) {
      this.ref.close();
    }
  }
}
