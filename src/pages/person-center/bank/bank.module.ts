import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BankListPage } from './bank';

@NgModule({
  declarations: [
    BankListPage,
  ],
  imports: [
    IonicPageModule.forChild(BankListPage),
  ],
  exports: [
    BankListPage
  ]
})
export class BankListPageModule {}
