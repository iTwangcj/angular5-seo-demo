import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-pages',
    template: `
        <app-header></app-header>
        <div id="container">
            <router-outlet></router-outlet>
        </div>
    `
})
export class PagesComponent implements OnInit {

    constructor () {
    }

    ngOnInit () {
    }

}
