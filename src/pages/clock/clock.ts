import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ClockDialsComponent } from '../../components/clock-dials/clock-dials';
import { SpeechProvider, SpeechStatus } from '../../providers/speech/speech';

@IonicPage()
@Component({
  selector: 'page-clock',
  templateUrl: 'clock.html',
})
export class ClockPage {

  @ViewChild(ClockDialsComponent) clockDials: ClockDialsComponent;

  constructor(public navCtrl: NavController, public navParams: NavParams,
      private speech: SpeechProvider) { }

  ionViewDidLoad() { }

  get iconPlayPause(): string {
    return this.speech.status == SpeechStatus.Idle ? 'play' : 'pause';
  }

  onPlayPause() {
    this.speech.play('clock', this.clockDials.value);
  }
}
