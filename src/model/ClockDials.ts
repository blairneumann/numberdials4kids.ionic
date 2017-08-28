import { NumberDials } from './NumberDials';

const DEFAULT = {
  DIGITS: 3,
  IS24HOUR: false,
}

export class ClockDials {
  _dials: NumberDials;

  constructor(config?: ClockDials.Config | any) {
    let dialsConfig = new NumberDials.Config();
    dialsConfig.minDigits = DEFAULT.DIGITS;
    dialsConfig.maxDigits = DEFAULT.DIGITS;
    dialsConfig.wrap = true;
    this._dials = new NumberDials(dialsConfig);

    let dialConfig = this._dials.dialConfig;

    // Hours
    if (config && config.is24hour) {
      dialConfig.minValue = 0;
      dialConfig.maxValue = 23;
    } else {
      dialConfig.minValue = 1;
      dialConfig.maxValue = 12;
    }
    this.dials[0].config = dialConfig;

    // Minute-Tens: 0-5
    dialConfig.minValue = 0;
    dialConfig.maxValue = 5;
    this.dials[1].config = dialConfig;

    // Minute-Ones: 0-9
    dialConfig.minValue = 0;
    dialConfig.maxValue = 9;
    this.dials[2].config = dialConfig;
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
}

export module ClockDials {
  export class Config {
    is24hour: boolean;

    constructor() {
      this.is24hour = DEFAULT.IS24HOUR;
    }
  }
}
