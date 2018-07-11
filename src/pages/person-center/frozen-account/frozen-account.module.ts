import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FrozenAccountPage } from './frozen-account';

@NgModule({
  declarations: [
    FrozenAccountPage,
  ],
  imports: [
    IonicPageModule.forChild(FrozenAccountPage),
  ],
  exports: [
    FrozenAccountPage
  ]
})
export class FrozenAccountPageModule {}
