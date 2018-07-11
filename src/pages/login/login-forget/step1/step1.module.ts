import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Step1Page } from './step1';

@NgModule({
  declarations: [
    Step1Page,
  ],
  imports: [
    IonicPageModule.forChild(Step1Page),
  ],
  exports: [
    Step1Page
  ]
})
export class Step1PageModule {}
