import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RemitNewPage } from './remit-new';

@NgModule({
  declarations: [
    RemitNewPage,
  ],
  imports: [
    IonicPageModule.forChild(RemitNewPage),
  ],
  exports: [
    RemitNewPage
  ]
})
export class RemitNewPageModule {}
