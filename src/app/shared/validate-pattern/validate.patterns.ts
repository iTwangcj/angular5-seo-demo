import { FormControl } from '@angular/forms';
import { ErrorMessage, isEmptyInputValue } from '../validate';

export const VALIDATE_PATTERN: ErrorMessage[] = [ // pattern
    {
        error: 'password',
        format: (label, error) => `无效的密码`,
        pattern: (control) => {
            if (isEmptyInputValue(control.value)) {
                return null; // don't validate empty values to allow optional controls
            }
            const password = /^(?!^[0-9]+$)(?!^[a-zA-Z]+$)(?!^[`~!@#|$%^&*()_+<>?:"{},.\\\/;'\[\]]+$).{6,16}$/;
            return password.test(control.value) ? null : { 'password': true };
        }
    },
    {
        error: 'email',
        format: (label, error) => `无效的邮件地址`,
        pattern: (control) => {
            if (isEmptyInputValue(control.value)) {
                return null;
            }
            const email = /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            return email.test(control.value) ? null : { 'email': true };
        }
    },
    {
        error: 'username',
        format: (label, error) => `无效的用户名`,
        pattern: (control) => {
            if (isEmptyInputValue(control.value)) {
                return null;
            }
            const username = /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/;
            return username.test(control.value) ? null : { 'username': true };
        }
    },
    {
        error: 'equalTo',
        format: (label, error) => `两次输入不一致`,
        pattern: (password) => {
            return (control: FormControl) => {
                if (isEmptyInputValue(control.value)) {
                    return null;
                }
                return control.value !== password.value ? { 'equalTo': true } : null;
            };
        }
    },
    {
        error: 'routeName',
        format: (label, error) => `无效的路由名字`,
        pattern: (control) => {
            if (isEmptyInputValue(control.value)) {
                return null;
            }
            const reg = /^\/.*$/;
            return reg.test(control.value) ? null : { 'routeName': true };
        }
    },
    {
        error: 'name',
        format: () => `无效的名称,由4～19位的中文或英文组成`,
        pattern: (control) => {
            if (isEmptyInputValue(control.value)) {
                return null;
            }
            const username = /^[a-zA-Z\u4e00-\u9fa50-9]{4,19}$/;
            return username.test(control.value) ? null : { 'name': true };
        }
    },
    {
        error: 'url',
        format: () => `必须由 / 开头，有效字符为字母、数字、下划线`,
        pattern: (control) => {
            if (isEmptyInputValue(control.value)) {
                return null;
            }
            const url = /^\/[a-zA-Z0-9=_?&*/]*$/;
            return url.test(control.value) ? null : { 'url': true };
        }
    }
];
