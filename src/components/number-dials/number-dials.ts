import { Component } from '@angular/core';
import { NumberDials } from '../../model/NumberDials';

const MAX_DIGITS = 3;
const MIN_DIGITS = 1;

@Component({
  selector: 'number-dials',
  templateUrl: 'number-dials.html'
})
export class NumberDialsComponent {

  private _model: NumberDials;
  disabled = { grow: false, shrink: false, increment: false, decrement: false };

  constructor() {
    let config = new NumberDials.Config();
    config.maxDigits = MAX_DIGITS;
    config.minDigits = MIN_DIGITS;
    this._model = new NumberDials(config);
    this._model.dials[0].value = 1;
  }

  get model(): NumberDials {
    return this._model;
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
