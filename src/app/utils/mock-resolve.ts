import { Common } from './common';

declare const Mock: any;

export const MockResolve = {
    /**
     * 解析Mock规则为对象
     * @param jsonObj
     * @returns {any}
     */
    parseToJson: (jsonObj) => {
        try {
            if (typeof jsonObj === 'string') {
                jsonObj = JSON.parse(jsonObj);
            }
            const isHybridArray = (list: any) => {
                const type = typeof list[0];
                for (const item of list) {
                    if (typeof item !== type) {
                        return true;
                    }
                }
                return false;
            };
            const keys = Object.keys(jsonObj);
            for (const key of keys) {
                if (key) {
                    // 处理含有次数的key
                    if (key.includes('|')) {
                        const sourceValue = jsonObj[key]; // 源value
                        delete jsonObj[key];
                        const tmpList = key.split('|');
                        const newKey = tmpList[0];
                        const newVal = tmpList[1];
                        let num = 0;
                        if (newVal.includes('-')) {
                            const newValArr = newVal.split('-');
                            num = Common.randomNumBoth(newValArr[0], newValArr[1]);
                        } else {
                            num = parseInt(newVal || '0', 10);
                        }
                        if (Common.isArray(sourceValue)) {
                            jsonObj[newKey] = [];
                            if (isHybridArray(sourceValue)) {
                                for (let i = 0; i < num; i++) {
                                    jsonObj[newKey].push(Mock.mock(sourceValue[i]));
                                }
                            } else {
                                for (let i = 0; i < num; i++) {
                                    const index = Common.getRandomId(sourceValue);
                                    let value = sourceValue[index];
                                    value = Mock.mock(value);
                                    jsonObj[newKey].push(value);
                                }
                            }
                        } else if (typeof sourceValue === 'string') { // 值为字符串时
                            const tmpValueList = [];
                            for (let i = 0; i < num; i++) {
                                const value = Mock.mock(sourceValue);
                                tmpValueList.push(value);
                            }
                            jsonObj[newKey] = tmpValueList;
                        } else if (typeof sourceValue === 'boolean') { // 值为布尔时
                            const booleans = [sourceValue, !sourceValue];
                            const tmpBoolList = [];
                            for (let i = 0; i < num; i++) {
                                const index = Common.getRandomId(booleans);
                                tmpBoolList.push(booleans[index]);
                            }
                            jsonObj[newKey] = tmpBoolList;
                        } else if (typeof sourceValue === 'number') { // 值为数值时
                            const tmpBoolList = [];
                            for (let i = 0; i < num; i++) {
                                tmpBoolList.push(sourceValue);
                            }
                            jsonObj[newKey] = tmpBoolList;
                        } else {
                            jsonObj[newKey] = Mock.mock(sourceValue);
                        }
                    } else {
                        // 处理含有Mock规则的key
                        const oldValue = jsonObj[key]; // 源value
                        delete jsonObj[key];
                        const newKey = Mock.mock(key);
                        jsonObj[newKey] = oldValue;

                        // 处理含有Mock规则的value
                        const value = jsonObj[key];
                        if (value) {
                            jsonObj[key] = Mock.mock(value);
                        }
                    }
                }
            }
        } catch (e) {
            // error handle
        }
        return jsonObj;
    },

    /**
     * 解析Mock对象为规则
     * @returns {any}
     */
    parseToRule: () => {
        const parseJSON = {
            array: [],
            tempMap: {},
            rollup: (obj) => {
                const tempObj = {};
                const rules = {
                    zh_CN: /^[\u4e00-\u9fa5a-zZ-a|!\s,.，。！]*$/,
                    number: /^[0-9]*$/,
                    string: /^[a-zA-Z0-9|!\\\s,.，。！?？～~@#$¥%^…&*<>《》、()（）【】「」\[\]{}]*$/
                };
                const getRuleValue = (value) => {
                    if (rules.number.test(value) || typeof value === 'number') {
                        if (value.toString().length <= 10) {
                            value = '@integer(60, 100)';
                        } else if (value.toString().length > 10) {
                            value = '@integer(10000)';
                        }
                    } else if (typeof value === 'string' /*&& !/^@/.test(value)*/) { // 处理未转换过的值
                        if (rules.zh_CN.test(value)) {
                            if (value.length <= 10) {
                                value = '@ctitle';
                            } else if (value.length > 10) {
                                value = '@cparagraph(1, 3)';
                            }
                        } else if (/((((19|20)\d{2})-(0?(1|[3-9])|1[012])-(0?[1-9]|[12]\d|30))|(((19|20)\d{2})-(0?[13578]|1[02])-31)|(((19|20)\d{2})-0?2-(0?[1-9]|1\d|2[0-8]))|((((19|20)([13579][26]|[2468][048]|0[48]))|(2000))-0?2-29)).*$/.test(value)) { // 匹配yyyy-mm-dd日期格式
                            value = '@datetime';
                        } else {
                            if (/\/(.*?)\//.test(value)) { // url
                                value = '@url';
                            } else if (/^[a-zA-Z\s]/g.test(value) && value.length < 25) {
                                value = '@name';
                            } else if (rules.string.test(value)) {
                                value = '@string';
                            }
                        }
                    } else if (typeof value === 'boolean') {
                        value = '@boolean';
                    }
                    return value;
                };
                const iteration = (tempMap, data, index) => {
                    index++;
                    for (const key in data) {
                        if (data.hasOwnProperty(key)) {
                            if (Common.isArray(data[key])) {
                                let newKey = key;
                                let len = data[key].length;
                                if (key.includes('|')) {
                                    const tmpArr = key.split('|');
                                    len = parseInt(tmpArr[1] || '0', 10);
                                    newKey = tmpArr[0];
                                }
                                const tmpItem = data[key][0];
                                tempMap[`${newKey}|${len}`] = [];
                                if (typeof tmpItem === 'object') {
                                    for (const p in tmpItem) {
                                        if (tmpItem.hasOwnProperty(p)) {
                                            tmpItem[p] = getRuleValue(tmpItem[p]);
                                        }
                                    }
                                    tempMap[`${newKey}|${len}`] = [tmpItem];
                                } else {
                                    for (let i = 0; i < len; i++) {
                                        if (typeof data[key][i] === 'object') {
                                            const tmpObj = {};
                                            iteration(tmpObj, data[key][i], index);
                                            tempMap[`${newKey}|${len}`].push(tmpObj);
                                        } else {
                                            tempMap[`${newKey}|${len}`].push(getRuleValue(data[key][i]));
                                        }
                                    }
                                }
                            } else {
                                if (typeof data[key] === 'object' && data[key] !== null) {
                                    tempMap[key] = {};
                                    iteration(tempMap[key], data[key], index);
                                } else {
                                    tempMap[key] = getRuleValue(data[key]);
                                }
                            }
                        }
                    }
                };
                iteration(tempObj, obj, 0);
                return tempObj;
            },
            initData: (source) => {
                parseJSON.array = [];
                source = parseJSON.rollup(source);
                parseJSON.processData(source, 0, '0');
                return parseJSON.array;
            },
            processData: (data, index, fid) => {
                index++;
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const item = data[key];
                        const newObj = {
                            _id: Common.getCustomId(),
                            fid: fid,
                            index: index,
                            type: '',
                            key: key,
                            desc: '',
                            value: '',
                            rule: ''
                        };
                        newObj.type = typeof item;
                        if (newObj.type === 'object' && item !== null) {
                            if (Common.isArray(item)) {
                                newObj.type = 'array';
                                newObj.rule = parseJSON.tempMap[`${key}_${index}`];
                                newObj.key = `${key}|1`;
                            } else {
                                newObj.type = 'object';
                            }
                        } else {
                            newObj.value = item;
                        }
                        parseJSON.array.push(newObj);
                        if (typeof item === 'object') {
                            parseJSON.processData(item, index, newObj._id);
                        }
                    }
                }
            }
        };
        return {
            rollup: parseJSON.rollup,
            initData: parseJSON.initData
        };
    }
};