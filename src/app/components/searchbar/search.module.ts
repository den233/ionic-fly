import {SearchComponent} from './search.component' ;  
import {CommonModule} from '@angular/common';  
import { NgModule } from '@angular/core';  
import { FormsModule } from '@angular/forms';  
import { HttpModule } from '@angular/http';  
  
@NgModule({  
  declarations: [  
    SearchComponent  
  ],  
  imports: [  
    CommonModule,  
    FormsModule,  
    HttpModule,  
  ],  
  providers: [],  
  exports: [SearchComponent],  
})  
export class SearchModule { }  