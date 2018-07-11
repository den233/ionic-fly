
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
  selector: 'modal',
  templateUrl: 'modal.html'
})
export class ModalComponent {
 imgUrl=DEV.imgUrl;
  @Input() modals:any;
  @Output() onVoted = new EventEmitter<boolean>();
  
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
    console.log(this.modals)
    this.modals.shopArray=[];
    this.modals.goodList={};

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
      this.modals.PRODUCT_NO=this.modals.colorGroup1[index].PRODUCT_NO;
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
          item1.PRODUCT_NO=item.PRODUCT_NO;
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
    console.log(this.modals.result)
    
       for(var i=0;i<this.modals.result.length;i++){
         var item=this.modals.result[i];
              if(item.SHOES_SIZE==this.modals.typeGroup.size&&item.SHOES_COLOUR==this.modals.typeGroup.color){
                this.modals.PRODUCT_NO=item.PRODUCT_NO;
              }
       }
       let str = localStorage.getItem('principal');
       let inputs = {
        strAction: "postAppProductCar",
        productid: this.modals.PRODUCT_NO,
        ordertype:this.modals.ordertype,
        usercode:str,
        qty: '1'
      };
      
      this.commonService.order(inputs).subscribe(
          data => {
             
            this.closeModal();
          },
          err => {
           
            console.error("ERROR", err);
          }
        );
  }

}
