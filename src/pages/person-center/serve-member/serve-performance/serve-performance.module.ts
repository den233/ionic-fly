import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServePerformancePage } from './serve-performance';

@NgModule({
  declarations: [
    ServePerformancePage,
  ],
  imports: [
    IonicPageModule.forChild(ServePerformancePage),
  ],
  exports: [
    ServePerformancePage
  ]
})
export class ServePerformancePageModule {}
