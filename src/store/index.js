import Vue from 'vue'
import vuex from 'vuex'
import mutations from './mutations'

Vue.use(vuex)

const store = new vuex.Store({
    state: {
        menu: '',
        isAgent: false
    },
    mutations: mutations
})

export default store
