import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'DatePipe' })
export class DatePipe implements PipeTransform {

    hourTime: number = 3600000; // 一小时毫秒数
    dayTime: number = 86400000; // 一天毫秒数
    weekTime: number = 7 * this.dayTime; // 一周毫秒数
    monthTime: number = 31 * this.dayTime; // 一个月毫秒数(按每月31天计算)
    yearTime: number = 365 * this.dayTime; // 一年毫秒数(按每年365天计算)

    /**
     * 时间转换管道
     * @param time
     * @returns {any}
     */
    transform (time: any): any {
        if (time) {
            time = Number(time);
            const curTime = Date.now();
            const interval = curTime - time;
            const num = Math.floor(interval / this.dayTime);
            if (num < 1) { // 小于1天的处理
                return Math.ceil(interval / this.hourTime) + '小时前更新';
            } else { // 大于1天的处理
                if (num >= 1 && num < 7) {
                    return num + '天前更新';
                } else if (num >= 7 && num < 31) {
                    return Math.ceil(interval / this.weekTime) + '周前更新';
                } else if (num >= 31 && num < 365) {
                    return Math.ceil(interval / this.monthTime) + '个月前更新';
                } else {
                    return Math.ceil(interval / this.yearTime) + '年前更新';
                }
            }
        }
    }
}