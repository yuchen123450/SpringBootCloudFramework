class Storage {
    constructor(props) {
        this.props = props || {};
        this.source = this.props.source || window.localStorage;
        this.initRun();
    }

    initRun() {
        const reg = new RegExp('__expires__');
        let data = this.source;
        let list = Object.keys(data);
        if (list.length > 0) {
            list.map((key, v) => {
                if (!reg.test(key)) {
                    let now = Date.now();
                    let expires = data[`${key}__expires__`] || Date.now + 1;
                    if (now >= expires) {
                        this.remove(key);
                    }
                }
                return key;
            });
        }
    }

    /*
     * set 存储方法
     * @ param {String}     key 键
     * @ param {String}     value 值，存储的值可能是数组/对象，不能直接存储，需要转换 JSON.stringify
     * @ param {String}     expired 过期时间，以分钟为单位
     */
    set(key, value, expired) {
        let source = this.source;
        if (typeof value !== 'string') {
            source[key] = JSON.stringify(value);
        } else {
            source[key] = value;
        }
        if (expired) {
            source[`${key}__expires__`] = Date.now() + 1000 * 60 * expired;
        }
    }

    /*
     * get 获取方法
     * @ param {String}     key 键
     */
    get(key) {
        const source = this.source,
            expired = source[`${key}__expires__`] || Date.now + 1;
        const now = Date.now();

        if (now >= Number(expired)) {
            this.remove(key);
            return;
        }
        const value = source[key]
            ? typeof source[key] === 'string'
                ? source[key]
                : JSON.parse(source[key])
            : source[key];
        return value;
    }

    /*
     * remove 获取方法
     * @ param {String}     key 键
     */
    remove(key) {
        const data = this.source,
            value = data[key];
        delete data[key];
        delete data[`${key}__expires__`];
        return value;
    }
}

export const storage = new Storage();
