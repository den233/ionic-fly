import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommonResultPage } from './common-result';

@NgModule({
  declarations: [
    CommonResultPage,
  ],
  imports: [
    IonicPageModule.forChild(CommonResultPage),
  ],
  exports: [
    CommonResultPage
  ]
})
export class CommonResultPageModule {}
