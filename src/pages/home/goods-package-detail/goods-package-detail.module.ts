import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoodsPackageDetailPage } from './goods-package-detail';

@NgModule({
  declarations: [
    GoodsPackageDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(GoodsPackageDetailPage),
  ],
  exports: [
    GoodsPackageDetailPage
  ]
})
export class GoodsPackageDetailPageModule {}
