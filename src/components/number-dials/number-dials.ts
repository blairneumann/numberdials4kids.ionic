import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NumberDials } from '../../model/NumberDials';
import { NumberPage } from '../../pages/number/number';
import { trigger, style, animate, transition } from '@angular/animations';

const MAX_DIGITS = 4;
const MIN_DIGITS = 1;
const DEFAULT_VALUE = 1;

@Component({
  selector: 'number-dials',
  templateUrl: 'number-dials.html',
  animations: [
    trigger('dialInOut', [
      transition(':enter', [
        style({
          transform: 'translateX(0) scale(0)',
          opacity: 0,
        }),
        animate('200ms ease-out'),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({
          transform: 'translateX(0) scale(0)',
          opacity: 0,
        })),
      ]),
    ]),
  ],
})
export class NumberDialsComponent {

  private _model: NumberDials;
  private _parent: NumberPage;

  public disabled = new DisabledControlFlags();

  constructor(private platform: Platform) {
    let config = new NumberDials.Config();
    config.maxDigits = MAX_DIGITS;
    config.minDigits = MIN_DIGITS;
    config.defaultValue = DEFAULT_VALUE;
    this._model = new NumberDials(config);
  }

  get model(): NumberDials {
    return this._model;
  }

  set parent(page: NumberPage) {
    this._parent = page;
  }

  get value(): number {
    return this._model.value;
  }

  get delimiter(): string {
    return ',';
  }

  get controls(): string {
    return this.platform.isLandscape() ? 'side' : 'top';
  }

  grow(): boolean {
    if (this._model.length < MAX_DIGITS) {
      return null != this._model.grow();
    }

    this.disabled.grow = true;
    return false;
  }

  shrink(): boolean {
    if (this._model.length > MIN_DIGITS) {
      return null != this._model.shrink();
    }

    this.disabled.shrink = true;
    return false;
  }

  mouseup() {
    this.disabled = new DisabledControlFlags();
  }

  private toModelIndex(idx: number) {
    return this._model.length - 1 - idx;
  }

  increment(idx: number) {
    if (!this._model.dialAt(this.toModelIndex(idx)).increment()) {
      this.disabled.increment[idx] = true;
    }
  }

  decrement(idx: number) {
    if (!this._model.dialAt(this.toModelIndex(idx)).decrement()) {
      this.disabled.decrement[idx] = true;
    }
  }
}

class DisabledControlFlags {
  grow: boolean;
  shrink: boolean;
  increment: Array<boolean>;
  decrement: Array<boolean>;

  constructor() {
    this.grow = false;
    this.shrink = false;
    this.increment = [ ];
    this.decrement = [ ];
  };
}
