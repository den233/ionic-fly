/**
 * 业务操作类
 */
import { Injectable, ViewChild } from "@angular/core";
import { HttpService } from "./http.service";
import { Storage } from "@ionic/storage";
import { Nav,App } from "ionic-angular";

@Injectable()
export class CommonService {
  @ViewChild(Nav) nav: Nav;

  constructor(
    public http: HttpService,
    public storage: Storage,
    public appCtrl:App
  ) {}

  // 登录失效判断
  private handleToken(result) {
      if(result.statusCode == 1010 || result.statusCode == 1009){
          setTimeout(()=>{
              localStorage.removeItem('tokenid');
              this.appCtrl.getRootNav().push('login');
          });
          // alert('登录认证失败，请重新登录');
          result.message += '，请重新登录';
          return false;
      }else {
          return result;
      }
  }

  // 登录
  login(data: any) {
    return this.http
      .postFormData("/app/login.html", data)
      .map(response => this.handleToken(response.json()));
  }

  //*********密码*********/
   // 密码
   loginPwd(data: any) {
    return this.http
      .postFormData("/app/pwd.html", data)
      .map(response => this.handleToken(response.json()));
  }

  // 订单
  order(data: any) {
    return this.http
      .postFormData("/app/order.html", data)
      .map(response => this.handleToken(response.json()));
  }

  // 获取地区
  area(data: any){
    return this.http
    .postFormData("/app/order.html", data)
    .map(response => this.handleToken(response.json()));
  }

  // 注册会员验证
  verifyMember(data: any){
    return this.http
    .postFormData("/app/register.html", data)
    .map(response => this.handleToken(response.json()));
  }

  // 电子钱包
  wallet(data: any){
    return this.http
    .postFormData("/app/bonus.html", data)
    .map(response => this.handleToken(response.json()));
  }
  // 注册公用
  register(data: any){
    return this.http
    .postFormData("/app/register.html", data)
    .map(response => this.handleToken(response.json()));
  }
  // 首页消息列表
  home(data: any){
    return this.http
    .postFormData("/app/index.html", data)
    .map(response => this.handleToken(response.json()));
  }

  // 会员相关
  modification(data: any){
    return this.http
    .postFormData("/app/modification.html", data)
    .map(response => this.handleToken(response.json()));
  }

  // 转账
  transfer(data: any){
    return this.http
    .postFormData("/app/transfer.html", data)
    .map(response => this.handleToken(response.json()));
  }

  // 转账
  getTransfer(data: any){
    return this.http
    .get("/app/transfer.html", data)
    .map(response => this.handleToken(response.json()));
  }

  //支付宝支付
  alipay(data: any){
    return this.http
        .postFormData("/app/alipay.html", data)
        .map(response => this.handleToken(response.json()));
    }
   //获取颜色
   getColor(data: any){
    return this.http
    .postFormData("/app/order.html", data)
    .map(response => this.handleToken(response.json()));
  }
  //获取尺码
  getSize(data: any){
    return this.http
    .postFormData("/app/order.html", data)
    .map(response => this.handleToken(response.json()));
  }
}
 
