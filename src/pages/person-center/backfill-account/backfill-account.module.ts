import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BackfillAccountPage } from './backfill-account';

@NgModule({
  declarations: [
    BackfillAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(BackfillAccountPage),
  ],
  exports: [
    BackfillAccountPage
  ]
})
export class BackfillAccountPageModule {}
