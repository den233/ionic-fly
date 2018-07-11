import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RemitAccountPopoverPage } from './remit-account-popover';

@NgModule({
  declarations: [
    RemitAccountPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(RemitAccountPopoverPage),
  ],
  exports: [
    RemitAccountPopoverPage
  ]
})
export class RemitAccountPopoverPageModule {}
