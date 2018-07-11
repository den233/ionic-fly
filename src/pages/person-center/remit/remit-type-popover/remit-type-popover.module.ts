import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RemitTypePopoverPage } from './remit-type-popover';

@NgModule({
  declarations: [
    RemitTypePopoverPage,
  ],
  imports: [
    IonicPageModule.forChild(RemitTypePopoverPage),
  ],
  exports: [
    RemitTypePopoverPage
  ]
})
export class RemitTypePopoverPageModule {}
