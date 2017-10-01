import { Component, OnInit, HostListener } from '@angular/core';
import { ClockDials } from '../../model/ClockDials';
import { ClockPage } from '../../pages/clock/clock';

@Component({
  selector: 'clock-dials',
  templateUrl: 'clock-dials.html'
})
export class ClockDialsComponent implements OnInit {

  private _model: ClockDials;
  private _parent: ClockPage;
  private _resizeTimeout: any;
  private _heartbeat: any;

  constructor() {
    this._model = new ClockDials({ is24hour: false });
  }

  ngOnInit() {
    this.value = new Date().toTimeString();

    this.onWindowResize();

    this._heartbeat = setInterval(() => {
      this.checkTheTime();
    }, 60000);
  }

  @HostListener('window:resize') onWindowResize() {
    if (this._resizeTimeout) {
      clearTimeout(this._resizeTimeout);
    }
    this._resizeTimeout = setTimeout((() => {
      // resize logic
    }).bind(this), 500);
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

  get is24hour(): boolean {
    return this._model.is24hour;
  }

  set value(value: string) {
    let values = value.split(':');

    values[0] = (parseInt(values[0]) % 12).toString();
    if (values[0] === '0' && !this.is24hour) values[0] = '12';

    this._model.value = values.join(':');
  }

  private checkTheTime() {
    let now = new Date().toLocaleTimeString().split(':');
    let value = this.value.split(':');

    // hours are the same && minutes are one behind
    if (now[0] == value[0] && parseInt(now[1]) == (parseInt(value[1]) + 1)) {
      this._model.dial.minutes1s.increment();
    }
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
