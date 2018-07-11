import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServePerformanceTerminalPage } from './serve-performance-terminal';

@NgModule({
  declarations: [
      ServePerformanceTerminalPage,
  ],
  imports: [
    IonicPageModule.forChild(ServePerformanceTerminalPage),
  ],
  exports: [
      ServePerformanceTerminalPage
  ]
})
export class ServePerformanceTerminalPageModule {}
