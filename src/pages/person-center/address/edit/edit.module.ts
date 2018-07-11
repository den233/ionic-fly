import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddressEditPage } from './edit';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    AddressEditPage,
  ],
  imports: [
    MultiPickerModule,
    IonicPageModule.forChild(AddressEditPage),
  ],
  exports: [
    AddressEditPage
  ]
})
export class AddressEditPageModule {}
