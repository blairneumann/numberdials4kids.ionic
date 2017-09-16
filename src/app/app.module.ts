import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { Media } from '@ionic-native/media'
import { FileTransfer } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

import { NumberDials4KidsApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { NumberPage } from '../pages/number/number';
import { ClockPage } from '../pages/clock/clock';
import { GoPlayPage } from '../pages/go-play/go-play';
import { NumberDialsComponent } from '../components/number-dials/number-dials';
import { ClockDialsComponent } from '../components/clock-dials/clock-dials';
import { SpeechProvider } from '../providers/speech/speech';
import { SpeechcacheProvider } from '../providers/speechcache/speechcache';

@NgModule({
  declarations: [
    NumberDials4KidsApp,
    HomePage,
    NumberPage,
    ClockPage,
    GoPlayPage,
    NumberDialsComponent,
    ClockDialsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    IonicModule.forRoot(NumberDials4KidsApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [ IonicApp ],
  entryComponents: [
    NumberDials4KidsApp,
    HomePage,
    NumberPage,
    ClockPage,
    GoPlayPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    Media,
    File,
    FileTransfer,
    SpeechProvider,
    SpeechcacheProvider,
  ]
})
export class AppModule {}
