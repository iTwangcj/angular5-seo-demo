import { Component, OnInit } from '@angular/core';
import { TestService } from './test/fe-test';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

    constructor (private test: TestService) {}

    ngOnInit (): void {

    }

    dialog () {
        const res = this.test.dialog();
        console.log('res == ', res);
    }

}
