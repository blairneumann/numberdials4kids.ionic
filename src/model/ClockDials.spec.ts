import { async, TestBed } from '@angular/core/testing';
import { ClockDials } from './ClockDials';
import 'jasmine';

describe('ClockDials', () => {
  let config: ClockDials.Config;
  let clock: ClockDials;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [ ],
      providers: [ ],
    });
  }));

  beforeEach(() => {
    config = new ClockDials.Config();
    clock = new ClockDials(config);
  });

  it('should be testable', () => {
    expect(clock).toBeTruthy();
    expect(clock.length).toBe(3);
    expect(clock.dials).toBeTruthy();
    expect(clock.dials.length).toBe(clock.length);
    expect(clock.value).toBe('0:00');
  });

  it('should be well-configured as a 12-hour clock', () => {
    expect(clock.config).toBeTruthy();
    expect(clock.config.is24hour).toBe(false);
    expect(clock.is24hour).toBe(false);
    expect(clock.dial.hours.minValue).toBe(1);
    expect(clock.dial.hours.maxValue).toBe(12);
    expect(clock.dial.minutes10s.minValue).toBe(0);
    expect(clock.dial.minutes10s.maxValue).toBe(5);
    expect(clock.dial.minutes1s.minValue).toBe(0);
    expect(clock.dial.minutes1s.maxValue).toBe(9);
  });

  it('should be well-configured as a 24-hour clock', () => {
    config.is24hour = true;
    clock.config = config;

    expect(clock.config).toBeTruthy();
    expect(clock.config.is24hour).toBe(true);
    expect(clock.is24hour).toBe(true);
    expect(clock.dial.hours.minValue).toBe(0);
    expect(clock.dial.hours.maxValue).toBe(23);
    expect(clock.dial.minutes10s.minValue).toBe(0);
    expect(clock.dial.minutes10s.maxValue).toBe(5);
    expect(clock.dial.minutes1s.minValue).toBe(0);
    expect(clock.dial.minutes1s.maxValue).toBe(9);
  });

  it('should hold and return appropriate values', () => {
    expect(clock.value).toBe('0:00');

    clock.dial.hours.value = 1;
    clock.dial.minutes10s.value = 2;
    clock.dial.minutes1s.value = 3;

    expect(clock.dial.hours.value).toBe(1);
    expect(clock.dialAt(2).value).toBe(1);
    expect(clock.dials[2].value).toBe(1);
    expect(clock.dial.minutes10s.value).toBe(2);
    expect(clock.dialAt(1).value).toBe(2);
    expect(clock.dials[1].value).toBe(2);
    expect(clock.dial.minutes1s.value).toBe(3);
    expect(clock.dialAt(0).value).toBe(3);
    expect(clock.dials[0].value).toBe(3);
    expect(clock.value).toBe('1:23');
    expect(clock.hours.number).toBe(1);
    expect(clock.hours.string).toBe('1');
    expect(clock.minutes.number).toBe(23);
    expect(clock.minutes.string).toBe('23');

    config.is24hour = true;
    clock.config = config;

    expect(clock.value).toBe('01:23');
    expect(clock.hours.number).toBe(1);
    expect(clock.hours.string).toBe('01');
    expect(clock.minutes.number).toBe(23);
    expect(clock.minutes.string).toBe('23');

    clock.dial.minutes10s.value = 0;

    expect(clock.value).toBe('01:03');
    expect(clock.hours.number).toBe(1);
    expect(clock.hours.string).toBe('01');
    expect(clock.minutes.number).toBe(3);
    expect(clock.minutes.string).toBe('03');
  });
});
