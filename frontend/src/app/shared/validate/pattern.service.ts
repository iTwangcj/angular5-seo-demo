import { Inject, Injectable } from '@angular/core';
import { CUSTOM_ERROR_MESSAGES } from './tokens';
import { ErrorMessage } from './message.models';
import { VALIDATE_MESSAGES } from './validate-messages';

@Injectable()
export class PatternService {
    constructor (@Inject(CUSTOM_ERROR_MESSAGES) public customErrorMessages: ErrorMessage[] = []) {
        let tmpArray = [];
        for (const defObj of VALIDATE_MESSAGES) {
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

        tmpArray = tmpArray.concat(customErrorMessages || []);
        const patternMap: any = {};
        for (const obj of tmpArray) {
            patternMap[obj.error] = obj.pattern;
        }
        return patternMap;
    }
}
