import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellMemberPage } from './sell-member';

@NgModule({
  declarations: [
    SellMemberPage,
  ],
  imports: [
    IonicPageModule.forChild(SellMemberPage),
  ],
  exports: [
    SellMemberPage
  ]
})
export class SellMemberPageModule {}
