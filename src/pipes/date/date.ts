import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'crmdate',
})
export class DatePipe implements PipeTransform {

  //过滤器  去除时间 年月日 单位名称
  transform(time:string,...args) {

  		let fmt = "yyyy-MM-dd hh:mm:ss";
  		let date = new Date(time);
	     var o = { 
	        "M+" : date.getMonth()+1,                
	        "d+" : date.getDate(),                   
	        "h+" : date.getHours(),                    
	        "m+" : date.getMinutes(),                
	        "s+" : date.getSeconds(),                
	        "q+" : Math.floor((date.getMonth()+3)/3),
	        "S"  : date.getMilliseconds()          
	    }; 
	    if(/(y+)/.test(fmt)) {
	            fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length)); 
	    }
	     for(var k in o) {
	        if(new RegExp("("+ k +")").test(fmt)){
	             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
	         }
	     }

	     return fmt; 

  }
}
