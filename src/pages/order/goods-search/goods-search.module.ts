import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GoodsSearchPage } from './goods-search';
import { SearchModule } from "../../../app/components/searchbar/search.module";
import {ComponentsModule} from '../../../components/components.module';
@NgModule({
  declarations: [
    GoodsSearchPage,
  ],
  imports: [
    SearchModule,
    ComponentsModule,
    IonicPageModule.forChild(GoodsSearchPage),
  ],
  exports: [
    GoodsSearchPage
  ]
})
export class GoodsSearchPageModule {}
