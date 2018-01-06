import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-verification-email-modified',
	templateUrl: './email-modified.component.html'
})
export class VerificationEmailModifiedComponent implements OnInit {

	modifiedText: string;
	check: string;
	confirm: string;
	msg: string;

	constructor () { }

	ngOnInit () {
	}

	validateNewEmail () {

	}

}