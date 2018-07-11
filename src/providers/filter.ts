/**
 * 公共方法
 */
import { Injectable } from "@angular/core";

@Injectable()
export class Filter {
  static colors = [
    '66aacc',
    '00bbf0',
    '69758c',
    '7c73e6',
    'ff9659',
    'ff5c5c',
    '32c7bd',
    '5c73e5',
    '3dcc85',
    'b2856b'
  ];
  constructor() {}

  static isEmpty(value): boolean {
    return value == null || (typeof value === "string" && value.length === 0);
  }

  static isNotEmpty(value): boolean {
    return !this.isEmpty(value);
  }

  /**
   * 格式“是”or“否”
   */
  static formatYesOrNo(value: number | string): string {
    return value == 1 ? "是" : value == "0" ? "否" : null;
  }

  /**
   * 日期对象转为日期字符串
   * @param date 需要格式化的日期对象
   * @param sFormat 输出格式,默认为yyyy-MM-dd                         年：y，月：M，日：d，时：h，分：m，秒：s
   * @example  dateFormat(new Date())                                "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd')                   "2017-02-28"
   * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')         "2017-02-28 09:24:00"
   * @example  dateFormat(new Date(),'hh:mm')                       "09:24"
   * @example  dateFormat(new Date(),'yyyy-MM-ddThh:mm:ss+08:00')   "2017-02-28T09:24:00+08:00"
   * @returns {string}
   */
  static dateFormat(date: Date, sFormat: string = "yyyy-MM-dd"): string {
    let time = {
      Year: 0,
      TYear: "0",
      Month: 0,
      TMonth: "0",
      Day: 0,
      TDay: "0",
      Hour: 0,
      THour: "0",
      hour: 0,
      Thour: "0",
      Minute: 0,
      TMinute: "0",
      Second: 0,
      TSecond: "0",
      Millisecond: 0
    };
    time.Year = date.getFullYear();
    time.TYear = String(time.Year).substr(2);
    time.Month = date.getMonth() + 1;
    time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
    time.Day = date.getDate();
    time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
    time.Hour = date.getHours();
    time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
    time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
    time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
    time.Minute = date.getMinutes();
    time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
    time.Second = date.getSeconds();
    time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
    time.Millisecond = date.getMilliseconds();

    return sFormat
      .replace(/yyyy/gi, String(time.Year))
      .replace(/yyy/gi, String(time.Year))
      .replace(/yy/gi, time.TYear)
      .replace(/y/gi, time.TYear)
      .replace(/MM/g, time.TMonth)
      .replace(/M/g, String(time.Month))
      .replace(/dd/gi, time.TDay)
      .replace(/d/gi, String(time.Day))
      .replace(/HH/g, time.THour)
      .replace(/H/g, String(time.Hour))
      .replace(/hh/g, time.Thour)
      .replace(/h/g, String(time.hour))
      .replace(/mm/g, time.TMinute)
      .replace(/m/g, String(time.Minute))
      .replace(/ss/gi, time.TSecond)
      .replace(/s/gi, String(time.Second))
      .replace(/fff/gi, String(time.Millisecond));
  }

  /**
   * 每次调用sequence加1
   * @type {()=>number}
   */
  getSequence = (function() {
    let sequence = 100;
    return function() {
      return ++sequence;
    };
  })();

  // 获取随机颜色
  static getColor() {
    let n: number = 0,
      m: number = Filter.colors.length - 1,
      num: string = (Math.random() * (m - n) + n).toString();
    let random = parseInt(num, 10);
    return "#" + Filter.colors[random];
  }
  // 获取随机颜色
  static getColorByIndex(i) {
    return "#" + Filter.colors[i];
  }

  static formatFmt(fmt) {
    new Date(parseInt(fmt) * 1000).toLocaleString().replace(/:\d{1,2}$/, " ");
  }

  static now = new Date(); //当前日期
  static nowDayOfWeek = Filter.now.getDay(); //今天本周的第几天
  static nowDay = Filter.now.getDate(); //当前日
  static nowMonth = Filter.now.getMonth(); //当前月
  static nowYear = Filter.now.getFullYear(); //当前年

