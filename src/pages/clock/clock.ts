import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { SpeechProvider } from '../../providers/speech/speech';
import { ClockDialsComponent } from '../../components/clock-dials/clock-dials';
import { BasePage } from '../base-page';

@IonicPage()
@Component({
  selector: 'page-clock',
  templateUrl: 'clock.html',
})
export class ClockPage extends BasePage {
  @ViewChild(ClockDialsComponent) clockDials: ClockDialsComponent;

  constructor(protected navCtrl: NavController, protected modalCtrl: ModalController,
      protected network: Network, protected speech: SpeechProvider, protected cd: ChangeDetectorRef) {
    super(navCtrl, modalCtrl, network, speech, cd);
  }

  get type(): string {
    return 'clock';
  }

  get value(): string {
    return this.clockDials.value;
  }
}
