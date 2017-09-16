import { Injectable } from '@angular/core';
import { Media, MediaObject } from '@ionic-native/media';
import { SpeechcacheProvider } from '../speechcache/speechcache';
import 'rxjs/add/operator/map';

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

  constructor(private audio: Media, private cache: SpeechcacheProvider) {
    this._status = SpeechStatus.Idle;
  }

  get status(): string {
    return this._status;
  }

  get canPlay(): boolean {
    return [ SpeechStatus.Idle, SpeechStatus.Error ].indexOf(this._status) > -1;
  }

  play(type: string, value: string, callback: Function) {
    console.log('play', type, value);

    this._status = SpeechStatus.GetURL;

    this.cache.get(type, value).then(uri => {
      console.log('uri', uri);
      try {
        this._status = SpeechStatus.LoadSound;
        this._sound = this.audio.create(uri);

        this._callback = callback || null;
        this._sound.onSuccess.subscribe(this.onSoundSuccess.bind(this));
        this._sound.onError.subscribe(this.onSoundError.bind(this));

        this._status = SpeechStatus.Playing;
        this._sound.play();
      } catch (error) {
        this.onError(error);
      }
    }).catch(error => {
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
