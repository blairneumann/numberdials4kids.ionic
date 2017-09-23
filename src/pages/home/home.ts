import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { NumberPage } from '../number/number';
import { ClockPage } from '../clock/clock';
import { SpeechProvider } from '../../providers/speech/speech';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pages = [ NumberPage, ClockPage ];

  constructor(public navCtrl: NavController, private speech: SpeechProvider) { }

  navigateTo(idx: number) {
    this.navCtrl.push(this.pages[idx]);
  }

  ionViewWillEnter() {
    this.speech.warmup();
  }
}
