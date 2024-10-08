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
import { ENVIRONMENT_LIST, INews } from '../models';
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
    const q = query(this.newsCol, orderBy('created', 'desc'));
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
      updateDoc(doc(this.firestore, this.NEWS_COLLECTION, id), docData as any)
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
          const document = doc(this.firestore, this.NEWS_COLLECTION, item._id);

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
    return from(deleteDoc(doc(this.firestore, this.NEWS_COLLECTION, id))).pipe(
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
          const document = doc(this.firestore, this.NEWS_COLLECTION, item._id);

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
