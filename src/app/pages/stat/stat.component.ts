import { Component, OnInit, Renderer2, ViewChild, ViewContainerRef } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Common } from '../../utils';

@Component({
    selector: 'app-stat',
    templateUrl: './stat.component.html',
    styleUrls: ['./stat.component.less']
})
export class StatComponent implements OnInit {
    chartProNumber: object;
    chartProActive: object;
    chartMap: Object;
    chartProActiveRanking: Object;
    chartUserActiveRanking: Object;

    @ViewChild('stat', { read: ViewContainerRef })
    stat: ViewContainerRef;

    constructor (private render: Renderer2) {

    }

    ngOnInit () {
        this.chartProNumber = new Chart({
            chart: {
                backgroundColor: 'transparent'
            },
            title: {
                text: null
            },
            xAxis: {
                categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                labels: {
                    style: { color: '#eee' }
                },
                lineColor: '#999',
                tickColor: '#999'
            },
            yAxis: {
                title: {
                    text: null
                },
                gridLineColor: 'rgba(255,255,255, 0.1)',
                labels: {
                    style: { color: '#eee' }
                },
                lineColor: '#999'
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                name: '活跃项目排行',
                data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }]
        });
        this.chartProActive = new Chart({
            chart: {
                type: 'column',
                backgroundColor: 'transparent'
            },
            title: {
                text: null
            },
            tooltip: {
                pointFormat: '人口总量: <b>{point.y:.1f} 百万</b>'
            },
            xAxis: {
                type: 'category',
                labels: {
                    style: {
                        color: '#eee'
                    }
                },
                lineColor: '#999',
                tickColor: '#999'
            },
            yAxis: {
                min: 0,
                title: {
                    text: null
                },
                gridLineColor: 'rgba(255,255,255, 0.1)',
                labels: {
                    style: { color: '#eee' }
                },
                lineColor: '#999'
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                name: '总人口',
                data: [
                    ['上海', 24.25],
                    ['卡拉奇', 23.50],
                    ['北京', 21.51],
                    ['德里', 16.78],
                    ['拉各斯', 16.06],
                    ['天津', 15.20],
                    ['伊斯坦布尔', 14.16],
                    ['东京', 13.51],
                    ['广州', 13.08],
                    ['孟买', 12.44],
                    ['莫斯科', 12.19],
                    ['圣保罗', 12.03],
                    ['深圳', 10.46],
                    ['雅加达', 10.07],
                    ['拉合尔', 10.05],
                    ['首尔', 9.99],
                    ['武汉', 9.78],
                    ['金沙萨', 9.73],
                    ['开罗', 9.27],
                    ['墨西哥', 8.87]
                ]
            }]
        });
        this.chartMap = new Chart({
            chart: {
                backgroundColor: 'transparent'
            },
            title: {
                text: null
            },
            tooltip: {
                dateTimeLabelFormats: {
                    millisecond: '%H:%M:%S.%L',
                    second: '%H:%M:%S',
                    minute: '%H:%M',
                    hour: '%H:%M',
                    day: '%Y-%m-%d',
                    week: '%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                }
            },
            xAxis: {
                type: 'datetime',
                labels: {
                    style: { color: '#eee' }
                },
                lineColor: '#999',
                tickColor: '#999'
            },
            yAxis: {
                title: {
                    text: null
                },
                gridLineColor: 'rgba(255,255,255, 0.1)',
                labels: {
                    enabled: false,
                    style: { color: '#eee' }
                },
                lineColor: '#999'
            },
            legend: {
                enabled: false
            },
            plotOptions: {
                area: {
                    fillColor: {
                        linearGradient: {
                            x1: 0,
                            y1: 0,
                            x2: 0,
                            y2: 1
                        },
                        stops: [
                            [0, 'rgba(73,185,251, 1)'],
                            [1, 'rgba(73,185,251, 0.3)']
                            // [0, Highcharts.getOptions().colors[0]],
                            // [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                        ]
                    },
                    marker: {
                        radius: 2
                    },
                    lineWidth: 1,
                    states: {
                        hover: {
                            lineWidth: 1
                        }
                    },
                    threshold: null
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                type: 'area',
                name: '活跃项目排行',
                data: [
                    [Date.UTC(2013, 5, 2), 0.7695],
                    [Date.UTC(2013, 5, 3), 0.7648],
                    [Date.UTC(2013, 5, 4), 0.7645],
                    [Date.UTC(2013, 5, 5), 0.7638],
                    [Date.UTC(2013, 5, 6), 0.7549],
                    [Date.UTC(2013, 5, 7), 0.7562],
                    [Date.UTC(2013, 5, 9), 0.7574],
                    [Date.UTC(2013, 5, 10), 0.7543],
                    [Date.UTC(2013, 5, 11), 0.7510],
                    [Date.UTC(2013, 5, 12), 0.7498],
                    [Date.UTC(2013, 5, 13), 0.7477],
                    [Date.UTC(2013, 5, 14), 0.7492],
                    [Date.UTC(2013, 5, 16), 0.7487],
                    [Date.UTC(2013, 10, 18), 0.7405]
                ]
            }]
        });
        this.chartProActiveRanking = new Chart({
            chart: {
                backgroundColor: 'transparent'
            },
            title: {
                text: null
            },
            xAxis: {
                categories: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
                labels: {
                    style: { color: '#eee' }
                },
                lineColor: '#999',
                tickColor: '#999'
            },
            yAxis: {
                title: {
                    text: null
                },
                gridLineColor: 'rgba(255,255,255, 0.1)',
                labels: {
                    style: { color: '#eee' }
                },
                lineColor: '#999'
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                name: '活跃项目排行',
                data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
            }]
        });
        this.chartUserActiveRanking = new Chart({
            chart: {
                type: 'column',
                backgroundColor: 'transparent'
            },
            title: {
                text: null
            },
            tooltip: {
                pointFormat: '人口总量: <b>{point.y:.1f} 百万</b>'
            },
            xAxis: {
                type: 'category',
                labels: {
                    style: {
                        color: '#eee'
                    }
                },
                lineColor: '#999',
                tickColor: '#999'
            },
            yAxis: {
                min: 0,
                title: {
                    text: null
                },
                gridLineColor: 'rgba(255,255,255, 0.1)',
                labels: {
                    style: { color: '#eee' }
                },
                lineColor: '#999'
            },
            legend: {
                enabled: false
            },
            credits: {
                enabled: false
            },
            series: [{
                name: '总人口',
                data: [
                    ['上海', 24.25],
                    ['卡拉奇', 23.50],
                    ['北京', 21.51],
                    ['德里', 16.78],
                    ['拉各斯', 16.06],
                    ['天津', 15.20],
                    ['伊斯坦布尔', 14.16],
                    ['东京', 13.51],
                    ['广州', 13.08],
                    ['孟买', 12.44],
                    ['莫斯科', 12.19],
                    ['圣保罗', 12.03],
                    ['深圳', 10.46],
                    ['雅加达', 10.07],
                    ['拉合尔', 10.05],
                    ['首尔', 9.99],
                    ['武汉', 9.78],
                    ['金沙萨', 9.73],
                    ['开罗', 9.27],
                    ['墨西哥', 8.87]
                ]
            }]
        });

        this.resizeScreen();
        window.onresize = () => {
            this.resizeScreen();
            setTimeout(() => {
                // ...
            }, 200);
        };
    }

    /**
     * 重置高度
     */
    resizeScreen () {
        if (!this.stat.element.nativeElement) return;
        const wHeight = Common.getWinHeight();
        if (wHeight > 700) {
            // this.render.setStyle(document.body, 'overflow', 'hidden');
            this.stat.element.nativeElement.style.height = wHeight - 56 + 'px';
        }
        // else {
        // this.render.setStyle(document.body, 'overflow', '');
        // this.stat.element.nativeElement.style.height = 700 + 'px';
        // }
    }

}
