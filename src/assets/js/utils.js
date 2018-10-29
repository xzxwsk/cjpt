import axios from 'axios'
import router from '../../router'

const dateFormat = function (date, fmt) {
    if (fmt === null || fmt === undefined) {
        return
    }
    let _date = new Date(date)
    let o = {
        'M+': _date.getMonth() + 1, // 月份
        'd+': _date.getDate(), // 日
        'h+': _date.getHours(), // 小时
        'm+': _date.getMinutes(), // 分
        's+': _date.getSeconds(), // 秒
        'q+': Math.floor((_date.getMonth() + 3) / 3), // 季度
        'S': _date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + '').substr(4 - RegExp.$1.length))
    }
    for (let k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
        }
    }
    return fmt
}

const getUuid = function (len, radix) {
    let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
    let uuid = []
    let i
    radix = radix || chars.length
    if (len) {
        for (i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random() * radix]
        }
    } else {
        let r
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
        uuid[14] = '4'
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
            }
        }
    }
    return uuid.join('')
}

const getType = function (obj) {
    let map = {
        // eslint-disable-next-line
        '[object Boolean]'  : 'boolean', // eslint-disable-next-line
        '[object Number]'   : 'number', // eslint-disable-next-line
        '[object String]'   : 'string', // eslint-disable-next-line
        '[object Function]' : 'function', // eslint-disable-next-line
        '[object Array]'    : 'array', // eslint-disable-next-line
        '[object Date]'     : 'date', // eslint-disable-next-line
        '[object RegExp]'   : 'regExp', // eslint-disable-next-line
        '[object Undefined]': 'undefined', // eslint-disable-next-line
        '[object Null]'     : 'null', // eslint-disable-next-line
        '[object Object]'   : 'object'
    }
    if (obj instanceof Element) {
        return 'element'
    }
    return map[Object.prototype.toString.call(obj)]
}

const deepClone = function (data) {
    let type = getType(data)
    let obj = null
    if (type === 'array') {
        obj = []
    } else if (type === 'object') {
        obj = {}
    } else {
        // 不再具有下一层次
        return data
    }
    if (type === 'array') {
        for (let i = 0, len = data.length; i < len; i++) {
            obj.push(deepClone(data[i]))
        }
    } else if (type === 'object') {
        for (let key in data) {
            obj[key] = deepClone(data[key])
        }
    }
    return obj
}

const $http = function (prompt) {
    let userName = ''
    if (localStorage.userInfo && localStorage.userInfo !== 'null') {
        userName = (JSON.parse(localStorage.userInfo)).username
    }
    return new Promise((resolve, reject) => {
        axios({
            method: 'post',
            url: prompt.url,
            params: prompt.data, // 用于'transformRequest'
            baseURL: '/apis',
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'userName': userName
            }
        }).then(function (response) {
            if (response.data.code === 100) {
                localStorage.authStatus = false
                router.push('/login')
                return
            }
            resolve(response.data)
        }).catch(err => {
            console.log('err：', err)
            console.log('err.response：', err.response)
            if (err.response === undefined) {
                router.push('/login')
            } else if (err.response.status === 500) {
                if (err.response.data.message.indexOf('No message available') !== -1) {
                    router.push('/login')
                } else {
                    reject(err)
                }
            } else {
                reject(err.response)
            }
        })
    })
}

const $http2 = function (prompt) {
    let userName = ''
    if (localStorage.userInfo && localStorage.userInfo !== 'null') {
        userName = (JSON.parse(localStorage.userInfo)).username
    }
    let config = {
        baseURL: '/apis',
        headers: {
            'userName': userName,
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }
    return new Promise((resolve, reject) => {
        axios.post(prompt.url, prompt.data, config).then(function (response) {
            if (response.data.code === 100) {
                localStorage.authStatus = false
                router.push('/login')
                return
            }
            resolve(response.data)
        }).catch(err => {
            console.log(err)
            console.log(err.response)
            if (err.response === undefined) {
                router.push('/login')
            } else if (err.response.status === 500) {
                if (err.response.data.message.indexOf('No message available') !== -1) {
                    router.push('/login')
                } else {
                    reject(err)
                }
            } else {
                reject(err.response)
            }
            // let errString = String(err)
            // let location = errString.indexOf('status code')
            // let errStatus = errString.substring(location)
            // if (errStatus.substring(12) === '500') {
            //     router.push('/login')
            // } else {
            //     reject(err)
            // }
        })
        /*
        axios({
            method: 'post',
            url: prompt.url,
            data: prompt.data, // 与$http区別
            baseURL: '/apis',
            headers: {
                'Content-Type': 'application/json;charset=UTF-8',
                'userName': userName
            }
        }).then(function (response) {
            if (response.data.code === 100) {
                localStorage.authStatus = false
                router.push('/login')
                return
            }
            resolve(response.data)
        }).catch(err => {
            reject(err)
        })
        */
    })
}

const $httpFileUpload = function (prompt) {
    let userName = ''
    if (localStorage.userInfo && localStorage.userInfo !== 'null') {
        userName = (JSON.parse(localStorage.userInfo)).username
    }
    let config = {
        baseURL: '/apis',
        headers: {
            'userName': userName,
            'Content-Type': 'multipart/form-data'
        }
    }
    return new Promise((resolve, reject) => {
        axios.post(prompt.url, prompt.data, config).then(function (response) {
            if (response.data.code === 100) {
                localStorage.authStatus = false
                router.push('/login')
                return
            }
            resolve(response.data)
        }).catch(err => {
            reject(err)
        })
    })
}

const gotoLogin = function () {
    router.push('/login')
}

export {
    dateFormat,
    deepClone,
    $http,
    $http2,
    $httpFileUpload,
    getUuid,
    gotoLogin
}
