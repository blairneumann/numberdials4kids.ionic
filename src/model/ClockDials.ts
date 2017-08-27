import { NumberDials } from './NumberDials';

const DEFAULT = {
  DIGITS: 3,
  IS24HOUR: false,
}

export class ClockDials {
  _dials: NumberDials;

  constructor(config?: ClockDials.Config) {
    let dialsConfig = new NumberDials.Config();
    dialsConfig.minDigits = DEFAULT.DIGITS;
    dialsConfig.maxDigits = DEFAULT.DIGITS;
    this._dials = new NumberDials(dialsConfig);

    // Hours
    let dialConfig = this._dials.dialConfig;
    dialConfig.minValue = 1;
    dialConfig.maxValue = 12;
    this.dials[0].config = dialConfig;

    // Minute-Tens: 0-5
    dialConfig.minValue = 0;
    dialConfig.maxValue = 5;
    this.dials[1].config = dialConfig;

    // Minute-Ones: 0-9
    dialConfig.minValue = 0;
    dialConfig.maxValue = 9;
    this.dials[2].config = dialConfig;

    // 12:34 by default
    this.dials[0].value = 12;
    this.dials[1].value = 3;
    this.dials[2].value = 4;
  }

  get dials() {
    return this._dials.dials;
  }

  get length() {
    return DEFAULT.DIGITS;
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
