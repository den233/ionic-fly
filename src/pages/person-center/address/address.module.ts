import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressListPage } from './address';

@NgModule({
  declarations: [
    AddressListPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressListPage),
  ],
  exports: [
    AddressListPage
  ]
})
export class AddressListPageModule {}
