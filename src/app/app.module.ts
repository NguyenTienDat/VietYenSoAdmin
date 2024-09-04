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
  // apiKey: 'AIzaSyAmWtEdw-4PjzdDXkYFKEyxz1S2L38vZ1o',
  // authDomain: 'dathangjs.firebaseapp.com',
  // projectId: 'dathangjs',
  // storageBucket: 'dathangjs.appspot.com',
  // messagingSenderId: '118350461604',
  // appId: '1:118350461604:web:522c2624e4248f51bc0431',

  apiKey: "AIzaSyAE7sbmviFvNf5L69naqHmUBTqAE060F78",
  authDomain: "reminder-c8fb6.firebaseapp.com",
  projectId: "reminder-c8fb6",
  storageBucket: "reminder-c8fb6.appspot.com",
  messagingSenderId: "559703113656",
  appId: "1:559703113656:web:4f4634e69dcc65fbc5994d",
  measurementId: "G-3ZWXVRD5TM"
};



// const firebaseConfig = {
//   apiKey: 'AIzaSyCLAwZp9yA6nO8T9_zrnVcuLwjfaPNhfLA',
//   authDomain: 'dathangangular.firebaseapp.com',
//   projectId: 'dathangangular',
//   storageBucket: 'dathangangular.appspot.com',
//   messagingSenderId: '734578423279',
//   appId: '1:734578423279:web:9b39751e9fef168f6ef21a',
//   measurementId: 'G-V049MJKQBG',
// };

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
