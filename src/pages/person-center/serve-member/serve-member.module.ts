import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServeMemberPage } from './serve-member';

@NgModule({
  declarations: [
    ServeMemberPage,
  ],
  imports: [
    IonicPageModule.forChild(ServeMemberPage),
  ],
  exports: [
    ServeMemberPage
  ]
})
export class ServeMemberPageModule {}
