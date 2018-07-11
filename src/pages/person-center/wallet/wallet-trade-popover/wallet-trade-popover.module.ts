import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletTradePopoverPage } from './wallet-trade-popover';

@NgModule({
  declarations: [
    WalletTradePopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletTradePopoverPage),
  ],
  exports: [
    WalletTradePopoverPage
  ]
})
export class WalletTradePopoverPageModule {}
