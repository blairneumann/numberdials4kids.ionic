import { async, TestBed } from '@angular/core/testing';
import { ClockDialsComponent } from './clock-dials';
import { ClockDials } from '../../model/ClockDials';
import 'jasmine';

describe('clock-dials component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClockDialsComponent ],
      imports: [ ],
      providers: [ ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockDialsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof ClockDialsComponent).toBe(true);
  });

  it('should hold and return appropriate values', () => {
    component.ngOnInit();
    expect(component.value).toBe('12:34');
    expect(component.model.value).toBe(component.value);
    expect(component.model.dial.hours.value).toBe(12);
    expect(component.model.dial.minutes10s.value).toBe(3);
    expect(component.model.dial.minutes1s.value).toBe(4);

    component.decrement(0);
    expect(component.value).toBe('11:34');
    expect(component.model.value).toBe(component.value);
    expect(component.model.dial.hours.value).toBe(11);
    expect(component.model.dial.minutes10s.value).toBe(3);
    expect(component.model.dial.minutes1s.value).toBe(4);

    component.increment(2);
    expect(component.value).toBe('11:35');
    expect(component.model.value).toBe(component.value);
    expect(component.model.dial.hours.value).toBe(11);
    expect(component.model.dial.minutes10s.value).toBe(3);
    expect(component.model.dial.minutes1s.value).toBe(5);
  })
});
