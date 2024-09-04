import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  getDocs,
  getFirestore,
  doc,
  onSnapshot,
  docSnapshots,
  where,
  CollectionReference,
  query,
  Query,
  DocumentData,
  orderBy,
  addDoc,
  deleteDoc,
  updateDoc,
  writeBatch,
  runTransaction,
  Transaction,
} from '@angular/fire/firestore';
import {
  Observable,
  from,
  BehaviorSubject,
  catchError,
  forkJoin,
  tap,
  map,
  throwError,
} from 'rxjs';
import {
  ENVIRONMENT_LIST,
  INews,
  ICustomer,
  ITmdt,
  I_USER,
  STATUS_CUSTOMER_ENUM,
  STATUS_DROPDOWN,
} from '../models';
import { xoa_dauTV } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private NEWS_COLLECTION = ENVIRONMENT_LIST.HighlightNews;
  private CUSTOMERS_COLLECTION = ENVIRONMENT_LIST.customers;

  private newsCol!: CollectionReference;
  private customersCol!: CollectionReference;

  /** Menu ẩn/hiện */
  IS_SHOW_MENU$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /** Menu mở rộng hoặc thu nhỏ */
  IS_OPEN_MENU$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  /** Danh sách khách hàng get từ api */
  CUSTOMER_LIST$: BehaviorSubject<ICustomer[]> = new BehaviorSubject(
    [] as ICustomer[]
  );

  constructor(private firestore: Firestore, private router: Router) {
    this.NEWS_COLLECTION = ENVIRONMENT_LIST.HighlightNews;
    this.CUSTOMERS_COLLECTION = ENVIRONMENT_LIST.customers;

    this.newsCol = collection(this.firestore, this.NEWS_COLLECTION);
    this.customersCol = collection(this.firestore, this.CUSTOMERS_COLLECTION);
    console.log('Sử dụng DB', this.NEWS_COLLECTION);
  }

  fbGetProducts() {
    return this.getCustomDocs(this.newsCol);
  }

  fbQueryProducts(): Observable<INews[]> {
    const q = query(this.newsCol);
    return this.getCustomDocs(q).pipe(
      catchError((err, caught) => {
        this.handerErr(err);
        return caught;
      })
    );
  }

  fbAddProducts(docData: INews): Observable<any> {
    docData.created = Date.now();
    docData.updated = Date.now();
    return from(addDoc(this.newsCol, docData)).pipe(
      catchError((err, caught) => {
        this.handerErr(err);
        return caught;
      })
    );
  }

  fbUpdateProduct(docData: INews, id: string) {
    docData.updated = Date.now();
    return from(
      updateDoc(
        doc(this.firestore, this.NEWS_COLLECTION, id),
        docData as any
      )
    ).pipe(
      catchError((err, caught) => {
        this.handerErr(err);
        return caught;
      })
    );
  }

  fbUpdateProducts(docData: INews, items: any[]) {
    docData.updated = Date.now();
    const arr: Observable<any>[] = [];
    items.forEach((item) => {
      const update = from(
        runTransaction(this.firestore, (transaction: Transaction) => {
          const document = doc(
            this.firestore,
            this.NEWS_COLLECTION,
            item._id
          );

          return transaction.get(document).then((sfDoc) => {
            if (!sfDoc.exists) {
              throw 'Document does not exist!';
            }
            transaction.update(document, docData as any);
          });
        })
      );
      arr.push(update);
    });

    return forkJoin(arr).pipe(
      catchError((err, caught) => {
        this.handerErr(err);
        return caught;
      })
    );
  }

  // // Just update to status deleted
  // fbDeleteProduct(id: string) {
  //   return this.fbUpdateProduct(
  //     { status: STATUS_DROPDOWN.DELETED, updated: Date.now() },
  //     id
  //   );
  // }

  // fbDeleteProducts(items: any[]) {
  //   return this.fbUpdateProducts(
  //     { status: STATUS_DROPDOWN.DELETED, updated: Date.now() },
  //     items
  //   );
  // }

  // Not recommend real delete => Just update to status deleted
  public fbDeleteRealProduct(id: string) {
    return from(
      deleteDoc(doc(this.firestore, this.NEWS_COLLECTION, id))
    ).pipe(
      catchError((err, caught) => {
        this.handerErr(err);
        return caught;
      })
    );
  }

  // Not recommend real delete => Just update to status deleted
  public fbDeleteRealProducts(items: any[]) {
    const arr: Observable<any>[] = [];
    items.forEach((item) => {
      const update = from(
        runTransaction(this.firestore, (transaction: Transaction) => {
          const document = doc(
            this.firestore,
            this.NEWS_COLLECTION,
            item._id
          );

          return transaction.get(document).then((sfDoc) => {
            if (!sfDoc.exists) {
              throw 'Document does not exist!';
            }
            transaction.delete(document);
          });
        })
      );
      arr.push(update);
    });

    return forkJoin(arr).pipe(
      catchError((err, caught) => {
        this.handerErr(err);
        return caught;
      })
    );
  }

  // =====================================================================================================================
  // CUSTOMER ============================================================================================================
  // =====================================================================================================================
  getCustomers(): Observable<ICustomer[]> {
    const q = query(
      this.customersCol,
      where('status', '!=', STATUS_CUSTOMER_ENUM.DELETED)
    );
    return this.getCustomDocs(q).pipe(
      map((items: ICustomer[]) =>
        items.sort((a: ICustomer, b: ICustomer) =>
          xoa_dauTV(a.name ?? '') > xoa_dauTV(b.name ?? '') ? 1 : -1
        )
      )
    );
  }

  addCustomer(docData: ICustomer): Observable<any> {
    docData.created = Date.now();
    docData.updated = Date.now();
    return from(addDoc(this.customersCol, docData)).pipe(
      catchError((err, caught) => {
        this.handerErr(err);
        return caught;
      })
    );
  }

  updateCustomer(docData: ICustomer, id: string) {
    docData.updated = Date.now();
    return from(
      updateDoc(
        doc(this.firestore, this.CUSTOMERS_COLLECTION, id),
        docData as any
      )
    ).pipe(
      catchError((err, caught) => {
        this.handerErr(err);
        return caught;
      })
    );
  }

  updateCustomers(docData: ICustomer, items: any[]) {
    docData.updated = Date.now();
    const arr: Observable<any>[] = [];
    items.forEach((item) => {
      const update = from(
        runTransaction(this.firestore, (transaction: Transaction) => {
          const document = doc(
            this.firestore,
            this.CUSTOMERS_COLLECTION,
            item._id
          );

          return transaction.get(document).then((sfDoc) => {
            if (!sfDoc.exists) {
              throw 'Document does not exist!';
            }
            transaction.update(document, docData as any);
          });
        })
      );
      arr.push(update);
    });

    return forkJoin(arr).pipe(
      catchError((err, caught) => {
        this.handerErr(err);
        return caught;
      })
    );
  }

  // Just update to status deleted
  deleteCustomer(id: string) {
    return this.updateCustomer(
      { status: STATUS_CUSTOMER_ENUM.DELETED, updated: Date.now() },
      id
    );
  }

  deleteCustomers(items: any[]) {
    return this.updateCustomers(
      { status: STATUS_CUSTOMER_ENUM.DELETED, updated: Date.now() },
      items
    );
  }

  // =====================================================================================================================
  // USER ============================================================================================================
  // =====================================================================================================================
  addUser(docData: I_USER): Observable<any> {
    docData.created = Date.now();
    docData.updated = Date.now();
    return from(addDoc(this.customersCol, docData)).pipe(
      catchError((err, caught) => {
        this.handerErr(err);
        return caught;
      })
    );
  }

  updateUser(docData: ICustomer, id: string) {
    docData.updated = Date.now();
    return from(
      updateDoc(
        doc(this.firestore, this.CUSTOMERS_COLLECTION, id),
        docData as any
      )
    ).pipe(
      catchError((err, caught) => {
        this.handerErr(err);
        return caught;
      })
    );
  }

  // SUPPORT ========================================
  private getCustomDocs(q: Query<DocumentData>): Observable<any> {
    return from(
      getDocs(q).then((item) => {
        return item.docs.map((doc) => {
          return {
            ...doc.data(),
            _id: doc.id,
            value: doc.id,
          };
        });
      })
    ).pipe(
      catchError((e) => {
        this.handerErr(e);
        return throwError(e);
      })
    );
  }

  private handerErr(err: any) {
    console.error({ err });
    //alert(err.message);
    this.router.navigate(['login']);
  }
}
