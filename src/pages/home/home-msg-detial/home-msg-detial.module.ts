import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeMsgDetialPage } from './home-msg-detial';

@NgModule({
  declarations: [
    HomeMsgDetialPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeMsgDetialPage),
  ],
  exports: [
    HomeMsgDetialPage
  ]
})
export class HomeMsgDetialPageModule {}
