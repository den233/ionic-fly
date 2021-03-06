
import {Output,EventEmitter,Component,Input}from '@angular/core';
import { CommonService } from "../../providers/common.service";
import { DEV } from "../../providers/config";
import {base,unique} from '../../providers/base';

import {
  App,
  NavController,
  ToastController,
  LoadingController,
  NavParams
} from "ionic-angular";
/**
 * Generated class for the ModalComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'modala',
  templateUrl: 'modala.html'
})
export class ModalComponenta {
 imgUrl=DEV.imgUrl;
   
  @Input() modals:any;
  @Output() onVoted = new EventEmitter<boolean>();
  @Output() onVoted1 = new EventEmitter<boolean>();
  constructor(
    public appCtrl: App,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public commonService: CommonService,
    public toastCtrl: ToastController,
		public modalCtrl:base
  ) {

  }
  ngOnInit() {
    this.modals.shopArray=[];
    this.modals.goodList={};
    this.modals.colorCheck=false;
    this.modals.sizeCheck=false;
    this.modals.colorGroup1=[];
    this.modals.sizeGroup1=[];
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
        duration: 1000,
        position: "bottom",
        cssClass: "text-center"
      });
      toast.present(toast);
    }
  getColor(type){
    if(this.modals.value.SHOES_GROUP==undefined||this.modals.value.SHOES_GROUP==null){
      this.confirm();
      return
    }
    this.modals.model=1;
    this.modals.cartImg=this.modals.value.IMAGE_LINK!=null?this.imgUrl+this.modals.value.IMAGE_LINK:''
    let data1={
      strAction:'getAppProductShoesInfo',
      shoesGroup:this.modals.value.SHOES_GROUP
    }
    let loading = this.createLoading();
    this.commonService.getSize(data1).subscribe(
      data=>{
        loading && loading.dismiss(); //关闭加载框
        if (data.statusCode == 0) {
          let body = data.body;
          let result =this.modals.result= body["data"] || [];

    //第一步 去重获取颜色和尺寸两个数组
        var colorarray=unique(result,'SHOES_COLOUR');
        var sizearray=unique(result,'SHOES_SIZE');
        //第二部 将每种颜色对应的尺寸加到children数组

        var colorArray=this.modals.colorArray=this.modalCtrl.getColorSize(result,colorarray,'SHOES_COLOUR','SHOES_SIZE')
        var sizeArray=this.modals.sizeArray=this.modalCtrl.getColorSize(result,sizearray,'SHOES_SIZE','SHOES_COLOUR')

       this.modals.colorGroup1=colorArray.map(v=>{
           return {
              name:v.SHOES_COLOUR,
              UNI_NO:v.UNI_NO,
              disabled:false,
              checked:false,
              children:v.children
           }
        })
        this.modals.sizeGroup1=sizeArray.map(v=>{
          return {
             name:v.SHOES_SIZE,
             UNI_NO:v.UNI_NO,
             disabled:false,
             checked:false,
             children:v.children
          }
       })
      }

      },
      err => {
        loading && loading.dismiss(); //关闭加载框
      }
    )

  }
  updateCucumber(checked,index){

    this.modals.colorCheck=checked;
    if(checked==true){
      this.modals.typeGroup.color=this.modals.colorGroup1[index].name;
      this.modals.UNI_NO=this.modals.colorGroup1[index].UNI_NO;
      if(this.modals.sizeCheck==false){
        this.modals.select_type='请选择 尺码'
      }else{

        this.modals.select_type='已选：'+this.modals.typeGroup.color+this.modals.typeGroup.size
      }
    }else{
      if(this.modals.sizeCheck==false){
        this.modals.select_type='请选择 颜色 尺码'
      }else{
        this.modals.select_type='请选择 颜色'
      }
    }

  for(var i=0;i<this.modals.colorGroup1.length;i++){
    if(i!=index){
      this.modals.colorGroup1[i].checked=false
    }
  }
  for(var i=0;i<this.modals.sizeGroup1.length;i++){
    let item1=this.modals.sizeGroup1[i];
    item1.disabled=true;
      for(var k=0;k<this.modals.colorGroup1[index].children.length;k++){
        var item=this.modals.colorGroup1[index].children[k];
        if(item.name==item1.name){
          item1.disabled=false;
          item1.UNI_NO=item.UNI_NO;
        }

      }
  }
  for(var i=0;i<this.modals.sizeGroup1.length;i++){
    let item1=this.modals.sizeGroup1[i];
    if(item1.disabled==true){
      item1.checked=false;
    }
    if(checked==false){
      item1.disabled=false
    }
  }

}
sizeCucumber(checked,index){
  this.modals.sizeCheck=checked;
    if(checked==true){
      this.modals.typeGroup.size=this.modals.sizeGroup1[index].name;
      this.modals.UNI_NO=this.modals.sizeGroup1[index].UNI_NO;
      if(this.modals.colorCheck==false){
        this.modals.select_type='请选择 颜色'
      }else{

        this.modals.select_type='已选：'+this.modals.typeGroup.color+this.modals.typeGroup.size
      }
    }else{
      if(this.modals.colorCheck==false){
        this.modals.typeGroup.size=''
        this.modals.select_type='请选择 颜色 尺码'
      }else{
        this.modals.select_type='请选择 尺码'
      }
    }
  for(var i=0;i<this.modals.sizeGroup1.length;i++){
    if(i!=index){
      this.modals.sizeGroup1[i].checked=false
    }
  }
  for(var i=0;i<this.modals.colorGroup1.length;i++){
    let item1=this.modals.colorGroup1[i];
    item1.disabled=true;
   // console.log(this.sizeGroup1[index].children)
      for(var k=0;k<this.modals.sizeGroup1[index].children.length;k++){
        var item=this.modals.sizeGroup1[index].children[k];
        console.log(item.name)
        if(item.name==item1.name){
          item1.disabled=false;
          item1.UNI_NO=item.UNI_NO;
        }

      }
  }
  for(var i=0;i<this.modals.colorGroup1.length;i++){
    let item1=this.modals.colorGroup1[i];
    if(item1.disabled==true){
      item1.checked=false;
    }
    if(checked==false){
      item1.disabled=false
    }
  }
}
  closeModal(){
    console.log(this.modals.model)
      this.modals.model=0
    // this.onVoted.emit(this.modals.model)
    if(this.modals.model==1){
      [].forEach.call(document.querySelectorAll(".tabbar"), function(i,v){　
          　i['style'].display='none';　　　
        });
    }else{

      [].forEach.call(document.querySelectorAll(".tabbar"), function(i,v){
          　i['style'].display='flex'　　　
        });
    }
  }
  confirm(){
    let checkIds=[];
    let check=false;
    let goodsList={};
    goodsList=this.modals.value;
    if(this.modals.colorGroup1.length>0){
          if(this.modals.colorCheck==false ){
            this.showToast("请选择商品颜色");
            return
          }
    }
    if(this.modals.sizeGroup1.length>0){
      if(this.modals.sizeCheck==false){
        this.showToast("请选择商品尺寸");
        return
      }
    }


    goodsList['disabled']=false;
     goodsList['isCheck']=true;
     goodsList['QTY']=1;


    if(this.modals.shopArray.length==0){
      this.modals.shopArray.push(
        goodsList
      )
    }  else{

      for(var i=0;i<this.modals.shopArray.length;i++){
                  let item=this.modals.shopArray[i];
                 console.log(item['UNI_NO'])
                  if(item['UNI_NO']===this.modals.UNI_NO){
                      item.QTY++;
                      check=true;

                     break;
                  }
           }
           if(check==false){

              this.modals.shopArray.push(goodsList)
           }
       }
       for(var i=0;i<this.modals.shopArray.length;i++){
          if(this.modals.shopArray[i]['isCheck']==true){
             checkIds.push(this.modals.shopArray[i]['UNI_NO']);
          }
      }
      this.modals.checkIds=checkIds;
      this.onVoted1.emit(this.modals)
      this.showToast("成功加入购物清单");

  }

}
