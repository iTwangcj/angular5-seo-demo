import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
	selector: 'app-account',
	templateUrl: './account.component.html',
    styleUrls: ['./account.component.less']
})
export class AccountComponent implements OnInit {

	constructor (private location: Location) {}

	ngOnInit () {
	}

	goBack () {
		this.location.back();
	}
}