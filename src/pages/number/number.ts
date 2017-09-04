import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NumberDialsComponent } from '../../components/number-dials/number-dials';
import { SpeechProvider, SpeechStatus } from '../../providers/speech/speech';

@IonicPage()
@Component({
  selector: 'page-number',
  templateUrl: 'number.html',
})
export class NumberPage {

  @ViewChild(NumberDialsComponent) numberDials: NumberDialsComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      private speech: SpeechProvider) { }

  ionViewDidLoad() { }

  get iconPlayPause(): string {
    return this.speech.status == SpeechStatus.Idle ? 'play' : 'pause';
  }

  onPlayPause() {
    this.speech.play('number', this.numberDials.value.toString());
  }
}
