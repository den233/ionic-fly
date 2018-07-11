import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BonusDetailPage } from './bonus-detail';

@NgModule({
  declarations: [
    BonusDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BonusDetailPage),
  ],
  exports: [
    BonusDetailPage
  ]
})
export class BonusDetailPageModule {}
