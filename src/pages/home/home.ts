import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { NumberPage } from '../number/number';
import { ClockPage } from '../clock/clock';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  pages = [ NumberPage, ClockPage ];

  constructor(public navCtrl: NavController) { }

  navigateTo(idx: number) {
    this.navCtrl.push(this.pages[idx]);
  }
}
