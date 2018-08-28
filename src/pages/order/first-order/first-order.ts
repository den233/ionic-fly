import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController,AlertController} from 'ionic-angular';
import { CommonService } from '../../../providers/common.service';
import { DEV } from '../../../providers/config';
import {getColorSize,unique,deepClone} from '../../../providers/base';
import { INTERNAL_BROWSER_DYNAMIC_PLATFORM_PROVIDERS } from '@angular/platform-browser-dynamic/src/platform_providers';
@IonicPage({
    name: "firstOrder",
    segment: "firstOrder",
    defaultHistory: []
})

@Component({
  selector: 'page-first-order',
  templateUrl: 'first-order.html',
})
export class FirstOrderPage {

  public imgUrl = DEV.imgUrl;
  public isCheck:boolean = true;
  public goodsList = [];
  public packageList = [];
  public item={};
  public oldPackageList = [];
    /**
     * 套餐单品只能选一个
     * @type isSingle
     */
  public checkType:string = '';
  public settleTotal = {
      number:0,
      pv:0,
      money:0
  };
  public totalPrice:number = 0;
  public totalPv:number = 0;
  public checkIds = [];
  public settleItem = [];
  public old:boolean = false;
  public model= 0;
  public lists:boolean=false;
  public colorCheck=false;
  public sizeCheck=false;
  public shopArray=[];
  public packageArray=[];
  public typeGroup={
    color:'',
    size:'',
    colorId:'',
    sizeId:''
  }
  public UNI_NO='';//产品id
  public colorGroup='';
  public sizeGroup='';
  public colorGroup1=[];//颜色组
  public sizeGroup1=[];//尺寸组
  public cartImg='';//图片
  public select_type="";
  public FP_PRICE='';
  public PRODUCT_NAME='';
  public colorArray=[];
  public sizeArray=[];
  public result=[];
   
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public loadingCtrl: LoadingController,
      public toastCtrl: ToastController,
      public commonService: CommonService,
      public alertCtrl: AlertController) {

      this.old = this.navParams.get('old');
  }

  ionViewDidLoad() {
    this.getCartList();
  }

    /**
     * 获取首单列表数据
     */
  getCartList(){
      let data = {
          'strAction':'getAppProducts',
          "ordertype":"10",
          'size':10000
      };
      let load = this.createLoading();
      this.commonService.order(data).subscribe(
          data => {
              load && load.dismiss(); //关闭加载框

              if(data.statusCode == 0){

                  let odata = data.body.data;

                  for(let i = 0; i<odata.length; i++){

                      odata[i]['isCheck'] = false;
                      odata[i]['QTY'] = 1;
                      odata[i]["SHOES_COLOUR"] ="";
                      odata[i]["SHOES_SIZE"] ="";
                      odata[i]["disabled"] = true;
                      /**
                       * 老会员激活
                       */
                      if(this.old){
                          if(odata[i]['OLDACTIVATION'] == '1' && odata[i]['PRODUCT_CATEGORY'] == '18'){
                             odata[i].type='package'
                            this.packageList.push(odata[i]);
                          }

                          if(odata[i]['OLDACTIVATION'] == '1' && odata[i]['PRODUCT_CATEGORY'] != '18'){
                            odata[i].type='single'
                            this.goodsList.push(odata[i]);
                          }
                      }else{
                          /**
                           * 首单过滤套餐类型
                           */
                          if(odata[i]['PRODUCT_CATEGORY'] == '18'){
                            odata[i].type='package'
                              this.packageList.push(odata[i]);
                          }

                          if(odata[i]['PRODUCT_CATEGORY'] != '18'){
                            odata[i].type='single'
                              this.goodsList.push(odata[i]);
                          }
                      }

                  }


              }else {
                this.showToast(data.message);
              }

          },
          err => {
              load && load.dismiss(); //关闭加载框
              console.error("ERROR", err);
          }
      );
  }

  updateCheck(item,type:string){
    if(item['isCheck']){
        this.checkIds.push(item.UNI_NO);
    }else{
        for (let i = 0; i < this.checkIds.length; i++) {
            if (this.checkIds[i] == item.UNI_NO) this.checkIds.splice(i,1);
        }
    }


    this.caculate();
  }
  updateCheck1(item,type:string){
     console.log('type',type)
      if(!this.checkType){
          this.checkType = type;
      }

      if(this.checkType != type){
          let alert = this.alertCtrl.create({
              subTitle: '商品和套餐只能2选1购买',
              buttons: ['我知道了']
          });
          alert.present();
          return false;
      }

      /**
       * 套餐选择
       * @type {number}
       */
      //套餐选一个
      if(type == 'package'){
          let packageNum = 0;
          for(let i in this.packageList){
              if(this.packageList[i]['isCheck']){
                  packageNum++;
              }
          }
          //去除本身选中
          if(item['isCheck']){
              packageNum--;
          }
          if(packageNum>=1){
              let alert = this.alertCtrl.create({
                  subTitle: '套餐只能选择一个',
                  buttons: ['我知道了']
              });
              alert.present();
          }else{
              if(item['isCheck']){
                  item['isCheck'] = false;
              }else{
                  item['isCheck'] = true;
              }
              /**
               * 选择后检测套餐是否还有选择项
               */
              this.settleTotal = {
                  number:0,
                  pv:0,
                  money:0
              };
              this.settleItem = [];
              let packageChecked = 0;
              for(let i in this.packageList){
                  if(this.packageList[i]['isCheck']){
                      packageChecked++;
                      this.settleTotal.number++;
                      this.settleTotal.pv += Number(this.packageList[i]['FP_PV']) * this.packageList[i]['QTY'];
                      this.settleTotal.money += Number(this.packageList[i]['FP_PRICE']) * this.packageList[i]['QTY'];
                      this.settleItem.push(this.packageList[i]);
                  }
              }
              /**
               * 若套餐无选择时，checkType为单品，此时可以点击单品
               */
              if(packageChecked == 0){
                  this.checkType = '';
              }
          }
      }
      /**
       *单品选择-可以多选
       */
      else {
          /**
           * 判断此时checkType是不是为单品
           */
          if(this.checkType == 'single'){
              if(item['isCheck']){
                  item['isCheck'] = false;
              }else{
                  item['isCheck'] = true;
              }
              /**
               * 选择后检测套餐是否还有选择项
               */
              this.settleTotal = {
                  number:0,
                  pv:0,
                  money:0
              };
              this.settleItem = [];
              let packageChecked = 0;
              for(let k in this.goodsList){
                  if(this.goodsList[k]['isCheck']){
                      packageChecked++;
                      this.settleTotal.number += Number(this.goodsList[k]['QTY']);
                      this.settleTotal.pv += Number(this.goodsList[k]['FP_PV']) * this.goodsList[k]['QTY'];
                      this.settleTotal.money += Number(this.goodsList[k]['FP_PRICE']) * this.goodsList[k]['QTY'];
                      this.settleItem.push(this.goodsList[k]);
                  }
              }
              /**
               * 若套餐无选择时，checkType为单品，此时可以点击单品
               */
              if(packageChecked == 0){
                  this.checkType = '';
              }
          }else {
              let alert = this.alertCtrl.create({
                  subTitle: '商品和套餐只能2选1购买',
                  buttons: ['我知道了']
              });
              alert.present();
          }

      }

  }
    /**
     * 监听input输入
     */
  inputCheck(item){

    setTimeout(()=>{
        item['QTY'] = Math.min(item['QTY'],999);
        item['QTY'] = Math.max(item['QTY'],1);
    });

    this.caculate();
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

  createLoading() {
      let loading = this.loadingCtrl.create({
          spinner: "ios"
      });
      loading.present();
      return loading;
  }

  // settle accounts
  settle(){
    console.log('settleTotal',this.settleTotal)
    if(!this.settleTotal.number){
        let alert = this.alertCtrl.create({
            subTitle: '请选择要结算的商品',
            buttons: ['我知道了']
        });
        alert.present();
    }

    else if(this.settleTotal.pv<800) {
        let alert = this.alertCtrl.create({
            subTitle: '首单结算pv需满800',
            buttons: ['我知道了']
        });
        alert.present();
    }

    else {
       // console.log(this.settleItem);
        this.navCtrl.push('confirmOrder',{
            goods:this.settleItem,
            total:this.settleTotal,
            orderType:{
                name:'首购单',
                value:10
            }
        });
    }
  }

  add(item){
    if(this.packageArray.length>=1){
        let alert = this.alertCtrl.create({
            subTitle: '套餐只能选择一个',
            buttons: ['我知道了']
        });
        alert.present();
        return false;
    }
      item['QTY'] = Math.min(++item['QTY'],999);
      this.caculate();
  }

  reduce(item){
      item['QTY'] = Math.max(--item['QTY'],1);
      this.caculate();
  }

  caculateTotal(){
      this.settleTotal = {
          number:0,
          pv:0,
          money:0
      };
      for(let k in this.goodsList){
          if(this.goodsList[k]['isCheck']){
              console.log(this.goodsList[k]);
              this.settleTotal.number += Number(this.goodsList[k]['QTY']);
              this.settleTotal.pv += Number(this.goodsList[k]['FP_PV']) * this.goodsList[k]['QTY'];
              this.settleTotal.money += Number(this.goodsList[k]['FP_PRICE']) * this.goodsList[k]['QTY'];
          }
      }
      for(let i in this.packageList){
          if(this.packageList[i]['isCheck']){
             // console.log(this.packageList[i]);
              this.settleTotal.number++;
              this.settleTotal.pv += Number(this.packageList[i]['FP_PV']) * this.packageList[i]['QTY'];
              this.settleTotal.money += Number(this.packageList[i]['FP_PRICE']) * this.packageList[i]['QTY'];
          }
      }
  }

    goBack(){
        this.navCtrl.pop();
    }
   /**
     * 计算总价格，总pv
     */
    caculate(){
        this.settleTotal = {
            number:0,
            pv:0,
            money:0
        };
        this.settleItem=[];
        for(var i=0;i<this.shopArray.length;i++){
            let item =this.shopArray[i];
            if(item['isCheck']){
                this.settleTotal.number += Number(this.shopArray[i]['QTY']);
                this.settleTotal.pv += Number(this.shopArray[i]['FP_PV']) * this.shopArray[i]['QTY'];
                this.settleTotal.money += Number(this.shopArray[i]['FP_PRICE']) * this.shopArray[i]['QTY'];
                this.settleItem.push(this.shopArray[i]);
            }
        }
        for(var i=0;i<this.packageArray.length;i++){
            let item =this.packageArray[i];
            if(item['isCheck']){
                this.settleTotal.number += Number(this.packageArray[i]['QTY']);
                this.settleTotal.pv += Number(this.packageArray[i]['FP_PV']) * this.packageArray[i]['QTY'];
                this.settleTotal.money += Number(this.packageArray[i]['FP_PRICE']) * this.packageArray[i]['QTY'];
                this.settleItem.push(this.packageArray[i]);
            }
        }

    }
      /*
      选择颜色
      @param checked  是否选中状态
             index 索引
    */
   updateCucumber(checked,index){
    this.colorCheck=checked;
    if(checked==true){
      this.typeGroup.color=this.colorGroup1[index].name;
      this.UNI_NO=this.colorGroup1[index].UNI_NO;
      if(this.sizeCheck==false){
        this.select_type='请选择 尺码'
      }else{

        this.select_type='已选：'+this.typeGroup.color+this.typeGroup.size
      }
    }else{
      if(this.sizeCheck==false){
        this.select_type='请选择 颜色 尺码'
      }else{
        this.select_type='请选择 颜色'
      }
    }

      for(var i=0;i<this.colorGroup1.length;i++){
        if(i!=index){
        this.colorGroup1[i].checked=false
      }
     }
    for(var i=0;i<this.sizeGroup1.length;i++){
        let item1=this.sizeGroup1[i];
        item1.disabled=true;
        for(var k=0;k<this.colorGroup1[index].children.length;k++){
            var item=this.colorGroup1[index].children[k];
            if(item.name==item1.name){
            item1.disabled=false;
            item1.UNI_NO=item.UNI_NO;
            }

        }
    }
    for(var i=0;i<this.sizeGroup1.length;i++){
        let item1=this.sizeGroup1[i];
        if(item1.disabled==true){
        item1.checked=false;
        }
        if(checked==false){
        item1.disabled=false
        }
    }
   }
 /*
  选择尺寸
  @param checked  是否选中状态
         index 索引
*/
sizeCucumber(checked,index){
  this.sizeCheck=checked;
    if(checked==true){
      this.typeGroup.size=this.sizeGroup1[index].name;
      this.UNI_NO=this.sizeGroup1[index].UNI_NO;
      if(this.colorCheck==false){
        this.select_type='请选择 颜色'
      }else{

        this.select_type='已选：'+this.typeGroup.color+this.typeGroup.size
      }
    }else{
      if(this.colorCheck==false){
        this.typeGroup.size=''
        this.select_type='请选择 颜色 尺码'
      }else{
        this.select_type='请选择 尺码'
      }
    }
  for(var i=0;i<this.sizeGroup1.length;i++){
    if(i!=index){
      this.sizeGroup1[i].checked=false
    }
  }
  for(var i=0;i<this.colorGroup1.length;i++){
    let item1=this.colorGroup1[i];
    item1.disabled=true;
    //console.log('this.sizeGroup1[index].children',this.sizeGroup1[index].children)
      for(var k=0;k<this.sizeGroup1[index].children.length;k++){
        var item=this.sizeGroup1[index].children[k];
        if(item.name==item1.name){
          item1.disabled=false;
          item1.UNI_NO=item.UNI_NO;
        }

      }
  }
  for(var i=0;i<this.colorGroup1.length;i++){
    let item1=this.colorGroup1[i];
    if(item1.disabled==true){
      item1.checked=false;
    }
    if(checked==false){
      item1.disabled=false
    }
  }
}
/*
  将商品加入购物清单
  @param item  选择的商品的信息
         index 索引
*/
addCart(item,index,type) {
    console.log('add',item)
    this.checkType=type;
    if(type=='single'&&this.packageArray.length>0){
            let alert = this.alertCtrl.create({
                subTitle: '商品和套餐只能2选1购买',
                buttons: ['我知道了']
            });
            alert.present();
            return false;
    }
    if(type=='package'&&this.shopArray.length>0){
        let alert = this.alertCtrl.create({
            subTitle: '商品和套餐只能2选1购买',
            buttons: ['我知道了']
        });
        alert.present();
        return false;
    }
    if(this.packageArray.length>=1){
        let alert = this.alertCtrl.create({
            subTitle: '套餐只能选择一个',
            buttons: ['我知道了']
        });
        alert.present();
        return false;
    }
  this.UNI_NO=item.UNI_NO

   this.cartImg=item.IMAGE_LINK!=null?this.imgUrl+item.IMAGE_LINK:''
   //this.select_type='请选择 颜色 尺码'
   this.PRODUCT_NAME=item.PRODUCT_NAME;
   this.FP_PRICE=item.FP_PRICE;
   this.item=item;
   if(item.SHOES_GROUP==undefined||item.SHOES_GROUP==null){
      this.confirm();
      return
   }
   let loading = this.createLoading();
   this.model=1;

   //尺码
   let data1={
     strAction:'getAppProductShoesInfo',
     shoesGroup:item.SHOES_GROUP
   }

   this.commonService.getSize(data1).subscribe(
     data=>{
       if (data.statusCode == 0) {
         let body = data.body;
         let result =this.result= body["data"] || [];

   //第一步 去重获取颜色和尺寸两个数组
       var colorarray=unique(result,'SHOES_COLOUR');
       var sizearray=unique(result,'SHOES_SIZE');
       //第二部 将每种颜色对应的尺寸加到children数组
       var colorArray=this.colorArray=getColorSize(result,colorarray,'SHOES_COLOUR','SHOES_SIZE')
       var sizeArray=this.sizeArray=getColorSize(result,sizearray,'SHOES_SIZE','SHOES_COLOUR')
     // console.log(sizeArray)
       this.colorGroup1=colorArray.map(v=>{
          return {
             name:v.SHOES_COLOUR,
             UNI_NO:v.UNI_NO,
             disabled:false,
             checked:false,
             children:v.children
          }
       })
       this.sizeGroup1=sizeArray.map(v=>{
         return {
            name:v.SHOES_SIZE,
            UNI_NO:v.UNI_NO,
            disabled:false,
            checked:false,
            children:v.children
         }
      })
     // console.log('colorGroup1',this.colorGroup1);
     // console.log('sizeGroup1',this.sizeGroup1);
     }
     },
     err => {

     }
   )
   loading && loading.dismiss(); //关闭加载框
 }
 confirm(){
     let check=false;
     this.checkIds=[];
    // console.log('listsArray',listsArray)

        //单品
        if(this.checkType=='single'){
            let goodsList={};
             goodsList=this.item;
             goodsList['SHOES_COLOUR']=this.typeGroup.color;
             goodsList['SHOES_SIZE']=this.typeGroup.size;
             goodsList['disabled']=false;
             goodsList['isCheck']=true;
             goodsList['UNI_NO']=this.UNI_NO;
             goodsList['QTY']=1;

            if(this.shopArray.length==0){
                this.shopArray.push(
                    goodsList
                )
            }
            else{
                for(var i=0;i<this.shopArray.length;i++){
                            let item=this.shopArray[i];

                            if(item['UNI_NO']===this.UNI_NO){
                                item.QTY++;
                                check=true;
                                console.log(item['UNI_NO'])
                               break;
                            }
                     }
                     if(check==false){
                        this.shopArray.push(this.goodsList)
                     }

                     console.log('this.shopArray',this.shopArray)
                 }
                 for(var i=0;i<this.shopArray.length;i++){
                     if(this.shopArray[i]['isCheck']==true){
                        this.checkIds.push(this.shopArray[i]['UNI_NO']);
                     }
                 }
        }
        //套餐
        else if(this.checkType="package"){
             let packageList={};
             packageList=this.item;
             packageList['SHOES_COLOUR']=this.typeGroup.color;
             packageList['SHOES_SIZE']=this.typeGroup.size;
             packageList['disabled']=false;
             packageList['isCheck']=true;
             packageList['UNI_NO']=this.UNI_NO;
             packageList['QTY']=1;

            if(this.packageArray.length==0){
                this.packageArray.push(
                    packageList
                )
            }
            else{
                for(var i=0;i<this.packageArray.length;i++){
                            let item=this.packageArray[i];

                            if(item['UNI_NO']===this.UNI_NO){
                                item.QTY++;
                                check=true;
                                console.log(item['UNI_NO'])
                               break;
                            }
                     }
                     if(check==false){
                        this.packageArray.push(this.packageList)
                     }

                     console.log('this.packageArray',this.packageArray)
                 }
                 for(var i=0;i<this.packageArray.length;i++){
                    if(this.packageArray[i]['isCheck']==true){
                       this.checkIds.push(this.packageArray[i]['UNI_NO']);
                    }
                }
        }
        console.log('this.packageArray',this.packageArray)
             this.caculate();
             this.closeModal();
             this.showToast('成功加入购物清单')
  }
  shopList(){
    this.lists=true;
  }
  closeModal(){
    this.model=0;
    this.lists=false;
    this.colorCheck=false;
    this.sizeCheck=false;
    this.colorGroup1=[];
    this.sizeGroup1=[];
  }
//   删除购物车单个商品
  delHandle(item,index){
    console.log(item);
    console.log(this.checkIds)
      if(item.type=='single'){
        this.shopArray.splice(index,1) ;
       if(this.checkIds.length>0){
           for(var i=0;i<this.checkIds.length;i++){
               let chekid=this.checkIds[i];
                if(chekid==item.UNI_NO){
                    this.checkIds.splice(i,1);
                }
           }
       }
      }
      else if(item.type=='package'){
        this.packageArray.splice(index,1) ;
       if(this.checkIds.length>0){
           for(var i=0;i<this.checkIds.length;i++){
               let chekid=this.checkIds[i];
                if(chekid==item.UNI_NO){
                    this.checkIds.splice(i,1);
                }
           }
       }
      }

      this.caculate();
  }
    goGoodsDetail(item) {

        if (item.PRODUCT_CATEGORY == 18) {
            this.navCtrl.push("goodsPackageDetail", {
                category: item.PRODUCT_CATEGORY,
                product: item,
                first:true
            });
        } else {
            this.navCtrl.push("goodsDetail", {
                category: item.PRODUCT_CATEGORY,
                productno: item.UNI_NO,
                first:true
            });
        }
    }


}
