/**
 * http请求帮助类
 */
import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams, RequestOptionsArgs } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';
import { Observable } from "rxjs";
import { Global } from "./global";
import { DEV } from './config';
import { Storage } from '@ionic/storage';

@Injectable()

export class HttpService {

  token: any;

  requestHeader = {
    'Content-Type': 'application/json;charset=utf-8'
  };

  postFormDataHeader = {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': 'application/json;charset=utf-8'
  };

  postFormImageHeader = {
    
  };

  constructor(
    public http: Http,
    public storage: Storage,
    public global: Global) {
  }
  fillHeader() {

    let self = this;

    let str = localStorage.getItem('tokenid');

    if (str != null && str != 'undefined' && str != '') {
      self.requestHeader['tokenid'] = str;
      self.postFormDataHeader['tokenid'] = str;
    }else{
        self.requestHeader['tokenid'] = null;
        self.postFormDataHeader['tokenid'] = null;
    }

  }

  fillImageHeader(){
    let self = this;

    let str = localStorage.getItem('tokenid');
    if (str != null && str != 'undefined' && str != '') {
      self.postFormImageHeader['tokenid'] = str;
    }

  }

  public get(url: string, paramMap?: any): Observable<Response> {
    this.fillHeader();
    return this.http.get(DEV.url + url, new RequestOptions({
      search: HttpService.buildURLSearchParams(paramMap),
      headers: new Headers(this.requestHeader)
    }));
  }

  // 默认Content-Type为application/json;
  public post(url: string, body: any = null, options?: RequestOptionsArgs): Observable<Response> {
      this.fillHeader();
      return this.http.post(DEV.url + url, body, this.getOptions(options));
  }

  public postFormData(url: string, paramMap?: any): Observable<Response> {
    this.fillHeader();
    let headers = new Headers(this.postFormDataHeader);
    return this.http.post(DEV.url + url, HttpService.buildURLSearchParams(paramMap).toString(), new RequestOptions({ headers: headers }));
  }

  public postImageData(url: string, body: any = null, options?: RequestOptionsArgs): Observable<Response> {
    this.fillImageHeader();
    return this.http.post(DEV.url + url, body, this.getImageOptions(options));
  }

  public put(url: string, body: any = null, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.put(DEV.url + url, body, this.getOptions(options));
  }

  public delete(url: string, paramMap?: any): Observable<Response> {
    this.fillHeader();
    return this.http.delete(DEV.url + url, new RequestOptions({
      search: HttpService.buildURLSearchParams(paramMap),
      headers: new Headers(this.requestHeader)
    }));
  }

  public patch(url: string, body: any = null, options?: RequestOptionsArgs): Observable<Response> {
    return this.http.patch(DEV.url + url, body, this.getOptions(options));
  }

  public head(url: string, paramMap?: any): Observable<Response> {
    this.fillHeader();
    return this.http.head(DEV.url + url, new RequestOptions({
      search: HttpService.buildURLSearchParams(paramMap),
      headers: new Headers(this.requestHeader)
    }));
  }

  public options(url: string, paramMap?: any): Observable<Response> {
    this.fillHeader();
    return this.http.options(DEV.url + url, new RequestOptions({
      search: HttpService.buildURLSearchParams(paramMap),
      headers: new Headers(this.requestHeader)
    }));
  }

  public static buildURLSearchParams(paramMap): URLSearchParams {
    let params = new URLSearchParams();
    if (!paramMap) {
      return params;
    }
    for (let key in paramMap) {
      let val = paramMap[key];
      params.set(key, val);
    }
    return params;
  }

  private getOptions(options): RequestOptionsArgs {
    this.fillHeader();
    if (!options) {
      options = new RequestOptions({
        headers: new Headers(this.requestHeader)
      });
      return options;
    }
  }

  private getImageOptions(options): RequestOptionsArgs {
    this.fillImageHeader();
    if (!options) {
      options = new RequestOptions({
        headers: new Headers(this.postFormImageHeader)
      });
      return options;
    }
  }
}