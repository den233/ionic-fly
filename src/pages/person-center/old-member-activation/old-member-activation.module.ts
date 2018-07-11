import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OldMemberActivationPage } from './old-member-activation';
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    OldMemberActivationPage,
  ],
  imports: [
    MultiPickerModule,
    IonicPageModule.forChild(OldMemberActivationPage),
  ],
  exports: [
    OldMemberActivationPage
  ]
})
export class OldMemberActivationPageModule {}
