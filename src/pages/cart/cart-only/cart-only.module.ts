import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CartOnlyPage } from './cart-only';

@NgModule({
  declarations: [
    CartOnlyPage,
  ],
  imports: [
    IonicPageModule.forChild(CartOnlyPage),
  ],
  exports: [
    CartOnlyPage
  ]
})
export class CartOnlyPageModule {}
