import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonInfoPage } from './person-info';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    PersonInfoPage,
  ],
  imports: [
    MultiPickerModule,
    IonicPageModule.forChild(PersonInfoPage),
  ],
  exports: [
    PersonInfoPage
  ]
})
export class PersonInfoPageModule {}
