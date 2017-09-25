import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { SpeechProvider } from '../../providers/speech/speech';
import { NumberDialsComponent } from '../../components/number-dials/number-dials';
import { BasePage } from '../base-page';

@IonicPage()
@Component({
  selector: 'page-number',
  templateUrl: 'number.html',
})
export class NumberPage extends BasePage {

  @ViewChild(NumberDialsComponent) numberDials: NumberDialsComponent;

  constructor(protected navCtrl: NavController, protected modalCtrl: ModalController,
      protected network: Network, protected speech: SpeechProvider, protected cd: ChangeDetectorRef) {
    super(navCtrl, modalCtrl, network, speech, cd);
  }


  get type(): string {
    return 'number';
  }

  get value(): string {
    return this.numberDials.value.toString();
  }
}
