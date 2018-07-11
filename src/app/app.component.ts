import {Injectable,Component,ViewChild} from '@angular/core';
import { Nav,App} from 'ionic-angular';
import { CommonService } from '../providers/common.service';

@Injectable()
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav:Nav;

  rootPage: any;

  constructor(
      public commonService: CommonService,
      private app:App
  ) {
      this.rootPage = 'login';
      /**
       * 用户复制url操作
       */
      this.getTokenValid();

      // window.addEventListener('popstate', ()=>{

          // let url = window.location.href;
          // let ele = document.querySelectorAll('.tabbar');


          // if(ele != null){
          //     if(
          //         url.indexOf('home/home') > -1
          //         || url.indexOf('goodsList/goodsList') > -1
          //         || url.indexOf('cart/cart') > -1
          //         || url.indexOf('personCenter/personCenter') > -1){
          //
          //         Object.keys(ele).map((key)=>{
          //             ele[key].style.display = 'flex'
          //         });
          //     }
          // }
      // });
  }


  getTokenValid(){
      this.commonService
          .order({
              strAction: "getAppOrdertype"
          })
          .subscribe(
              res => {

              },
              err => {
                  console.error("ERROR", err);
              }
          );
  }

}
