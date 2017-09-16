import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Media, MediaObject } from '@ionic-native/media';
import 'rxjs/add/operator/map';

const BaseURL = 'https://jtoun1d1qe.execute-api.us-west-2.amazonaws.com/prod/NumberDials4KidsSpeechCache?type=[TYPE]&[TYPE]=[VALUE]';

export const SpeechStatus = {
  Idle: 'idle',
  GetURL: 'getURL',
  LoadSound: 'loadSound',
  Playing: 'playing',
  Error: 'error',
}

@Injectable()
export class SpeechProvider {

  public _status: string;
  private _sound: MediaObject;
  private _callback: Function;

  constructor(public http: Http, private audio: Media) {
    this._status = SpeechStatus.Idle;
  }

  get status(): string {
    return this._status;
  }

  get canPlay(): boolean {
    return [ SpeechStatus.Idle, SpeechStatus.Error ].indexOf(this._status) > -1;
  }

  play(type: string, value: string, callback: Function) {
    let url: string;

    console.log('play', type, value);

    if (type === 'clock') {
      value = value.replace(/:/g, '.');
    }

    url = BaseURL.replace(/\[TYPE]/g, type).replace(/\[VALUE]/g, value);

    this._status = SpeechStatus.GetURL;
    this.http.get(url)
      .map(response => response.json() || { })
      .subscribe(result => {
        try {
          this._status = SpeechStatus.LoadSound;
          this._sound = this.audio.create(result.url);

          this._callback = callback || null;
          this._sound.onSuccess.subscribe(this.onSoundSuccess.bind(this));
          this._sound.onError.subscribe(this.onSoundError.bind(this));

          this._status = SpeechStatus.Playing;
          this._sound.play();
        } catch (error) {
          this.onError(error);
        }
      }, error => {
        this.onError(error);
      });
  }

  stop(callback: Function) {
    console.log('stop');

    this._callback = callback || null;

    if (this._sound) {
      this._sound.stop();
      this._sound.release();
    }

    this._status = SpeechStatus.Idle;

    if (this._callback) {
      this._callback();
    }
  }

  onError(error) {
    console.error(error);

    if (this._sound) {
      this._sound.release();
    }

    this._status = SpeechStatus.Error;

    if (this._callback) {
      this._callback();
    }
  }

  private onSoundSuccess() {
    this._sound.release();
    this._status = SpeechStatus.Idle;

    if (this._callback) {
      this._callback();
    }
  }

  private onSoundError(error) {
    this.onError(error);

    this._sound.release();
    this._status = SpeechStatus.Error;

    if (this._callback) {
      this._callback();
    }
  }

}
