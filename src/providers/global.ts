/**
 * 全局变量操作类
 */
import { Injectable } from "@angular/core";
import { CommonService } from "../providers/common.service";

@Injectable()
export class Global {
  private _token: string;
  private _companyId: string;
  private _tabIndex:string;

  public tabSelectIndex: number; // tab.selectindex
  // public companyId: any;//companyId
  public MAP_KEY = "cdad2aeb813eb1bba3d951c5682c757b"; //'e7e584248db4e872fea2816b615d454e';

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
  }

  get companyId(): string {
    return this._companyId;
  }

  set companyId(value: string) {
    this._companyId = value;
  }

}
