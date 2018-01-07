import { Inject, Injectable } from '@angular/core';
import { ErrorMessage } from './message.models';
import { CUSTOM_ERROR_MESSAGES } from './tokens';
import { VALIDATE_MESSAGES } from './validate-messages';

@Injectable()
export class ErrorMessageService {

    private defaultErrors = VALIDATE_MESSAGES;

    constructor (@Inject(CUSTOM_ERROR_MESSAGES) public customErrorMessages: ErrorMessage[] = []) {}

    get errorMessages () {
        return this.mergeArray(this.customErrorMessages, this.defaultErrors);
    }

    mergeArray (customErrorMessages: ErrorMessage[] = [], defaultErrors: ErrorMessage[] = []) {
        const tmpArray = [];
        for (const defObj of defaultErrors) {
            let includeFlag = false;
            for (const customObj of customErrorMessages) {
                if (defObj.error === customObj.error) {
                    includeFlag = true;
                }
            }
            if (!includeFlag) {
                tmpArray.push(defObj);
            }
        }
        return tmpArray.concat(customErrorMessages || []);
    }
}
