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

  constructor(public http: Http, private audio: Media) {
    this._status = SpeechStatus.Idle;
  }

  get status(): string {
    return this._status;
  }

  play(type: string, value: string) {
    let url: string;

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

  stop() {
    this._sound.stop();
    this._sound.release();
    this._status = SpeechStatus.Idle;
  }

  onError(error) {
    console.error(error);
    this._status = SpeechStatus.Error;
  }

  private onSoundSuccess() {
    this._sound.release();
    this._status = SpeechStatus.Idle;
  }

  private onSoundError(error) {
    this.onError(error);
    this._sound.release();
    this._status = SpeechStatus.Error;
  }

}
