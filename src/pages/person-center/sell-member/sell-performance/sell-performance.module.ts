import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SellPerformancePage } from './sell-performance';

@NgModule({
  declarations: [
    SellPerformancePage,
  ],
  imports: [
    IonicPageModule.forChild(SellPerformancePage),
  ],
  exports: [
    SellPerformancePage
  ]
})
export class SellPerformancePageModule {}
