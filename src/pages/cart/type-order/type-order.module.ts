import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TypeOrderPage } from './type-order';

@NgModule({
  declarations: [
    TypeOrderPage,
  ],
  imports: [
    IonicPageModule.forChild(TypeOrderPage),
  ],
  exports: [
    TypeOrderPage
  ]
})
export class TypeOrderPageModule {}
