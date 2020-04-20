import axios from 'axios'
const BASE_URL = 'http://localhost:3000';
// options是一个对象，里面必须要传api和data，api就是接口，data是一个对象，里面传的参数按照文档来即可，默认为GET
class Http {
    // 封装一个Http的异步请求
    constructor(options) {
        this.urlParam = ''
        // 拿到里面的每一个参数
        let res = this.getParam(options.data)
        let final = BASE_URL + options.api + '?' + res.substring(0, res.lastIndexOf('&'))
        return this.send(final)
    }
    // 得到里面的所有参数
    getParam(data) {
        for (let key in data) {
            this.urlParam += key + '=' + data[key] + '&'
        }
        return this.urlParam
    }
    async send(final) {
        try {
            let res = await axios.get(final)
            return res.data
        } catch (reason) {
            throw new Error('失败原因是：' + reason)
        }
    }
}

export default Http