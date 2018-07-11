import { Injectable, ViewChild } from "@angular/core";
@Injectable()
export class base{
	  getColorSize (result,array,SHOES_COLOUR,SHOES_SIZE){
	      var colorArray=deepClone(array);
	      for(var i=0;i<colorArray.length;i++){
	        let item=colorArray[i];
	        item.children=[];
	        for(var j=0;j<result.length;j++){
	          let item1=result[j];
	          if(item1[SHOES_COLOUR]==item[SHOES_COLOUR]){
	            item.children.push({
	                name:item1[SHOES_SIZE],
	                UNI_NO:item1.UNI_NO
	            })
	           // item.children.sort(sortNumber)
	          }
	        }
	      }
	      colorArray.sort(sortNumber)
	      return colorArray;
	    }
}
export const getColorSize=function(result,array,SHOES_COLOUR,SHOES_SIZE){
    var colorArray=deepClone(array);
    for(var i=0;i<colorArray.length;i++){
      let item=colorArray[i];
      item.children=[];
      for(var j=0;j<result.length;j++){
        let item1=result[j];
        if(item1[SHOES_COLOUR]==item[SHOES_COLOUR]){
          item.children.push({
              name:item1[SHOES_SIZE],
              UNI_NO:item1.UNI_NO
          })
         // item.children.sort(sortNumber)
        }
      }
    }
    colorArray.sort(sortNumber)
    return colorArray;
  }
  export const sortNumber= function (a,b)
    {
    return a['SHOES_SIZE'] - b['SHOES_SIZE']
    }
  export const unique= function (arr,item){
    　　var res = [arr[0]];
    　　for(var i=1;i<arr.length;i++){
    　　　　var repeat = false;
    　　　　for(var j=0;j<res.length;j++){
    　　　　　　if(arr[i][item] == res[j][item]){
    　　　　　　　　repeat = true;
    　　　　　　　　break;
    　　　　　　}
    　　　　}
    　　　　if(!repeat){
    　　　　　　res.push(arr[i]);
    　　　　}
    　　}
    　　return res;
    }
    export const getType = function (obj){
      //tostring会返回对应不同的标签的构造函数
      var toString = Object.prototype.toString;
      var map = {
         '[object Boolean]'  : 'boolean', 
         '[object Number]'   : 'number', 
         '[object String]'   : 'string', 
         '[object Function]' : 'function', 
         '[object Array]'    : 'array', 
         '[object Date]'     : 'date', 
         '[object RegExp]'   : 'regExp', 
         '[object Undefined]': 'undefined',
         '[object Null]'     : 'null', 
         '[object Object]'   : 'object'
     };
     if(obj instanceof Element) {
          return 'element';
     }
     return map[toString.call(obj)];
  }
   export const deepClone= function (data){
      var type = getType(data);
      var obj;
      if(type === 'array'){
          obj = [];
      } else if(type === 'object'){
          obj = {};
      } else {
          //不再具有下一层次
          return data;
      }
      if(type === 'array'){
          for(var i = 0, len = data.length; i < len; i++){
              obj.push(deepClone(data[i]));
          }
      } else if(type === 'object'){
          for(var key in data){
              obj[key] = deepClone(data[key]);
          }
      }
      return obj;
  }