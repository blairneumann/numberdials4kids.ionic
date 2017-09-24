import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, ModalController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { NumberDialsComponent } from '../../components/number-dials/number-dials';
import { SpeechProvider } from '../../providers/speech/speech';
import { GoPlayPage } from '../go-play/go-play';

const IconPlay = 'play';
const IconPause = 'pause';

@IonicPage()
@Component({
  selector: 'page-number',
  templateUrl: 'number.html',
})
export class NumberPage implements OnInit {

  private _interactionCount: number;
  private _iconPlayPause: string;

  private _online: boolean;
  private _subConnect;
  private _subDisconnect;


  @ViewChild(NumberDialsComponent) numberDials: NumberDialsComponent;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController,
      private network: Network, private speech: SpeechProvider, private cd: ChangeDetectorRef) {

    this._interactionCount = 0;
    this._iconPlayPause = IconPlay;
  }

  ngOnInit() {
    this._online = true;

    this._subConnect = this.network.onConnect().subscribe(() => {
      this._online = true;
    });

    this._subDisconnect = this.network.onDisconnect().subscribe(() => {
      this._online = false;
    });

    setTimeout(() => {
      this._online = this.network.type != 'none';
    }, 3000);
  }

  ionViewDidLoad() {
    this.numberDials.parent = this;
  }

  get online(): boolean {
    return this._online;
  }

  get iconPlayPause(): string {
    return this._online ? this._iconPlayPause : 'wifi';
  }

  get colorPlayPause(): string {
    return this._online ? 'dark' : 'light';
  }

  onBack() {
    this.navCtrl.pop();
  }

  onPlayPause() {
    this._iconPlayPause = IconPause;
    this.speech.callback = this.onComplete.bind(this);
    this.speech.playPause('number', this.numberDials.value.toString());
  }

  public onComplete(value: string) {
    this._iconPlayPause = IconPlay;
    this.cd.detectChanges();
  }

  public interact() {
    ++this._interactionCount;

    if (this._interactionCount % 10 === 0) {
      // setTimeout(() => {
      //   this.modalCtrl.create(GoPlayPage).present({ animate: false });
      // }, 800);
    }
  }
}
