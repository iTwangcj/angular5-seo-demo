import { Injectable } from '@angular/core';

@Injectable()
export class TestService {

    constructor () {
    }

    dialog () {
        return {
            modalClass: 'modal-dialog',
            animate: 'top',
            position: 'center',
            width: 550,
            cancelText: false,
            confirmText: false
        };
    }

}

