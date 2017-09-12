const DEFAULT = {
  RADIX: 10,
  MIN_DIGITS: 0,
  MAX_DIGITS: -1, // -1 means no max
  MIN_VALUE: 0,
  MAX_VALUE: 9,
  DEFAULT_VALUE: 0,
  WRAP: false,
};

export class NumberDials {
  private _config: NumberDials.Config;
  private _dials: NumberDials.Dial[];

  /* Constructor */

  constructor(config?: NumberDials.Config | any) {
    this._config = new NumberDials.Config();

    if (config) {
      this.config = config;
    }
  }

  /* Accessor Properties */

  get config(): NumberDials.Config | any {
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

  set config(config: NumberDials.Config | any) {
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
      if (typeof config.minValue == 'number' && config.minValue >= 0) {
        this._config.minValue = config.minValue;

        if (config.minValue > this._config.defaultValue) {
          this._config.defaultValue = config.minValue;
        }
      }
      if (typeof config.maxValue == 'number' && config.maxValue >= -1) {
        this._config.maxValue = config.maxValue;

        if (config.maxValue >= this._config.radix) {
          this._config.radix = config.maxValue + 1;
        }
      }
      if (typeof config.defaultValue == 'number') {
        this._config.defaultValue = config.defaultValue;

        if (this._config.defaultValue < this._config.minValue) {
          this._config.defaultValue = this._config.minValue;
        } else if (this._config.defaultValue > this._config.maxValue) {
          this._config.defaultValue = this._config.maxValue;
        }
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
    if (this._config.defaultValue < this._config.minValue || this._config.defaultValue > this._config.maxValue) {
      throw new RangeError(`defaultValue ${this._config.defaultValue} must be between minValue ${this._config.minValue} and maxValue ${this._config.maxValue}`);
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
    config.defaultValue = this._config.defaultValue;
    config.wrap = this._config.wrap;

    return config;
  }

  private _reverseCopy = function() {
    return this.slice(0).reverse();
  }

  get dials(): NumberDials.Dial[] {
    let value = this._dials;

    value.reverse = this._reverseCopy;

    return value;
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

  get canGrow(): boolean {
    return this._config.maxDigits == -1 || this._dials.length < this._config.maxDigits;
  }

  grow(): NumberDials.Dial {
    if (this.canGrow) {
      let dial = new NumberDials.Dial(this, { minValue: 1 });

      if (dial) {
        this.leftMost.config = { minValue: 0 };
        this._dials.push(dial);
      }

      return dial;
    }

    return null;
  }

  get canShrink(): boolean {
    return this._dials.length > this._config.minDigits;
  }

  shrink(): NumberDials.Dial {
    if (this.canShrink) {
      let dial = this._dials.pop();

      if (dial && this.length > 1) {
        this.leftMost.config = { minValue: 1 };
      }

      return dial;
    }

    return null;
  }

  remove(dial: NumberDials.Dial): boolean {
    if (this.canShrink) {
      let idx = this._dials.indexOf(dial);

      if (idx > -1) {
        this._dials.splice(idx, 1);

        if (this.length > 0) {
          this.leftMost.config = { minValue: 1 };
        }

        return true;
      }
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
    defaultValue: number;
    wrap: boolean;

    constructor() {
      this.radix = DEFAULT.RADIX;
      this.minValue = DEFAULT.MIN_VALUE;
      this.maxValue = DEFAULT.MAX_VALUE;
      this.defaultValue = DEFAULT.DEFAULT_VALUE;
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

    constructor(group: NumberDials, config?: NumberDials.DialConfig | any) {
      this._group = group || null;
      this._config = group ? group.dialConfig : new NumberDials.DialConfig();

      if (config) {
        this.config = config;
      }

      this._value = this._config.defaultValue;
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
          console.log(this);
          throw new RangeError(`Value must be between ${this.minValue} and ${this.maxValue}`)
      }
      this._value = value;
    }

    get config(): NumberDials.DialConfig | any {
      return this._config;
    }

    set config(config: NumberDials.DialConfig | any) {
      if (config) {
        if (typeof config.radix == 'number' && config.radix > 0) {
          this._config.radix = config.radix;
        }
        if (typeof config.minValue == 'number' && config.minValue >= 0) {
          this._config.minValue = config.minValue;

          if (config.minValue > this._config.defaultValue) {
            this._config.defaultValue = config.minValue;
          }
        }
        if (typeof config.maxValue == 'number' && config.maxValue >= -1) {
          this._config.maxValue = config.maxValue;

          if (config.maxValue >= this._config.radix) {
            this._config.radix = config.maxValue + 1;
          }
        }
        if (typeof config.defaultValue == 'number') {
          this._config.defaultValue = config.defaultValue;

          if (this._config.defaultValue < this._config.minValue) {
            this._config.defaultValue = this._config.minValue;
          } else if (this._config.defaultValue > this._config.maxValue) {
            this._config.defaultValue = this._config.maxValue;
          }
        }
        if (typeof config.wrap == 'boolean') {
          this._config.wrap = config.wrap;
        }
      }

      if (this._config.minValue > this._config.maxValue) {
        throw new RangeError(`maxValue ${this._config.maxValue} must be greater than or equal to minValue ${this._config.minValue}`);
      }
      if (this._config.defaultValue < this._config.minValue || this._config.defaultValue > this._config.maxValue) {
        throw new RangeError(`defaultValue ${this._config.defaultValue} must be between minValue ${this._config.minValue} and maxValue ${this._config.maxValue}`);
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
      if (value <= this.maxValue) {
        this._value = value;
        return true;
      }

      // greater than maxValue, so carry
      let left = this.left;

      if (left) {
        if (left.increment()) {
          this._value = 0;
          return true;
        }
      } else {
        if (this._group.grow()) {
          this._value = 0;
          return true;
        }

        if (this.wrap) {
          this._value = this.minValue;
          return true;
        }
      }

      return false;
    }

    decrement(): boolean {
      let value = this._value - 1;

      // when it's safe to simply decrement
      if (value >= this.minValue) {
        this._value = value;
        return true;
      }

      // decrementing below the minValue

      if (this.isOnly) {
        return false;
      }

      if (this.isLeftMost) {

        // remove leading zeros
        if (this.group.canShrink) {
          let count = 0;

          this._value = value;

          let group = this.group;
          while (group.length > group.minDigits && group.leftMost.value === 0) {
            if (group.shrink()) {
              ++count;
            }
          }

          return count > 0;
        }

        if (this.wrap) {
          this._value = this.maxValue;
          return true;
        }

        return false;
      }

      // borrow
      if (value < this.minValue) {
        let left = <NumberDials.Dial>this;

        // find a value to borrow from
        while (left && left.value === 0) {
          left = left.left;
        }

        // did we find one?
        if (left) {

          if (left.value > 0) {
            let right = left;

            // bring it across
            do {
              right = right.right;
              right.value = right.config.maxValue;
            } while (right && right != this);

            return left.decrement();
          }
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
