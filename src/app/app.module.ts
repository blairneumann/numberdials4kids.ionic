import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { NumberDials4KidsApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { NumberPage } from '../pages/number/number';
import { ClockPage } from '../pages/clock/clock';
import { NumberDialsComponent } from '../components/number-dials/number-dials';
import { ClockDialsComponent } from '../components/clock-dials/clock-dials';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    NumberDials4KidsApp,
    HomePage,
    NumberPage,
    ClockPage,
    NumberDialsComponent,
    ClockDialsComponent,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(NumberDials4KidsApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    NumberDials4KidsApp,
    HomePage,
    NumberPage,
    ClockPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
