import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NormalOrderPage } from './normal-order';

@NgModule({
  declarations: [
    NormalOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(NormalOrderPage),
  ],
  exports: [
    NormalOrderPage
  ]
})
export class NormalOrderPageModule {}
