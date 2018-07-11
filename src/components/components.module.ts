import { IonicModule } from 'ionic-angular';
import { NgModule } from '@angular/core';
import { IonProductsComponent } from './ion-products/ion-products';
import { ModalComponent } from './modal/modal';
import { ModalComponenta } from './modala/modala';
@NgModule({
    declarations: [IonProductsComponent,ModalComponenta,
    ModalComponent],
    imports: [
        IonicModule
    ],
    exports: [IonProductsComponent,ModalComponenta,
    ModalComponent]
})
export class ComponentsModule { }
