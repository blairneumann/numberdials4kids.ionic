import { Component } from '@angular/core';
import { NumberDials } from '../../model/NumberDials';
import { trigger, state, style, animate, transition } from '@angular/animations';

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
  disabled = { grow: false, shrink: false, increment: false, decrement: false };

  constructor() {
    let config = new NumberDials.Config();
    config.maxDigits = MAX_DIGITS;
    config.minDigits = MIN_DIGITS;
    config.defaultValue = DEFAULT_VALUE;
    this._model = new NumberDials(config);
  }

  get model(): NumberDials {
    return this._model;
  }

  get delimiter(): string {
    return ',';
  }

  private toModelIndex(idx: number) {
    return this._model.length - 1 - idx;
  }

  increment(idx: number) {
    if (!this._model.dialAt(this.toModelIndex(idx)).increment()) {
      this.disabled.increment = true;
    }
  }

  decrement(idx: number) {
    if (!this._model.dialAt(this.toModelIndex(idx)).decrement()) {
      this.disabled.decrement = true;
    }
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
    for (let value in this.disabled) {
      this.disabled[value] = false;
    }
  }
}
