export const Common = {

    /**
     * 判断是否数组
     * @param obj
     * @returns {boolean}
     */
    isArray: (obj) => {
        return Object.prototype.toString.call(obj) === '[object Array]';
    },

    /**
     * 随机获取list下标
     * @param list
     * @returns {number}
     */
    getRandomId: (list) => {
        return Math.floor(Math.random() * list.length);
    },

    /**
     * 获取范围内随机数
     *  Min ≤ r ≤ Max
     * @param Min
     * @param Max
     * @returns {any}
     */
    randomNumBoth: (Min, Max) => {
        const numTransition = (num) => {
            if (/^[0-9]*$/.test(num)) {
                num = Number(num);
            }
            return num;
        };
        Min = numTransition(Min);
        Max = numTransition(Max);
        const Range = Max - Min;
        const Rand = Math.random();
        return Min + Math.round(Rand * Range);
    },

    /**
     * 获取窗口高度
     * @returns {any}
     */
    getWinHeight: () => {
        let winHeight;
        if (window.innerHeight) {
            winHeight = window.innerHeight;
        } else if ((document.body) && (document.body.clientHeight)) {
            winHeight = document.body.clientHeight;
        }
        // 通过深入 Document 内部对 body 进行检测，获取窗口大小
        if (document.documentElement && document.documentElement.clientHeight) {
            winHeight = document.documentElement.clientHeight;
        }
        return winHeight;
    },

    /**
     * 验证是否pc平台
     * @returns {boolean}
     */
    platform: () => {
        const userAgentInfo = navigator.userAgent;
        const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
        return !Agents.includes(userAgentInfo);
    },

    /**
     * 空对象验证
     * @param obj
     * @returns {boolean}
     */
    isEmptyObject: (obj) => {
        if (!obj) return true;
        let t;
        for (t in obj) return false;
        return true;
    },

    /**
     * 获取自定义id
     * @param count
     * @returns {string}
     */
    getCustomId: (count?: number) => {
        count = count || 6;
        let _id = '';
        for (let i = 0; i < count; i++) {
            _id += (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return _id;
    },

    /**
     * 去除左右空格
     */
    trim: (str) => {
        if (!str || typeof str !== 'string') return str;
        return str.replace(/^\s+|\s+$/g, '');
    }
};