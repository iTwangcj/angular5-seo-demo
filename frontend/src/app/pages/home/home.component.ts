import { Component, OnInit } from '@angular/core';

// declare const particlesJS: any; // 引入描述组件(未定义不能使用)
@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

	constructor () { }

	ngOnInit () {
        // particlesJS.load('particles2', './assets/particles.json');
	}

}