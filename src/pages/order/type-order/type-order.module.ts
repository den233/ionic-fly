import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TypeOrderPage } from './type-order';
import {ComponentsModule} from '../../../components/components.module';
@NgModule({
  declarations: [
    TypeOrderPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(TypeOrderPage),
  ],
  exports: [
    TypeOrderPage
  ]
})
export class TypeOrderPageModule {}
