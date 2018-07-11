import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RepeatSalesPage } from './repeat-sales';

@NgModule({
  declarations: [
    RepeatSalesPage,
  ],
  imports: [
    IonicPageModule.forChild(RepeatSalesPage),
  ],
  exports: [
    RepeatSalesPage
  ]
})
export class RepeatSalesPageModule {}
