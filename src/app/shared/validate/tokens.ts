import { InjectionToken } from '@angular/core';
import { ErrorMessage } from './message.models';

export const CUSTOM_ERROR_MESSAGES = new InjectionToken<ErrorMessage[]>('form-validation custom error messages');

export const PATTERNS = new InjectionToken<string>('PATTERNS');
