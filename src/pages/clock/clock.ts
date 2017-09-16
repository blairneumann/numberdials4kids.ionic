import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { ClockDialsComponent } from '../../components/clock-dials/clock-dials';
import { SpeechProvider } from '../../providers/speech/speech';
import { GoPlayPage } from '../go-play/go-play';

const IconPlay = 'play';
const IconPause = 'pause';

@IonicPage()
@Component({
  selector: 'page-clock',
  templateUrl: 'clock.html',
})
export class ClockPage {

  private _interactionCount: number;
  private _iconPlayPause: string;

  @ViewChild(ClockDialsComponent) clockDials: ClockDialsComponent;

  constructor(private navCtrl: NavController, private modalCtrl: ModalController,
      private speech: SpeechProvider) {

    this._interactionCount = 0;
    this._iconPlayPause = IconPlay;
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
    return this._iconPlayPause;
  }

  public onPlayComplete() {
    this._iconPlayPause = IconPlay;
  }

  onPlayPause() {
    if (this.speech.canPlay) {
      this._iconPlayPause = IconPause;
      this.speech.play('clock', this.clockDials.value, this.onPlayComplete.bind(this));
    } else {
      this.speech.stop(this.onPlayComplete.bind(this));
    }
  }
}
