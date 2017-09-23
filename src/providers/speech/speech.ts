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

  get callback(): Function {
    return this._callback;
  }

  set callback(callback: Function) {
    if (callback) {
      this._callback = callback;
    }
  }

  get canPlay(): boolean {
    return [ SpeechStatus.Idle, SpeechStatus.Error ].indexOf(this._status) > -1;
  }

  playPause(type: string, value: string) {
    if (this.canPlay) {
      this.play(type, value);
    } else {
      this.stop();
    }
  }

  warmup(): Promise<string> {
    return this.cache.warmup();
  }

  play(type: string, value: string) {
    this._status = SpeechStatus.GetURL;
    this.cache.get(type, value).then(uri => {
      uri = uri.replace(/^file:\/\//, '');

      try {
        this._status = SpeechStatus.LoadSound;
        this._sound = this.audio.create(uri);
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

  stop() {
    if (this._sound) {
      this._sound.stop();
      this._sound.release();
    }

    this._status = SpeechStatus.Idle;

    if (this._callback) {
      this._callback('stop');
    }
  }

  onError(error) {
    if (this._sound) {
      this._sound.release();
    }

    this._status = SpeechStatus.Error;

    if (this._callback) {
      this._callback('onError');
    }
  }

  private onSoundSuccess() {
    this._sound.release();
    this._status = SpeechStatus.Idle;

    if (this._callback) {
      this._callback('onSoundSuccess');
    }
  }

  private onSoundError(error) {
    this.onError(error);

    this._sound.release();
    this._status = SpeechStatus.Error;

    if (this._callback) {
      this._callback('onSoundError');
    }
  }

}
