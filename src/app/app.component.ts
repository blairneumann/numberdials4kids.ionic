import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { SpeechProvider } from '../providers/speech/speech';

@Component({
  templateUrl: 'app.html'
})
export class NumberDials4KidsApp implements OnInit, OnDestroy {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  constructor(public platform: Platform, private speech: SpeechProvider,
      public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.hide();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.speech.warmup();
    document.addEventListener('resume', () => {
      this.speech.warmup();
    }, false);
  }

  ngOnDestroy() {
    this.speech.clear();
  }

  openPage(page, mode: string) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component, { mode: mode });
  }
}
