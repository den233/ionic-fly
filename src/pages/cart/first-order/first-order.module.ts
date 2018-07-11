import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FirstOrderPage } from './first-order';

@NgModule({
  declarations: [
    FirstOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(FirstOrderPage),
  ],
  exports: [
    FirstOrderPage
  ]
})
export class FirstOrderPageModule {}
