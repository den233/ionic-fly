import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderSearchPage } from './order-search';
import { SearchModule } from '../../../app/components/searchbar/search.module';
@NgModule({
  declarations: [
    OrderSearchPage,
  ],
  imports: [
      SearchModule,
      IonicPageModule.forChild(OrderSearchPage),
  ],
  exports: [
    OrderSearchPage
  ]
})
export class OrderSearchPageModule {}
