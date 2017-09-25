import { NgModule } from '@angular/core';
import { NumberDialsComponent } from './number-dials/number-dials';
import { ClockDialsComponent } from './clock-dials/clock-dials';

@NgModule({
	declarations: [
		NumberDialsComponent,
    ClockDialsComponent,
	],
	imports: [],
	exports: [
		NumberDialsComponent,
    ClockDialsComponent,
	]
})

export class ComponentsModule { }
