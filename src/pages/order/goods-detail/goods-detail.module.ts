import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoodsDetailPage } from './goods-detail';
import {ComponentsModule} from '../../../components/components.module';
@NgModule({
  declarations: [
    GoodsDetailPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(GoodsDetailPage),
  ],
  exports: [
    GoodsDetailPage
  ]
})
export class GoodsDetailPageModule {}
