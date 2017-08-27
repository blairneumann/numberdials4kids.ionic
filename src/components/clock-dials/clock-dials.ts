import { Component } from '@angular/core';
import { ClockDials } from '../../model/ClockDials';

@Component({
  selector: 'clock-dials',
  templateUrl: 'clock-dials.html'
})
export class ClockDialsComponent {

  private _model: ClockDials;
  disabled = { grow: false, shrink: false, increment: false, decrement: false };

  constructor() {
    let config: any;

    config = new ClockDials.Config();
    this._model = new ClockDials();
  }

  get model(): ClockDials {
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

  mouseup() {
    for (let value in this.disabled) {
      this.disabled[value] = false;
    }
  }
}
