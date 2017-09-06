import { NumberDials } from './NumberDials';

const DEFAULT = {
  DIGITS: 3,
  IS24HOUR: false,
}

export class ClockDials {
  _config: ClockDials.Config;
  _dials: NumberDials;

  constructor(config?: ClockDials.Config | any) {
    let dialsConfig = new NumberDials.Config();
    dialsConfig.minDigits = DEFAULT.DIGITS;
    dialsConfig.maxDigits = DEFAULT.DIGITS;
    dialsConfig.wrap = true;
    this._dials = new NumberDials(dialsConfig);

    this._config = new ClockDials.Config()
    if (config) {
      this.config = config;
    }

    let dialConfig = this._dials.dialConfig;

    this.configDialHours(dialConfig);

    // Minute-Tens: 0-5
    dialConfig.minValue = 0;
    dialConfig.maxValue = 5;
    this.dial.minutes10s.config = dialConfig;

    // Minute-Ones: 0-9
    dialConfig.minValue = 0;
    dialConfig.maxValue = 9;
    this.dial.minutes1s.config = dialConfig;
  }

  private configDialHours(config?: NumberDials.DialConfig) {
    if (!config) {
      config = this._dials.dialConfig;
    }

    if (this._config.is24hour) {
      config.minValue = 0;
      config.maxValue = 23;
    } else {
      config.minValue = 1;
      config.maxValue = 12;
    }

    this.dial.hours.config = config;
  }

  get config(): ClockDials.Config | any {
    return this._config;
  }

  get is24hour(): boolean {
    return this._config.is24hour;
  }

  set config(config: ClockDials.Config | any) {
    if (config) {
      if (typeof config.is24hour == 'boolean') {
        this._config.is24hour = config.is24hour;
        this.configDialHours();
      }
    }
  }

  get length() {
    return DEFAULT.DIGITS;
  }

  get dials() {
    return this._dials.dials;
  }

  get dial() {
    return {
      hours: this._dials.dials[0],
      minutes10s: this._dials.dials[1],
      minutes1s: this._dials.dials[2],
    }
  } 

  dialAt(idx: number): NumberDials.Dial {
    return this._dials.dialAt(idx);
  }

  get value(): string {
    return `${this.hours.string}:${this.minutes.string}`;
  }

  get hours() {
    return {
      number: this.dial.hours.value,
      string: this.is24hour && this.dial.hours.value < 10 ? `0${this.dial.hours.value}` : this.dial.hours.value.toString(),
    }
  }

  get minutes() {
    return {
      number: this.dial.minutes10s.value * 10 + this.dial.minutes1s.value,
      string: `${this.dial.minutes10s.value}${this.dial.minutes1s.value}`,
    }
  }
}

export module ClockDials {
  export class Config {
    is24hour: boolean;

    constructor() {
      this.is24hour = DEFAULT.IS24HOUR;
    }
  }
}
