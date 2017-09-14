import { Component, OnInit } from '@angular/core';
import { ClockDials } from '../../model/ClockDials';
import { ClockPage } from '../../pages/clock/clock';

@Component({
  selector: 'clock-dials',
  templateUrl: 'clock-dials.html'
})
export class ClockDialsComponent implements OnInit {

  private _model: ClockDials;
  private _parent: ClockPage;

  constructor() {
    this._model = new ClockDials({ is24hour: false });
  }

  ngOnInit() {
    // 12:34
    this._model.dial.hours.value = 12;
    this._model.dial.minutes10s.value = 3;
    this._model.dial.minutes1s.value = 4;
  }

  get model(): ClockDials {
    return this._model;
  }

  set parent(page: ClockPage) {
    this._parent = page;
  }

  get value(): string {
    return this._model.value;
  }

  private toModelIndex(idx: number) {
    return this._model.length - 1 - idx;
  }

  private interact() {
    if (this._parent) {
      this._parent.interact();
    }
  }

  increment(idx: number) {
    this._model.dialAt(this.toModelIndex(idx)).increment();
    this.interact();
  }

  decrement(idx: number) {
    this._model.dialAt(this.toModelIndex(idx)).decrement();
    this.interact();
  }
}
