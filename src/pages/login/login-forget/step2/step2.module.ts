import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Step2Page } from './step2';

@NgModule({
  declarations: [
    Step2Page,
  ],
  imports: [
    IonicPageModule.forChild(Step2Page),
  ],
  exports: [
    Step2Page
  ]
})
export class Step2PageModule {}
