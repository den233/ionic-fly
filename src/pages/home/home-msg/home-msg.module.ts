import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomeMsgPage } from './home-msg';

@NgModule({
  declarations: [
    HomeMsgPage,
  ],
  imports: [
    IonicPageModule.forChild(HomeMsgPage),
  ],
  exports: [
    HomeMsgPage
  ]
})
export class HomeMsgPageModule {}
