import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMemberPage } from './add-member';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    AddMemberPage,
  ],
  imports: [
    MultiPickerModule,
    IonicPageModule.forChild(AddMemberPage),
  ],
  exports: [
    AddMemberPage
  ]
})
export class AddMemberPageModule {}
