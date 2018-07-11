import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BankEditPage } from './edit';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    BankEditPage,
  ],
  imports: [
    MultiPickerModule,
    IonicPageModule.forChild(BankEditPage),
  ],
  exports: [
    BankEditPage
  ]
})
export class BankEditPageModule {}
