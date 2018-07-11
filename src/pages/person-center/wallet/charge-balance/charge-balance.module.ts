import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChargeBalancePage } from './charge-balance';

@NgModule({
  declarations: [
    ChargeBalancePage,
  ],
  imports: [
    IonicPageModule.forChild(ChargeBalancePage),
  ],
  exports: [
    ChargeBalancePage
  ]
})
export class ChargeBalancePageModule {}
