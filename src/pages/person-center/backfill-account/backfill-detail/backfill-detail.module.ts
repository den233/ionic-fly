import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BackfillDetailPage } from './backfill-detail';

@NgModule({
  declarations: [
    BackfillDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(BackfillDetailPage),
  ],
  exports: [
    BackfillDetailPage
  ]
})
export class BackfillDetailPageModule {}
