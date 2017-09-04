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
    this._model = new ClockDials({ is24hour: false });

    // 12:34
    this._model.dial.hours.value = 12;
    this._model.dial.minutes10s.value = 3;
    this._model.dial.minutes1s.value = 4;
  }

  get model(): ClockDials {
    return this._model;
  }

  get value(): string {
    return this._model.value;
  }

  private toModelIndex(idx: number) {
    return idx;
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
