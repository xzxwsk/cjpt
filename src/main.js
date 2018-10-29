// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'

Vue.config.productionTip = false

Vue.use(ElementUI)

const axiosInstance = axios.create({
    baseURL: '/apis',
    transformRequest: [function (data) {
        let ret = ''
        for (let it in data) {
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
        }
        return ret
    }],
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})
Vue.prototype.imgPath = 'http://52.83.126.16:888'
Vue.prototype.$post = axiosInstance
Vue.prototype.axios = axios

router.beforeEach(function (to, from, next) {
    if (to.matched.length === 0) {
        next('/build')
    } else {
        if (to.matched.some(record => record.meta.auth)) {
            // console.log(localStorage, Object.prototype.toString.call(localStorage.authStatus))
            if (localStorage.authStatus && localStorage.authStatus !== 'false') {
                // if (to.name === 'serviceOfAgentMana') { // 服务管理
                //     let userInfo = JSON.parse(localStorage.userInfo)
                //     if (userInfo.level === 5) { // 管理员帐号 (服务商服务管理)
                //         store.commit('switchMenu', to.name)
                //         next()
                //     } else if (userInfo.level === 1) { // 服务商帐号 (骑手服务设置)
                //         next({path: '/serviceOfBicycleMana'})
                //     }
                // } else {
                //     if (to.name === 'serviceOfBicycleMana') { // 服务商帐号 (骑手服务设置) 菜单设为
                //         store.commit('switchMenu', 'serviceOfAgentMana')
                //     } else {
                //         store.commit('switchMenu', to.name)
                //     }
                //     next()
                // }
                store.commit('switchMenu', to.name)
                next()
            } else {
                store.commit('switchMenu', to.name)
                next({path: '/login'})
            }
        } else {
            next()
        }
    }
})

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    components: {App},
    template: '<App/>'
})
