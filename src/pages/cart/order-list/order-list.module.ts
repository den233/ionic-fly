import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderListPage } from './order-list';

@NgModule({
  declarations: [
    OrderListPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderListPage),
  ],
  exports: [
    OrderListPage
  ]
})
export class OrderListPageModule {}
