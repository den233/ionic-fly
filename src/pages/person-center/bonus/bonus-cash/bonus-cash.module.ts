import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BonusCashPage } from './bonus-cash';

@NgModule({
  declarations: [
    BonusCashPage,
  ],
  imports: [
    IonicPageModule.forChild(BonusCashPage),
  ],
  exports: [
    BonusCashPage
  ]
})
export class BonusCashPageModule {}
