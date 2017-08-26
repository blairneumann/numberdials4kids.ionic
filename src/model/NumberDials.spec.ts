import { async, TestBed } from '@angular/core/testing';
import { NumberDials } from './NumberDials';

let describe: any;
let beforeEach: any;
let it: any;
let expect: any;

describe('NumberDials', () => {
  let group: NumberDials;
  let dial: NumberDials.Dial;

  const radix = 10;
  const power = 3;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [ ],
      providers: [ ],
    });
  }));

  beforeEach(() => {

  });

  it('should be testable', () => {
    expect(dial).toBeTruthy();
  });

  it('should have the right group', () => {
    expect(dial.group === group).toBeTruthy();
  });

  it('should have the right default value', () => {
    expect(dial.value).toEqual(1);
  });

  it('should be the first and only in its group', () => {

    // should be the first, last, and only in its group
    expect(dial.isLeftMost && dial.isRightMost && dial.isOnly).toBeTruthy();
    expect(dial.left).toBeFalsy();
    expect(dial.right).toBeFalsy();

    // should have a group that grows
    expect(dial.group.grow()).toBeTruthy();
    expect(dial.group.grow()).toBeTruthy();
    expect(dial = dial.left).toBeTruthy();

    // should have prev and next (left and right) getters that work
    expect(dial.left === dial.group.dials[2]).toBeTruthy();
    expect(dial.right === dial.group.dials[0]).toBeTruthy();
  });

  it('should have prev and next (left and right) getters that work', () => {
    expect('tested with the previous spec').toBeTruthy();
  });

  it('should increment and decrement up to \'999\'', () => {

    // should not decrement below zero
    expect(dial.value).toEqual(1);
    expect(dial.decrement()).toBeTruthy();
    expect(dial.value).toEqual(0);
    expect(dial.decrement()).toBeFalsy();
    expect(dial.value).toEqual(0);

    // should increment up to radix
    for (let idx = 1; idx < radix; ++idx) {
      expect(dial.increment()).toBeTruthy();
      expect(dial.value).toEqual(idx);
    }

    // should add a dial when incrementing to radix
    expect(dial.value).toEqual(radix - 1);
    expect(dial.increment()).toBeTruthy();
    expect(dial.value).toEqual(0);
    expect(dial.left.value).toEqual(1);

    // should remove that dial when decremented back below
    expect(dial.left.decrement()).toBeTruthy();
    expect(dial.value).toEqual(radix - 1);
    expect(dial.left).toBeFalsy();

    // increment and shift dial to the left
    expect(dial.increment()).toBeTruthy();
    expect(dial = dial.left).toBeTruthy();
    expect(dial.right).toBeTruthy();
    expect(dial.left).toBeFalsy();

    // should increment up to radix^2 - 1
    for (let idx = 1; idx < radix; ++idx) {
      expect(dial.right.increment()).toBeTruthy();
      expect(dial.right.value).toEqual(idx);
      if (idx > 1) {
        expect(dial.increment()).toBeTruthy();
        expect(dial.value).toEqual(idx);
      }
    }

    console.log(dial.group.value);

    // should add a dial when incrementing up to radix^2
    expect(dial.value).toEqual(radix - 1);
    expect(dial.right).toBeTruthy();
    expect(dial.right.increment()).toBeTruthy();
    expect(dial.value).toEqual(0);
    expect(dial.left.value).toEqual(1);

    // should remove that dial when decremented back below
    expect(dial.left.decrement()).toBeTruthy();
    expect(dial.value).toEqual(radix - 1);
    expect(dial.left).toBeFalsy();

    // increment and shift dial to the left
    expect(dial.right.increment()).toBeTruthy();
    expect(dial = dial.left).toBeTruthy();
    expect(dial.right).toBeTruthy();
    expect(dial.left).toBeFalsy();

    // should increment up to radix^3 - 1 (999)
    for (let idx = 1; idx < radix; ++idx) {
      expect(dial.right.right.increment).toBeTruthy();
      expect(dial.right.right.value).toEqual(idx);
      expect(dial.right.increment()).toBeTruthy();
      expect(dial.right.value).toEqual(idx);
      if (idx > 1) {
        expect(dial.increment()).toBeTruthy();
        expect(dial.value).toEqual(idx);
      }
    }

    // should decrement each down to '111'
    dial = group.leftMost;
    for (let idx = 1; idx < radix - 1; ++idx) {
      expect(dial.right.right.decrement()).toBeTruthy();
      expect(dial.right.decrement()).toBeTruthy();
      expect(dial.decrement).toBeTruthy();
    }

    // then down to '100'
    expect(dial.right.decrement()).toBeTruthy();
    expect(dial.right.right.decrement()).toBeTruthy();

    // then down to '99'
    expect(dial = group.leftMost).toBeTruthy();
    expect(dial.decrement()).toBeTruthy();

    // then down to '90'
    expect(dial = group.leftMost).toBeTruthy();
    for (let idx = 1; idx < radix; ++idx) {
      expect(dial.decrement()).toBeTruthy();
    }

    // then down to '10'
    expect(dial = group.leftMost).toBeTruthy();
    for (let idx = 1; idx < radix; ++idx) {
      expect(dial.decrement()).toBeTruthy();
    }

    // then down to '9'
    expect(dial.decrement()).toBeTruthy();

    // then down to zero
    expect(dial = group.leftMost).toBeTruthy();
    for (let idx = 1; idx < radix; ++idx) {
      expect(dial.decrement()).toBeTruthy();
    }

    // should not decrement below zero
    expect(group.value).toEqual(0);
    expect(group.rightMost.decrement()).toBeFalsy();
    expect(dial.value).toEqual(0);
  });

  it('should not decrement below zero', () => {
    expect('tested with the previous spec').toBeTruthy();
  });

  it('should increment up to radix, which adds a dial and continues counting up', () => {
    expect('tested with the previous spec').toBeTruthy();
  });

  it('should decrement down past radix, which removes a dial and continues counting down', () => {
    expect('tested with the previous spec').toBeTruthy();
  });

  it('should repeat this for radix^2 and radix^3', () => {
    expect('tested with the previous spec').toBeTruthy();
  });

  it('should increment from zero to max and decrement back to zero by the left-most digit', () => {

    // start at zero
    expect(dial.decrement()).toBeTruthy();
    expect(dial.value).toEqual(0);

    // increment up to '999' by incrementing the left-most digit
    for (let idx = 0; idx < power; ++idx) {
      for (let idy = (idx ? 2 : 1); idy < radix; ++idy) {
        expect(group.leftMost.increment()).toBeTruthy();
      }
      if (idx < power - 1) {
        expect(group.grow()).toBeTruthy();
      }
    }

    // increment back down to zero by decrementing the left-most digit
    for (let idx = 0; idx < power; ++idx) {
      for (let idy = (idx < power - 1 ? 2 : 1); idy < radix; ++idy) {
        expect(group.leftMost.decrement()).toBeTruthy();
      }
      if (idx < power - 1) {
        expect(group.shrink()).toBeTruthy();
      }
    }

    // should be back at zero
    expect(group.value).toEqual(0);
  });

  it('should increment from zero to max and decrement back to zero by the right-most digit', () => {
    let value = 0;

    // start at zero
    expect(dial.decrement()).toBeTruthy();
    expect(dial.value).toEqual(0);

    dial = group.rightMost;
    for (let idx = 1; idx < Math.pow(radix, power); ++idx) {
      expect(dial.increment()).toBeTruthy();
      ++value;
    }

    for (let idx = 1; idx < Math.pow(radix, power); ++idx) {
      expect(dial.decrement()).toBeTruthy();
      --value;
    }

    // should be back at zero
    expect(group.value).toEqual(0);
  });

  it('should increment from zero to \'999\' and decrement back to zero in-order', () => {
    let value = 0;

    // start at zero
    expect(dial.decrement()).toBeTruthy();
    expect(dial.value).toEqual(0);

    for (let i100s = 0; i100s < radix; ++i100s) {
      for (let i10s = 0; i10s < radix; ++i10s) {
        for (let i1s = 0; i1s < radix; ++i1s) {
          if (i1s == radix - 1 && i10s == radix - 1 && i100s == radix - 1)
            continue;

          expect(dial.increment()).toBeTruthy();
          ++value;
        }
      }
    }

    for (let i100s = 0; i100s < radix; ++i100s) {
      for (let i10s = 0; i10s < radix; ++i10s) {
        for (let i1s = 0; i1s < radix; ++i1s) {
          if (!i1s && !i10s && !i100s)
            continue;

          expect(dial.decrement()).toBeTruthy();
          --value;
        }
      }
    }

    // should be back at zero
    expect(group.value).toEqual(0);
  });
});
