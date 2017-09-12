import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { ClockDialsComponent } from '../../components/clock-dials/clock-dials';
import { SpeechProvider, SpeechStatus } from '../../providers/speech/speech';
import { GoPlayPage } from '../go-play/go-play';

@IonicPage()
@Component({
  selector: 'page-clock',
  templateUrl: 'clock.html',
})
export class ClockPage {

  private _interactionCount: number;

  @ViewChild(ClockDialsComponent) clockDials: ClockDialsComponent;

  constructor(private navCtrl: NavController, private modalCtrl: ModalController,
      private speech: SpeechProvider) {

    this._interactionCount = 0;
  }

  ionViewDidLoad() {
    this.clockDials.parent = this;
  }

  onBack() {
    this.navCtrl.pop();
  }

  public interact() {
    ++this._interactionCount;

    if (this._interactionCount % 10 === 0) {
      // this.modalCtrl.create(GoPlayPage).present({ animate: false });
    }
  }

  get iconPlayPause(): string {
    return this.speech.playStatus ? 'play' : 'pause';
  }

  onPlayPause() {
    this.speech.play('clock', this.clockDials.value);
  }
}
