import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BonusPointsPage } from './bonus-points';

@NgModule({
  declarations: [
    BonusPointsPage,
  ],
  imports: [
    IonicPageModule.forChild(BonusPointsPage),
  ],
  exports: [
    BonusPointsPage
  ]
})
export class BonusPointsPageModule {}
