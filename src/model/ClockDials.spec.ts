import { async, TestBed } from '@angular/core/testing';
import { ClockDials } from './ClockDials';

describe('ClockDials', () => {
  let clock: ClockDials;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [ ],
      providers: [ ],
    });
  }));

  beforeEach(() => {
    let config = new ClockDials.Config();
    clock = new ClockDials(config);
  });
});
