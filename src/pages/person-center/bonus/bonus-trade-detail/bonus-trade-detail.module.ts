import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BonusTradeDetailPage } from './bonus-trade-detail';

@NgModule({
  declarations: [
    BonusTradeDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BonusTradeDetailPage),
  ],
  exports: [
    BonusTradeDetailPage
  ]
})
export class BonusTradeDetailPageModule {}
