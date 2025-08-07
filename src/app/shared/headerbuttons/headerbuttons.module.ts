import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderbuttonsRoutingModule } from './headerbuttons-routing.module';


@NgModule({
  declarations: [HeaderbuttonsComponent],
  imports: [
    CommonModule,
    HeaderbuttonsRoutingModule
  ],
  exports:[HeaderbuttonsComponent]
})
export class HeaderbuttonsModule { }
