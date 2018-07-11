import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ToastController,LoadingController } from 'ionic-angular';
import {
  Validators,
  FormBuilder,
  FormGroup,
  FormControl,
} from "@angular/forms";
import { convertEnumToColumn } from "ion-multi-picker";
import { CommonService } from '../../../providers/common.service';
import * as $ from "jquery";

/**
 * Generated class for the AddMemberPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage({
  name: "addMember1",
  segment: "addMember1",
  defaultHistory: []
})
@Component({
  selector: 'page-add-member',
  templateUrl: 'add-member.html',
})
export class AddMemberPage {
  poAreaVal;
  // 是否校验过会员
  isVerify:boolean = false;
  tabIndex;
  // area
  init = {
    area: "",
    poArea:''
  };
  cityColumns: any[];
  isSex = 1;//性别默认为男性

  typeList = [
    {
      id:'1',
      name:'身份证'
    },
    {
      id:'2',
      name:'护照'
    }
  ]

  sexList = [
    {
      id:"F",
      name:'女'
    },
    {
      id:"M",
      name:'男'
    }
  ]
  // memberInfo
  member = {
    recommendNo:'',
    linkNo:'',
    miUserName:'',
    mobiletele:'',
    sex:'',
    papertype:'1',
    papernumber:'',
    province:'',
    city:'',
    district:'',
    address:'',
    poFirstName:'',
    poMobiletele:'',
    poProvince:'',
    poCity:'',
    poDistrict:'',
    poAddress:'',
    areaStr:'',
  }
  isAgree = true;
  isRegister = false;
  // 协议model
  model:boolean = true;
  areaData = [];
  idTrue:boolean = true;
  pattern;

  // 安置人/推荐信息
  referrerInfo = {
    sellName:'',
    serveName:'',
    sellShow:false,
    serveShow:false
  }

  private addMemberForm: FormGroup;
  constructor(public navCtrl: NavController,
              public commonService: CommonService,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              ) {

      this.addMemberForm = this.formBuilder.group({
        recommendNo: ["", Validators.required],
        sex: ["", Validators.required],
        linkNo: ["", Validators.required],
        miUserName: ["", Validators.compose([
          Validators.required,
          Validators.pattern('^[A-Za-z\u4e00-\u9fa50-9]+$')
        ])],
        mobiletele: ["", Validators.compose([
        Validators.required,
        Validators.pattern('1[34578]\\d{9}')
      ])],
        papertype: ["", Validators.required],
        papernumber: ["", Validators.required],
        area: ["", Validators.required],
        address: ["", Validators.required],
        poFirstName: ["", Validators.compose([
          Validators.required,
          Validators.pattern('^[A-Za-z\u4e00-\u9fa50-9]+$')
        ])],
        poMobiletele: ["", Validators.compose([
          Validators.required,
          Validators.pattern('1[34578]\\d{9}')
        ])],
        poArea: ["", Validators.required],
        poAddress: ["", Validators.required],
        sellName:[""],
        serveName:[""],
      });

      // city columns
      let area = JSON.parse(localStorage.getItem("area"));
        this.cityColumns = area;
        console.log("area is", area);
      this.tabIndex = this.navParams.get('tabIndex') || 0;
  }

  ionViewDidLoad() {
  }

  // 证件校验
  idTyeCheck(){
    // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X 
    let reg = /[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]/;
    let reg2 = /[a-zA-Z]{5,17}/;
    if(this.member.papertype == '1'){
      console.log(1)
      this.pattern = reg;
    }else if(this.member.papertype == '2'){
      this.pattern = reg2;
      console.log(2)
    }
    
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

  // agree protocol
  toggleCheckIn(){
    if(this.isAgree){
      this.isRegister = !this.isRegister;
    }else{
      this.isRegister = !this.isRegister;
    }
  }

  // 获取省市区
  getProvice(provice,city,district) {
    this.areaData = [];
    // 省
    let regions = this.cityColumns[0].options;
    for (let i in regions) {
      if (regions[i].value == provice) {
        this.areaData.push(regions[i].value);
      }
    }
    // 市
    let shi = this.cityColumns[1].options;
    for (let j in shi) {
      if (shi[j].value == city) {
        this.areaData.push(shi[j].value);
      }
    }
    // 区
    let qu = this.cityColumns[2].options;
    for (let k in qu) {
      if (qu[k].value == district) {
        this.areaData.push(qu[k].value);
      }
    }
    // this.init.area = this.areaData.join(" ");
  }

  // 选择性别
  checkSex(str){
    if(str == 1){
      this.isSex = 1;
    }else{
      this.isSex = 2;
    }
  }

  // 销售人员/服务人员编码 校验是否存在
  registerMember(str,code){

    let self = this;

    if(str == ''){
      if(!self.member.recommendNo || !self.member.linkNo){
        self.showToast('请填写编码')
      }
      if(!this.pattern.test(this.member.papernumber)){
          this.showToast('请输入正确的证件号码');
          return false;
      }
    }else{
      if(!code){
        self.showToast('请填写编码')
        return;
      }
    }

    let member = {
      recommendNo:self.member.recommendNo,
      linkNo:self.member.linkNo,
      strAction:'getCheckMiMember',
      checktype:str
    }
    
    let load = self.createLoading();

    this.commonService.verifyMember(member).subscribe(
      data => {
        load && load.dismiss(); //关闭加载框

          if(data.statusCode == 0){

            if(str == ''){

              localStorage.setItem('memberInfo',JSON.stringify(self.member));
              this.navCtrl.push('firstOrder',self.member);
              console.log('member',self.member)
  
            }else {

              this.memberInfo(str,code);
              return;

            }
          }else{

            self.showToast(data.message)
            return;
          }
        
        
      },
      err => {
        load && load.dismiss(); //关闭加载框
        console.error("ERROR", err);
      }
    );
  }

    // 查询会员信息
    memberInfo(status,code){
      
       let data = {
         strAction:'getMemberInfo',
         usercode:code
       }
       this.commonService.modification(data).subscribe(
         data => {
           if (data.statusCode == 0) {
             let memberInfo = data.body;
             if(memberInfo){
               if(status == 'checkLinkNo'){
                  this.referrerInfo.serveName = memberInfo.MI_USER_NAME;
                  this.referrerInfo.serveShow = true;
                }else if(status == 'checkRecommendNo'){
                    this.referrerInfo.sellName = memberInfo.MI_USER_NAME;
                    this.referrerInfo.sellShow = true;
                }
             
             console.log('info',data)
            } else {
              this.showToast(data.message)
            }
          }
         },
         err => {
           console.error("ERROR", err);
         }
       );
     }

  // 复制会员信息
  copy(){
    let self = this;
    // 处理地区数据
    self.member.province = this.init.area.split(" ")[0];
    self.member.city = this.init.area.split(" ")[1];
    self.member.district = this.init.area.split(" ")[2];

    self.member.poFirstName = self.member.miUserName;
    self.member.poMobiletele = self.member.mobiletele;
    self.member.poProvince = self.member.province;
    self.member.poCity= self.member.city;
    self.member.poDistrict= self.member.district;
    self.member.poAddress = self.member.address;

    self.init.poArea = self.init.area;
    console.log(self.member)
  }
  
  


  goBack(){
    if(this.tabIndex){
      this.navCtrl.popToRoot();
    }else{
      this.navCtrl.pop();
    }
  }

// add member
  next(){
    let self = this;
    let name = self.member.miUserName.replace(/\s+/g,"")
    let areaStr = '';
    // 处理地区数据
    self.member.province = this.init.area.split(" ")[0];
    self.member.city = this.init.area.split(" ")[1];
    self.member.district = this.init.area.split(" ")[2];

    self.member.poProvince = this.init.poArea.split(" ")[0];
    self.member.poCity = this.init.poArea.split(" ")[1];
    self.member.poDistrict = this.init.poArea.split(" ")[2];
    areaStr = $('#poArea .multi-picker-text').text();
    self.member.areaStr =  areaStr + self.member.poAddress;
    self.registerMember('','');
    // localStorage.setItem('memberInfo',JSON.stringify(self.member));
    // this.navCtrl.push('firstOrder',self.member);
  }

  // begin register
  register(){
    this.model = !this.model;
  }

  // close model
  closeModel(){
    this.goBack();
  }



}
