import { Component } from '@angular/core';
import { IonicPage, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-go-play',
  templateUrl: 'go-play.html',
})
export class GoPlayPage {
  _text: string;

  constructor(private viewCtrl: ViewController) {
    this._text = '¡¡ Hey,\ngo play !!';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GoPlayPage');
  }

  get text() {
    return {
      byLine: this._text.split('\n'),
      oneLine: this._text.replace(/\\n/g, ' '),
    };
  }

  public onClose() {
    this.viewCtrl.dismiss(null, null, { animate: false });
  }
}
