const DEFAULT = {
  RADIX: 10,
  MIN_DIGITS: 0,
  MAX_DIGITS: -1, // -1 means no max
  MIN_VALUE: 0,
  MAX_VALUE: 9,
  WRAP: false,
};

export class NumberDials {
  private _config: NumberDials.Config;
  private _dials: NumberDials.Dial[];

  /* Constructor */

  constructor(config?: NumberDials.Config) {
    this._config = new NumberDials.Config();

    if (config) {
      this.config = config;
    }
  }

  /* Accessor Properties */

  get config(): NumberDials.Config {
    return this._config;
  }

  get radix() {
    return this._config.radix;
  }

  get minDigits() {
    return this._config.minDigits;
  }

  get maxDigits() {
    return this._config.maxDigits;
  }

  set config(config: NumberDials.Config) {
    if (config) {
      if (typeof config.radix == 'number' && config.radix > 0) {
        this._config.radix = config.radix;
      }
      if (typeof config.minDigits == 'number' && config.minDigits >= 0) {
        this._config.minDigits = config.minDigits;
      }
      if (typeof config.maxDigits == 'number' && config.maxDigits >= 0) {
        this._config.maxDigits = config.maxDigits;
      }
      if (typeof config.minValue == 'number') {
        this._config.minValue = config.minValue;
      }
      if (typeof config.maxValue == 'number') {
        this._config.maxValue = (config.maxValue >= this._config.radix) ? (this._config.radix = config.maxValue + 1) : config.maxValue;
      }
      if (typeof config.wrap == 'boolean') {
        this._config.wrap = config.wrap;
      }
    }

    if (this._config.maxDigits != -1 && this._config.minDigits > this._config.maxDigits) {
      throw new RangeError(`maxDigits ${this._config.maxDigits} must be greater than or equal to minDigits ${this._config.minDigits}`);
    }
    if (this._config.minValue > this._config.maxValue) {
      throw new RangeError(`maxValue ${this._config.maxValue} must be greater than or equal to minValue ${this._config.minValue}`);
    }

    this._dials = [ ];
    let dialConfig = this.dialConfig;
    for (let idx = 0; idx < this._config.minDigits; ++idx) {
      this._dials.push(new NumberDials.Dial(this, dialConfig));
    }
  }

  get dialConfig(): NumberDials.DialConfig {
    let config = new NumberDials.DialConfig();

    config.radix = this._config.radix;
    config.minValue = this._config.minValue;
    config.maxValue = this._config.maxValue;
    config.wrap = this._config.wrap;

    return config;
  }

  get dials(): NumberDials.Dial[] {
    return this._dials;
  }

  get length(): number {
    return this._dials.length;
  }

  get value(): number {
    let value = 0;

    for (let dial = this.leftMost; dial; dial = this.rightOf(dial)) {
      value *= this._config.radix;
      value += dial.value;
    }

    return value;
  }

  /* Iterable */

  get leftMost(): NumberDials.Dial {
    return this._dials[this._dials.length - 1];
  }

  leftOf(dial: NumberDials.Dial): NumberDials.Dial {
    if (!dial) return null;
    let idx = this._dials.indexOf(dial);
    if (-1 == idx) return null;
    if (this._dials.length - 1 == idx) return null;
    return this._dials[idx + 1];
  }

  get rightMost(): NumberDials.Dial {
    return this._dials[0];
  }

  rightOf(dial: NumberDials.Dial): NumberDials.Dial {
    if (!dial) return null;
    let idx = this._dials.indexOf(dial);
    if (1 > idx) return null; // both not-found and first
    return this._dials[idx - 1];
  }

  /* Resize */

  grow(): NumberDials.Dial {
    if (this._config.maxDigits == -1 || this._dials.length < this._config.maxDigits) {
      let dial = new NumberDials.Dial(this, this.dialConfig);
      this._dials.push(dial);
      return dial;
    }
    return null;
  }

  shrink(): NumberDials.Dial {
    if (this._dials.length > this._config.minDigits) {
      let dial = this._dials.pop();
      return dial;
    }
    return null;
  }

  remove(dial: NumberDials.Dial): boolean {
    let idx = this._dials.indexOf(dial);
    if (idx > -1 && this._dials.length > this._config.minDigits) {
      this.dials.splice(idx, 1);
      return true;
    }
    return false;
  }

  /* Utility */

  dialAt(idx: number): NumberDials.Dial {
    return this._dials[idx];
  }
}

export module NumberDials {

  export class DialConfig {
    radix: number;
    minValue: number;
    maxValue: number;
    wrap: boolean;

