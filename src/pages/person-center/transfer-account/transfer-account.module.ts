import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransferAccountPage } from './transfer-account';

@NgModule({
  declarations: [
    TransferAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(TransferAccountPage),
  ],
  exports: [
    TransferAccountPage
  ]
})
export class TransferAccountPageModule {}