  //获得某月的天数
  static getMonthDays(myMonth) {
    let monthStartDate: any = new Date(Filter.nowYear, myMonth, 1);
    let monthEndDate: any = new Date(Filter.nowYear, myMonth + 1, 1);
    let days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
  }

  //获得本周的开始日期
  static getWeekStartDate() {
    let weekStartDate = new Date(
      Filter.nowYear,
      Filter.nowMonth,
      Filter.nowDay - Filter.nowDayOfWeek + 1
    );
    return Filter.formatDate(weekStartDate);
  }
  //获得本周的结束日期
  static getWeekEndDate() {
    let weekEndDate = new Date(
      Filter.nowYear,
      Filter.nowMonth,
      Filter.nowDay + (7 - Filter.nowDayOfWeek)
    );
    return Filter.formatDate(weekEndDate);
  }
  //获得指定周的开始日期（当前时间以前）
  static getLastWeekStartDate(num) {
    let day = Filter.nowDay - Filter.nowDayOfWeek - 7 * num + 1,
      month = Filter.nowMonth,
      year = Filter.nowYear,
      mon_days = 0;
    if (day < 0) {
      month--;
      mon_days = this.getMonthDays(month);
      day = mon_days + day;
    }
    if (month == 12) {
      year--;
    }
    let weekStartDate = new Date(year, month, day);
    return Filter.formatDate(weekStartDate);
  }
  //获得指定周的结束日期（当前时间以前）
  static getLastWeekEndDate(num) {
    let day = Filter.nowDay - Filter.nowDayOfWeek - 7 * (num - 1),
      month = Filter.nowMonth,
      year = Filter.nowYear,
      mon_days = 0;
    if (day < 0) {
      month--;
      mon_days = this.getMonthDays(month);
      day = mon_days + day;
    }
    if (month < 0) {
      month = 12;
      year--;
    }
    let weekEndDate = new Date(year, month, day);
    return Filter.formatDate(weekEndDate);
  }

  //获得指定周的开始日期（当前时间以后）
  static getNextWeekStartDate(num) {
    let day = Filter.nowDay - Filter.nowDayOfWeek + 7 * num + 1,
      month = Filter.nowMonth,
      year = Filter.nowYear,
      mon_days = this.getMonthDays(month);
    if (day > mon_days) {
      month++;
      day = day - mon_days;
    }
    if (month > 12) {
      month = 1;
      year++;
    }
    let weekStartDate = new Date(year, month, day);
    return Filter.formatDate(weekStartDate);
  }
  //获得指定周的结束日期（当前时间以后）
  static getNextWeekEndDate(num) {
    let day = Filter.nowDay - Filter.nowDayOfWeek + 7 * (num + 1),
      month = Filter.nowMonth,
      year = Filter.nowYear,
      mon_days = 0;
    if (day < 0) {
      month--;
      mon_days = this.getMonthDays(month);
      day = mon_days + day;
    }
    if (month == 12) {
      year--;
    }
    let weekEndDate = new Date(year, month, day);
    return Filter.formatDate(weekEndDate);
  }

  //格式化日期：yyyy-MM-dd
  static formatDate(date) {
    let myyear = date.getFullYear();
    let mymonth = date.getMonth() + 1;
    let myweekday = date.getDate();
    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    return myyear + "-" + mymonth + "-" + myweekday;
  }

  // 返回星期几
  static formatNumToWeek(num) {
    let result;
    switch (num) {
      case "1":
        result = "一";
        break;
      case "2":
        result = "二";
        break;
      case "3":
        result = "三";
        break;
      case "4":
        result = "四";
        break;
      case "5":
        result = "五";
        break;
      case "6":
        result = "六";
        break;
      case "7":
        result = "日";
        break;
    }

    return result;
  }

  static complementHistoryMonth = numMonth => {
    var complDate = [];
    var curDate = new Date();
    var y = curDate.getFullYear();
    var m = curDate.getMonth();
    for (var i = 0; i < numMonth; i++, m--) {
      if (m == 0) {
        //到1月后,后推一年
        y--;
        m = 12; //再从12月往后推
      }
      complDate[i] = y + "-" + (m.toString().length == 1 ? "0" + m : m);
    }
    return complDate;
  };

