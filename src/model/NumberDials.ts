const DEFAULT = {
  RADIX: 10,
  MIN_DIGITS: 0,
  MAX_DIGITS: -1, // -1 means no max
  MIN_VALUE: 0, // ignored
  MAX_VALUE: this.RADIX - 1,
  WRAP: false,
};

export class NumberDials {
  private _radix: number;
  private _minDigits: number;
  private _maxDigits: number;

  private _dialConfig: NumberDials.DialConfig;
  private _dials: NumberDials.Dial[];

  /* Constructor */

  constructor(config?: NumberDials.Config) {
    this._radix = config && typeof config.radix == 'number' && config.radix > 0 ? config.radix : DEFAULT.RADIX;
    this._minDigits = config && typeof config.minDigits == 'number' && config.minDigits >= 0 ? config.minDigits : DEFAULT.MIN_DIGITS;
    this._maxDigits = config && typeof config.maxDigits == 'number' && config.maxDigits >= 0 ? config.maxDigits : DEFAULT.MAX_DIGITS;

    if (this._maxDigits != -1 && this._minDigits > this._maxDigits) {
      throw new RangeError(`minDigits ${this._minDigits} must be less than or equal to maxDigits ${this._maxDigits}`);
    }

    this._dialConfig = new NumberDials.DialConfig();
    this._dialConfig.radix = this._radix;
    this._dialConfig.minValue = config && typeof config.minValue == 'number' ? config.minValue : DEFAULT.MIN_VALUE;
    this._dialConfig.maxValue = config && typeof config.maxValue == 'number' ? config.maxValue : DEFAULT.MAX_VALUE;
    this._dialConfig.wrap = config && typeof config.wrap == 'boolean' ? config.wrap : DEFAULT.WRAP;

    if (this._dialConfig.minValue > this._dialConfig.maxValue) {
      throw new RangeError(`minValue ${this._dialConfig.minValue} must be less than or equal to maxValue ${this._dialConfig.maxValue}`);
    }

    this._dials = [ ];
    for (let idx = 0; idx < this._minDigits; ++idx) {
      this._dials.push(new NumberDials.Dial(this, this._dialConfig));
    }
  }

  /* Accessor Properties */

  get radix() {
    return this._radix;
  }

  get minDigits() {
    return this._minDigits;
  }

  get maxDigits() {
    return this._maxDigits;
  }

  get dialConfig(): NumberDials.DialConfig {
    return this._dialConfig;
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
      value *= this._radix;
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
    if (this._maxDigits == -1 || this._dials.length < this._maxDigits) {
      let dial = new NumberDials.Dial(this, this._dialConfig);
      this._dials.push(dial);
      return dial;
    }
    return null;
  }

  shrink(): NumberDials.Dial {
    if (this._dials.length > this._minDigits) {
      let dial = this._dials.pop();
      return dial;
    }
    return null;
  }

  remove(dial: NumberDials.Dial): boolean {
    let idx = this._dials.indexOf(dial);
    if (idx > -1 && this._dials.length > this._minDigits) {
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
  }

  export class Config extends DialConfig {
    minDigits: number;
    maxDigits: number;
  }

  export class Dial {
    private _group: NumberDials;
    private _value: number;

    private _radix: number;
    private _minValue: number;
    private _maxValue: number;
    private _wrap: boolean;

    /* Constructor */

    constructor(group: NumberDials, config?: NumberDials.DialConfig) {
      this._group = group || null;
      this._radix = config && typeof config.radix == 'number' && config.radix > 0 ? config.radix : DEFAULT.RADIX;
      this._minValue = config && typeof config.minValue == 'number' && config.minValue >= 0 ? config.minValue : DEFAULT.MIN_VALUE;
      this._maxValue = config && typeof config.maxValue == 'number' && config.maxValue >= -1 ? config.maxValue : DEFAULT.MAX_VALUE;
      this._wrap = config && typeof config.wrap != 'undefined' ? config.wrap : DEFAULT.WRAP;

      if (this._minValue > this._maxValue) {
        throw new RangeError(`minValue ${this._minValue} must be less than or equal to maxValue ${this._maxValue}`);
      }

      this._value = this._minValue;
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

    get radix(): number {
      return this._radix;
    }

    get minValue(): number {
      return this._minValue;
    }

    get maxValue(): number {
      return this._maxValue;
    }

    get wrap(): boolean {
      return this._wrap;
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
    if (value < this._radix) {
      this._value = value;
      return true;
    }

    // case: radix, so carry
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
    if (value > 0 || value == 0 && (this.isOnly || !this.isLeftMost)) {
      this._value = value;
      return true;
    }

    // decrementing the first digit to zero
    if (value == 0 && this.isLeftMost) {
      let right = this.right;

      // Get rid of any new leading zeros
      while (right && right.value == 0) {

        // decrementing the 10s place from 10 (for example) should leave a zero
        if (right.isRightMost)
          break;

        let next = right.right;
        right.remove();
        right = next;
      }

      return this.remove();
    }

    // borrow
    if (!this.isLeftMost && value < 0) {
      let left = <NumberDials.Dial>this;

      // find a value to borrow from
      while (left && left.value === 0) {
        left = left.left;
      }

      // did we find one?
      if (left && left.value > 0) {
        let right = left;

        // bring it across
        do {
          right = right.right;
          right.value = this._radix - 1;
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
