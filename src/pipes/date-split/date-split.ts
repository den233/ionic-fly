import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateSplit',
})
export class DateSplitPipe implements PipeTransform {

  //过滤器  去除时间 年月日 单位名称
  transform(time:string,...args) {
  		return time.split(' ')[0];
  }
}
