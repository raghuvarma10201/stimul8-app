import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NoDataFoundComponent } from './no-data-found/no-data-found.component';



@NgModule({
  declarations: [NoDataFoundComponent],
  imports: [CommonModule, IonicModule],
  exports: [NoDataFoundComponent]
})
export class SharedModule { }
