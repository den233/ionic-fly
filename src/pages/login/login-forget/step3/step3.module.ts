import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Step3Page } from './step3';

@NgModule({
  declarations: [
    Step3Page,
  ],
  imports: [
    IonicPageModule.forChild(Step3Page),
  ],
  exports: [
    Step3Page
  ]
})
export class Step3PageModule {}
