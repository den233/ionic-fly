import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SecondPasswordPage } from './second-password';

@NgModule({
  declarations: [
    SecondPasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(SecondPasswordPage),
  ],
  exports: [
    SecondPasswordPage
  ]
})
export class SecondPasswordPageModule {}
