import { Component } from '@angular/core';
import { IonicPage,NavParams } from "ionic-angular";
@IonicPage({
  name: "tabs",
  segment: "tabs"
})
@Component({
  selector:'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  index = 0;
  orderType;//订单类型
  tab1Root = 'home';
  tab2Root = 'goodsList';
  tab3Root = 'cart';
  //暂时只有重消单
  // tab3Root = 'cartOnly';
  tab4Root = 'personCenter';


  constructor(public navParams: NavParams) {
    this.index = this.navParams.get('index') || 0;
    this.orderType = this.navParams.get('orderType');
    localStorage.setItem('orderType',this.orderType)
  }

  ngOnInit(){

  }
}
