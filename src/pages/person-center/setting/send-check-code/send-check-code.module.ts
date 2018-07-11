import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendCheckCodePage } from './send-check-code';

@NgModule({
  declarations: [
    SendCheckCodePage,
  ],
  imports: [
    IonicPageModule.forChild(SendCheckCodePage),
  ],
  exports: [
    SendCheckCodePage
  ]
})
export class SendCheckCodePageModule {}
