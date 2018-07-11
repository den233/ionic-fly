import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletTradeDetailPage } from './wallet-trade-detail';

@NgModule({
  declarations: [
    WalletTradeDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletTradeDetailPage),
  ],
  exports: [
    WalletTradeDetailPage
  ]
})
export class WalletTradeDetailPageModule {}
