import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChargeResultPage } from './charge-result';

@NgModule({
  declarations: [
    ChargeResultPage,
  ],
  imports: [
    IonicPageModule.forChild(ChargeResultPage),
  ],
  exports: [
    ChargeResultPage
  ]
})
export class ChargeResultPageModule {}
