import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  constructor(
    private _decimalPipe: DecimalPipe,
    private firebaseService: FirebaseService
  ) {}

  transformDecimal(num: number) {
    return this._decimalPipe.transform(num, '1.');
  }
}
