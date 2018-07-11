import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressDetailEditPage } from './detail-edit';

@NgModule({
  declarations: [
    AddressDetailEditPage,
  ],
  imports: [
    IonicPageModule.forChild(AddressDetailEditPage),
  ],
  exports: [
    AddressDetailEditPage
  ]
})
export class AddressDetailEditPageModule {}
