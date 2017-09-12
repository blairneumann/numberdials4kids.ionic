import { NgModule } from '@angular/core';
import { NumberDialsComponent } from './number-dials/number-dials';
import { ClockDialsComponent } from './clock-dials/clock-dials';

@NgModule({
	declarations: [
		NumberDialsComponent,
    ClockDialsComponent,
    ClockDialsComponent,
	],
	imports: [],
	exports: [
		NumberDialsComponent,
    ClockDialsComponent,
    ClockDialsComponent,
	]
})

export class ComponentsModule {}
