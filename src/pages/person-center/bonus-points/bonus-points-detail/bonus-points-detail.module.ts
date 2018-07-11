import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BonusPointsDetailPage } from './bonus-points-detail';

@NgModule({
  declarations: [
    BonusPointsDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BonusPointsDetailPage),
  ],
  exports: [
    BonusPointsDetailPage
  ]
})
export class BonusPointsDetailPageModule {}
