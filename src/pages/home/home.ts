import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  LoadingController,
  ToastController,
  ModalController,
  NavParams,
  App,
  AlertController
} from "ionic-angular";
import { CommonService } from '../../providers/common.service';
import { DEV } from '../../providers/config';
import { Filter } from "../../providers/filter";

@IonicPage({
  name: "home",
  segment: "home",
  defaultHistory: []
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  addMoneyShow = false;
  useMoneyShow = false;
  isMsg:boolean = true;
  newsList = [];
  // 订单类型model
  model:boolean = false;
  // 钱包余额
  wallet:any;
  imgUrl = DEV.url;
  orderTypes = [];
  // 奖金
  bonus = {
    all: "",
    week: "",
    balance:'',
    balanceWeek:''
  };

  ifOrderType=true;

  constructor(public navCtrl: NavController,
              public commonService: CommonService,
              public navParams: NavParams,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              public appCtrl: App,
              public alertCtrl: AlertController) {
    
  }

  ionViewWillEnter() {
    this.addMoneyShow = localStorage.getItem('addMoneyShow') && localStorage.getItem('addMoneyShow') == '1'? true : false;
    this.useMoneyShow = localStorage.getItem('useMoneyShow') && localStorage.getItem('useMoneyShow') == '1'? true : false;
    this.loadData();
  }

    ionViewWillLeave() {
        this.model = false;
    }

  loadData(){
    this.getNewsGoods();
  }

  // 初始化loading
  createLoading() {
    let loading = this.loadingCtrl.create({
      spinner: "ios"
    });
    loading.present();
    return loading;
  }

  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1500,
      position: "bottom",
      cssClass: "text-center"
    });
    toast.present(toast);
  }

  // 新品推荐
  getNewsGoods(){
    let self = this;
    let load = self.createLoading();
    this.commonService.order({
      strAction:'getAppNewProducts'
      }).subscribe(
        data => {
          load && load.dismiss(); //关闭加载框
          if(data.statusCode == 0){
            self.newsList = data.body.data;
              this.getOrderType();
              this.getWallet();
              this.loadBonusAll();
              this.loadBonusWeek();
          }
        },
        err => {
          load && load.dismiss(); //关闭加载框
          console.error("ERROR", err);
        }
    );
  }

  loadBonusAll() {
    this.commonService
      .home({
        strAction: "getAppAllBonusCalcs"
      })
      .subscribe(
        data => {
          if (data.statusCode == 0) {
            let result = data.body || [];
            if(result && result.length){
              this.bonus.all = result[0]['BONUS_PV'] ? Number(result[0]['BONUS_PV'] || '0').toFixed(2) : '0';
            }
          } else {
            this.showToast(data.message);
          }
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }

  loadBonusWeek() {
    this.commonService
      .home({
        strAction: "getAppAllweekBonusCalcs"
      })
      .subscribe(
        data => {
          if (data.statusCode == 0) {
            let result = data.body || [];
            if(result && result.length){
              this.bonus.week = result[0]['BONUS_PV'] ? Number(result[0]['BONUS_PV'] || '0').toFixed(2) : '0';
              this.bonus.balanceWeek = result[0]['SEND_MONEY'] ? Number(result[0]['SEND_MONEY'] || '0').toFixed(2) : '0';
            }
            console.log(this.bonus.week)
          } else {
            this.showToast(data.message);
          }
        },
        err => {
          console.error("ERROR", err);
        }
      );
  }

  // 电子钱包
  getWallet(){
    let self = this;
    this.commonService.wallet({
      strAction:'getAppBankbookBalances'
      }).subscribe(
        data => {
          if(data.statusCode == 0){
            let arr = data.body.data || [];
            for(let i=0;i<arr.length;i++){
              if(arr[i].BANKBOOK_TYPE == '3'){
                this.wallet = arr[i].BALANCE ? Number(arr[i].BALANCE || '0').toFixed(2) : '0';
              }else if(arr[i].BANKBOOK_TYPE == '1'){
                this.bonus.balance = arr[i].BALANCE ? Number(arr[i].BALANCE || '0').toFixed(2) : '0';
              }
            }
          }
        },
        err => {
          console.error("ERROR", err);
        }
    );
  }


  // bonus & appoint
  /*1 ==> 累计奖金 show
    2 ==> 累计奖金 hide
    3 ==> 可用奖金 show
    4 ==> 可用奖金 hide
  */
  moneyShowClick(str){
    if(str == '1'){
      this.addMoneyShow = true;
      localStorage.setItem('addMoneyShow','1');
    }else if(str == '2'){
      this.addMoneyShow = false;
      localStorage.setItem('addMoneyShow','0');
    }else if(str == '3'){
      this.useMoneyShow = true;
      localStorage.setItem('useMoneyShow','1');
    }else if(str == '4'){
      this.useMoneyShow = false;
      localStorage.setItem('useMoneyShow','0');
          
    }
  }

  getOrderType(){
    this.commonService
    .order({
      strAction: "getAppOrdertype"
    })
    .subscribe(
      res => {
        if (res.statusCode == 0) {
          let data = res.body.data;

          for(let i=0;i<data.length;i++){
            if(data[i]['VALUE_CODE'] == 10 || data[i]['VALUE_CODE'] == 14 || data[i]['VALUE_CODE'] == 13){
                data.splice(i,1);
                i = i - 1;
            }
          }

          console.log(data)

          if(!data.length){
              this.ifOrderType = false;
              return false;
          }

          this.orderTypes = data;

          console.log('订单类型',this.orderTypes)
        } else {
          this.showToast(res.message);
        }
      },
      err => {
        console.error("ERROR", err);
      }
    );
  }

  // 商品详情
  goodsDetail(item,type,no,price,name,unino){
    if (type == 18) {
      item['PRODUCT_NO'] = no;
      item['FP_PRICE'] = price;
      item['PRODUCT_NAME'] = name;
      this.navCtrl.push("goodsPackageDetail", {
      category: type,//商品类型
      product: item,//商品编号
      packageId: unino ,//套餐id
      source:'home'
      });
    } else {
      this.navCtrl.push("goodsDetail", {
      category: type,
      productno: no,
      });
    }
    }


  // 新增订单
  goodsList(num,title){
    this.navCtrl.push('typeOrder',{
        'ordertype':num,
        'from':'home',
        'title':title
    });
  }

  //message
  goMsg(){
    this.navCtrl.push('homeMsg');
  }

  // add member
  addMember(){
    this.navCtrl.push('addMember',{tabIndex:0});
  }

  // 商品分类
  goGoods(){
    this.navCtrl.parent.select(1);
    //this.navCtrl.push('tabs',{index: 1});
  }

  // 新增订单
  addOrder(){
    this.model = true;
  }

  // close model
  close(){
    this.model = false;
  }

  // 钱包充值
  chargeBalance(){
    this.navCtrl.push('chargeBalance')
  }

  // 奖金提现
  goBonus(bool:boolean){

      /**
       * 验证二级密码是否为空
       */
      this.commonService.loginPwd({
          strAction:'pwd2IsNull',
      }).subscribe(
          data => {
              if(data.statusCode == 0){

                  let prompt = this.alertCtrl.create({
                      title: "请输入高级密码",
                      inputs: [
                          {
                              name: "password",
                              placeholder: "",
                              type: "password"
                          }
                      ],
                      buttons: [
                          {
                              text: "取消",
                              handler: data => {}
                          },
                          {
                              text: "确认",
                              handler: data => {
                                  if (!data.password) {
                                      this.showToast("请输入高级密码");
                                      return;
                                  }else{
                                    this.goBounusCash(data.password,bool);
                                  }
                              }
                          }
                      ]
                  });
                  prompt.present();

              }else{
                  this.showToast(data.message)
              }
          },
          err => {
              console.error("ERROR", err);
          }
      );

  }

    /**
     * 验证二级密码通过进入奖金
     */
  goBounusCash(pass,bool){
        this.commonService.loginPwd({
            strAction:'validateMemberPwd2',
            password2:pass
        }).subscribe(
            data => {
                if(data.statusCode == 0){
                  if(bool)
                    this.navCtrl.push('bonusCash');
                  else
                      this.navCtrl.push('bonus');
                }else{
                    this.showToast(data.message)
                }
            },
            err => {
                console.error("ERROR", err);
            }
        );
  }

  // 钱包
  goWallet(){
    this.navCtrl.push('wallet')
  }

  // banner 企业介绍
  detail(){
    this.navCtrl.push('homeDetail')
  }

}
