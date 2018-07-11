import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RemitDetailPage } from './remit-detail';

@NgModule({
  declarations: [
    RemitDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(RemitDetailPage),
  ],
  exports: [
    RemitDetailPage
  ]
})
export class RemitDetailPageModule {}
