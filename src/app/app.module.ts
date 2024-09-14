import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NbLayoutModule, NbThemeModule } from '@nebular/theme';
import { HttpClientModule } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { ConfirmationService } from 'primeng/api';
import { DecimalPipe } from '@angular/common';
import { SharedModule } from './shared/shared.module';

const firebaseConfig = {
  apiKey: "AIzaSyAE7sbmviFvNf5L69naqHmUBTqAE060F78",
  authDomain: "reminder-c8fb6.firebaseapp.com",
  projectId: "reminder-c8fb6",
  storageBucket: "reminder-c8fb6.appspot.com",
  messagingSenderId: "559703113656",
  appId: "1:559703113656:web:4f4634e69dcc65fbc5994d",
  measurementId: "G-3ZWXVRD5TM"
};



@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    SharedModule,
    HttpClientModule,
    // https://github.com/angular/angularfire/blob/master/docs/version-7-upgrade.md
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [ConfirmationService, DecimalPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
