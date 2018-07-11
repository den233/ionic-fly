import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FrozenAccountDetailPage } from './frozen-account-detail';

@NgModule({
  declarations: [
    FrozenAccountDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FrozenAccountDetailPage),
  ],
  exports: [
    FrozenAccountDetailPage
  ]
})
export class FrozenAccountDetailPageModule {}
