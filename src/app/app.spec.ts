import { async, TestBed } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { NumberDials4KidsApp } from './app.component';
import {
  PlatformMock,
  StatusBarMock,
  SplashScreenMock
} from '../../test-config/mocks-ionic';

import {} from 'jasmine';

describe('numberdials4kids app', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NumberDials4KidsApp],
      imports: [
        IonicModule.forRoot(NumberDials4KidsApp)
      ],
      providers: [
        { provide: StatusBar, useClass: StatusBarMock },
        { provide: SplashScreen, useClass: SplashScreenMock },
        { provide: Platform, useClass: PlatformMock }
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumberDials4KidsApp);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof NumberDials4KidsApp).toBe(true);
  });

});
