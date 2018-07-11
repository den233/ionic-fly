import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { HttpModule} from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpService } from '../providers/http.service';
import { CommonService } from '../providers/common.service';
import { base } from '../providers/base';
import { Filter } from "../providers/filter";
import { CommonModule } from '@angular/common';
import { Global } from "../providers/global";
import { MultiPickerModule } from 'ion-multi-picker';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule ,
    
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      tabsHideOnSubPages: 'true',
      iconMode: 'ios',
      mode: 'ios',
      preloadModules: true
    }),
    IonicStorageModule.forRoot({
      name: '隆力奇',
      driverOrder: ['localstorage']
    }),
    MultiPickerModule 
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CommonService,
    HttpService,
    Filter,
    Global,
		base,
    CommonModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule {}
