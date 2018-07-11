import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PersonCenterPage } from './person-center';

@NgModule({
  declarations: [
    PersonCenterPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonCenterPage),
  ],
  exports: [
    PersonCenterPage
  ]
})
export class PersonCenterPageModule {}
