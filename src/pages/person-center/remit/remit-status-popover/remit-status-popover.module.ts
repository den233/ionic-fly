import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RemitStatusPopoverPage } from './remit-status-popover';

@NgModule({
  declarations: [
    RemitStatusPopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(RemitStatusPopoverPage),
  ],
  exports: [
    RemitStatusPopoverPage
  ]
})
export class RemitStatusPopoverPageModule {}
