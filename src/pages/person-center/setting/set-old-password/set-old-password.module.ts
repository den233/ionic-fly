import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SetOldPasswordPage } from './set-old-password';

@NgModule({
  declarations: [
    SetOldPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(SetOldPasswordPage),
  ],
  exports: [
    SetOldPasswordPage
  ]
})
export class SetOldPasswordPageModule {}
