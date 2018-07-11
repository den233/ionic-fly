import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddMemderResultPage } from './add-memder-result';

@NgModule({
  declarations: [
    AddMemderResultPage,
  ],
  imports: [
    IonicPageModule.forChild(AddMemderResultPage),
  ],
  exports: [
    AddMemderResultPage
  ]
})
export class AddMemderResultPageModule {}
