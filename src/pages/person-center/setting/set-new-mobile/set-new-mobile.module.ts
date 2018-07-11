import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetNewMobilePage } from './set-new-mobile';

@NgModule({
  declarations: [
    SetNewMobilePage,
  ],
  imports: [
    IonicPageModule.forChild(SetNewMobilePage),
  ],
  exports: [
    SetNewMobilePage
  ]
})
export class SetNewMobilePageModule {}
