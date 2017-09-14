import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { NumberDialsComponent } from '../../components/number-dials/number-dials';
import { SpeechProvider, SpeechStatus } from '../../providers/speech/speech';
import { GoPlayPage } from '../go-play/go-play';

@IonicPage()
@Component({
  selector: 'page-number',
  templateUrl: 'number.html',
})
export class NumberPage {

  private _interactionCount: number;

  @ViewChild(NumberDialsComponent) numberDials: NumberDialsComponent;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
      private speech: SpeechProvider) {

    this._interactionCount = 0;
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
      setTimeout(() => {
        this.modalCtrl.create(GoPlayPage).present({ animate: false });
      }, 800);
    }
  }

  get iconPlayPause(): string {
    return this.speech.playStatus ? 'play' : 'pause';
  }

  onPlayPause() {
    this.speech.play('number', this.numberDials.value.toString());
  }
}
