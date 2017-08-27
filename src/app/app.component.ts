import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
// import { NumberPage } from '../pages/number/number';
// import { ClockPage } from '../pages/clock/clock';

@Component({
  templateUrl: 'app.html'
})
export class NumberDials4KidsApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

//  pages: Array<{title: string, component: any, mode: string}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    // this.pages = [
    //   { title: 'Number Dials', component: NumberPage, mode: 'number' },
    //   { title: 'Clock Dials', component: ClockPage, mode: 'clock' }
    // ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page, mode: string) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component, { mode: mode });
  }
}
