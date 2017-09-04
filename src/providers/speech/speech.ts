import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Media, MediaObject } from '@ionic-native/media';

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

  public status: string;
  private _sound: MediaObject;

  constructor(public http: Http, private audio: Media) {
    this.status = SpeechStatus.Idle;
  }

  play(type: string, value: string) {
    let url: string;

    if (type === 'clock') {
      value = value.replace(/:/g, '.');
    }

    url = BaseURL.replace(/\[TYPE]/g, type).replace(/\[VALUE]/g, value);

    this.status = SpeechStatus.GetURL;
    this.http.get(url)
      .map(response => response.json() || { })
      .subscribe(result => {

        this.status = SpeechStatus.LoadSound;
        this._sound = this.audio.create(result.url);

        if (this._sound) {
          this._sound.onSuccess.subscribe(this.onSoundSuccess.bind(this));
          this._sound.onError.subscribe(this.onSoundError.bind(this));

          this.status = SpeechStatus.Playing;
          this._sound.play();
        } else {
          this.status = SpeechStatus.Error;
        }
      }, error => {
        this.stop(error);
      });
  }

  stop(error?: any) {
    if (error) {
      console.error(error);
    }

    if (this._sound) {
      this._sound.stop();
      this._sound.release();
    }

    this.status = error ? SpeechStatus.Error : SpeechStatus.Idle;
  }

  private onSoundSuccess() {
    this._sound.release();
    this.status = SpeechStatus.Idle;
  }

  private onSoundError(error) {
    this.stop(error);
  }

}