  static complementFutureMonth = numMonth => {
    var complDate = [];
    var curDate = new Date();
    var y = curDate.getFullYear();
    var m = curDate.getMonth() + 2;
    for (var i = numMonth; i >= 0; i--, m++) {
      if (m == 13) {
        //到12月后,前推一年
        y++;
        m = 1; //再从1月往前推
      }
      complDate[i] = y + "-" + (m.toString().length == 1 ? "0" + m : m);
    }

    return complDate;
  };

  static currentMonth = () => {
    var curDate = new Date();
    var y = curDate.getFullYear();
    var m = curDate.getMonth() + 1;
    //第一次装入当前月(格式yyyy-mm)
    let complDate = y + "-" + (m.toString().length == 1 ? "0" + m : m);
    return complDate;
  };

  static GetDateStr = AddDayCount => {
    let dd = new Date(),
      str = "";
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期

    /* 判断周几 */
    let week = dd.getDay();
    if (week == 0) {
      str = "周日";
    } else if (week == 1) {
      str = "周一";
    } else if (week == 2) {
      str = "周二";
    } else if (week == 3) {
      str = "周三";
    } else if (week == 4) {
      str = "周四";
    } else if (week == 5) {
      str = "周五";
    } else if (week == 6) {
      str = "周六";
    }

    var y = dd.getFullYear();
    var m =
      dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
    var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
    return y + "-" + m + "-" + d + "(" + str + ")";
  };

  static deepClone(obj) {
    let o;
    if (typeof obj !== "object" || !obj) {
      return obj;
    }
    if (obj instanceof Array) {
      o = [];
      for (var i = 0; i < obj.length; i++) {
        if (typeof obj[i] === "object" && !obj[i]) {
          o[i] = arguments.callee(obj[i]);
        } else {
          o[i] = obj[i];
        }
      }
    } else {
      o = {};
      for (var p in obj) {
        if (typeof obj[p] === "object" && !obj[p]) {
          o[p] = arguments.callee(obj[p]);
        } else {
          o[i] = obj[i];
        }
      }
    }
    return o;
  }

    /**
   * 获取时间区间
   * @param time 需要转换的时间区间天数
   * @example  今天   time = 1                            
   * @example  最近一周 time = 8
   * @example  最近一个月 time 31
   * @example  最近三个月 time 91
   * @returns  object
   */
  static getTimeBefor(time){
    var toDay = new Date();
    var startdate,year,month,date,hms,enddate;//enddate => 当前时间
    if(time <= 30){
      var sdate = new Date();
      sdate.setDate(sdate.getDate() - time);
      var month2 = (sdate.getMonth()+1).toString().length< 2 ? '0'+(sdate.getMonth()+1) : sdate.getMonth()+1;
      var date2 = (sdate.getDate())<10 ? '0'+(sdate.getDate()) : sdate.getDate();
      startdate = sdate.getFullYear().toString()  + month2.toString() + date2.toString();

    }else if(time == 90){
      var currDate = new Date();
      year = currDate.getFullYear();
      month = currDate.getMonth()+1;
      date = currDate.getDate();
      hms = currDate.getHours() + ':' + currDate.getMinutes() + ':' + (currDate.getSeconds() < 10 ? '0'+currDate.getSeconds() : currDate.getSeconds());
      switch(month)
      {
        case 1:
        case 2:
        case 3:
          month += 9;
          year--;
          break;
        default:
          month -= 3;
          break;
      }

      month = (month.length < 2) ? ('0' + month) : month;
      date = (date < 10) ? ('0' + date) : date;
      startdate = year.toString()  + month.toString() + date.toString();

    }
    var month1 = (toDay.getMonth()+1).toString().length< 2 ? '0'+(toDay.getMonth()+1) : toDay.getMonth()+1;
    var date1 = (toDay.getDate())<10 ? '0'+(toDay.getDate()) : toDay.getDate();
    enddate = (toDay.getFullYear()).toString() + month1.toString() + date1.toString();
  return {
    startdate:startdate,
    enddate:enddate,
  };
}
}