    constructor() {
      this.radix = DEFAULT.RADIX;
      this.minValue = DEFAULT.MIN_VALUE;
      this.maxValue = DEFAULT.MAX_VALUE;
      this.wrap = DEFAULT.WRAP;
    }
  }

  export class Config extends DialConfig {
    minDigits: number;
    maxDigits: number;

    constructor() {
      super();
      this.minDigits = DEFAULT.MIN_DIGITS;
      this.maxDigits = DEFAULT.MAX_DIGITS;
    }
  }

  export class Dial {
    private _group: NumberDials;
    private _config: NumberDials.DialConfig;
    private _value: number;

    /* Constructor */

    constructor(group: NumberDials, config?: NumberDials.DialConfig) {
      this._group = group || null;
      this._config = new NumberDials.DialConfig();

      if (config) {
        this.config = config;
      }

      this._value = this._config.minValue;
    }

    /** Accessor Properties **/

    get group(): NumberDials {
      return this._group;
    }

    get value(): number {
      return this._value;
    }

    set value(value: number) {
      if (value < this.minValue || value > this.maxValue) {
          throw new RangeError(`Value must be between ${this.minValue} and ${this.maxValue}`)
      }
      this._value = value;
    }

    get config(): NumberDials.DialConfig {
      return this._config;
    }

    set config(config: NumberDials.DialConfig) {
      if (config) {
        if (typeof config.radix == 'number' && config.radix > 0) {
          this._config.radix = config.radix;
        }
        if (typeof config.minValue == 'number' && config.minValue >= 0) {
          this._config.minValue = config.minValue;
        }
        if (typeof config.maxValue == 'number' && config.maxValue >= -1) {
          this._config.maxValue = config.maxValue;

          if (config.maxValue >= this._config.radix) {
            this._config.radix = config.maxValue + 1;
          }
        }
        if (typeof config.wrap == 'boolean') {
          this._config.wrap = config.wrap;
        }
      }

      if (this._config.minValue > this._config.maxValue) {
        throw new RangeError(`maxValue ${this._config.maxValue} must be greater than or equal to minValue ${this._config.minValue}`);
      }
    }

    get radix(): number {
      return this._config.radix;
    }

    get minValue(): number {
      return this._config.minValue;
    }

    get maxValue(): number {
      return this._config.maxValue;
    }

    get wrap(): boolean {
      return this._config.wrap;
    }

    /* Iterable */

    get isLeftMost(): boolean {
      if (!this._group) return false;
      return this === this._group.leftMost;
    }

    get left(): NumberDials.Dial {
      return this._group.leftOf(this);
    }

    get isRightMost(): boolean {
      if (!this._group) return false;
      return this === this._group.rightMost;
    }

    get right(): NumberDials.Dial {
      return this._group.rightOf(this);
    }

    get isOnly(): boolean {
      if (!this._group) return false;
      return 1 === this._group.length && this._group.dials[0] === this;
    }

    /* Increment, Decrement */

    increment(): boolean {
      let value = this._value + 1;

      // simple case
      if (value <= this._config.maxValue) {
        this._value = value;
        return true;
      }

      // greater than maxValue, so carry
      let left;

      if (this.isLeftMost) {
        left = this._group.grow();
        if (left) {
          left.value = 0;
        }
      } else {
        left = this.left;
      }

      if (left && left.increment()) {
        this._value = 0;
        return true;
      }

      return false;
    }

    decrement(): boolean {
      let value = this._value - 1;

      // when it's safe to simply decrement
      if (value > this.minValue || value == this.minValue && (this.isOnly || !this.isLeftMost)) {
        this._value = value;
        return true;
      }

      // decrementing the first digit to zero
      if (value == this.minValue && this.isLeftMost) {
        let right = this.right;

        // Get rid of any new leading zeros
        while (right && right.value == right.minValue) {

          // decrementing the 10s place from 10 (for example) should leave a zero
          if (right.isRightMost)
            break;

          let next = right.right;
          right.remove();
          right = next;
        }

        this._value = value;
        return this.remove();
      }

      // borrow
      if (!this.isLeftMost && value < this.minValue) {
        let left = <NumberDials.Dial>this;

        // find a value to borrow from
        while (left && left.value === left.minValue) {
          left = left.left;
        }

        // did we find one?
        if (left && left.value > left.minValue) {
          let right = left;

          // bring it across
          do {
            right = right.right;
            right.value = right.config.maxValue;
          } while (right && right != this);

          return left.decrement();
        }
      }

      // decrementing a non-first digit below zero
      return false;
    }

    /* Utility */

    remove(): boolean {
      return this._group.remove(this);
    }
  }
}
