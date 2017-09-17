import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { NumberDialsComponent } from '../../components/number-dials/number-dials';
import { SpeechProvider, SpeechStatus } from '../../providers/speech/speech';
import { GoPlayPage } from '../go-play/go-play';

const IconPlay = 'play';
const IconPause = 'pause';

@IonicPage()
@Component({
  selector: 'page-number',
  templateUrl: 'number.html',
})
export class NumberPage {

  private _interactionCount: number;
  _iconPlayPause: string;

  @ViewChild(NumberDialsComponent) numberDials: NumberDialsComponent;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
      private speech: SpeechProvider) {

    this._interactionCount = 0;
    this._iconPlayPause = IconPlay;
  }

  ionViewDidLoad() {
    this.numberDials.parent = this;
  }

  onBack() {
    this.navCtrl.pop();
  }

  public interact() {
    ++this._interactionCount;

    if (this._interactionCount % 10 === 0) {
      // setTimeout(() => {
      //   this.modalCtrl.create(GoPlayPage).present({ animate: false });
      // }, 800);
    }
  }

  get iconPlayPause(): string {
    return this._iconPlayPause;
  }

  public onComplete(value: string) {
    console.log('onComplete', value);
    this._iconPlayPause = IconPlay;
  }

  onPlayPause() {
    this.speech.callback = this.onComplete.bind(this);
    this._iconPlayPause = IconPause;
    this.speech.playPause('number', this.numberDials.value.toString());
  }
}
