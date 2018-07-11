import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BonusCancelPage } from './bonus-cancel';

@NgModule({
  declarations: [
    BonusCancelPage,
  ],
  imports: [
    IonicPageModule.forChild(BonusCancelPage),
  ],
  exports: [
    BonusCancelPage
  ]
})
export class BonusCancelPageModule {}
