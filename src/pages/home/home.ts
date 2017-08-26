import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private _mode: string;

  constructor(private navParams: NavParams) {
    this._mode = navParams.get('mode');
  }

  get mode(): string {
    return this._mode;
  }

  set mode(mode: string) {
    this._mode = mode;
  }
}
