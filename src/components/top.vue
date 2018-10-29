<template>
    <div class="top-box">
        <div class="top">
            <img :src="logo" class="logo" @click="returnIndex">
            <div class="right">
                <span><i class="fa fa-vcard"></i> {{userRole}}</span>
                <span class="hand" @click="modifyPsw"><i class="fa fa-edit"></i> 修改密码</span>
                <span class="hand" @click="logout"><i class="fa fa-power-off"></i> 退出系统</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { $http } from '../assets/js/utils'
export default {
    name: 'top',
    data () {
        return {
            logo: require('../assets/images/logo.png'),
            userRole: ''
        }
    },
    created () {
        this.$nextTick(() => {
            if (JSON.parse(localStorage.userInfo).level === 1) {
                this.userRole = '服务商'
            } else {
                this.userRole = '超级管理员'
            }
        })
    },
    methods: {
        ...mapMutations(['switchMenu']),
        returnIndex () {
            this.switchMenu('')
            this.$router.push({name: 'index'})
        },
        logout () {
            this.switchMenu('')
            $http({
                url: '/agent/memberExit'
            }).then(res => {
                // if (res.data.code === 400) {
                localStorage.authStatus = false
                localStorage.userInfo = null
                this.$router.push('/login')
                // } else {
                //     console.log(res.msg)
                // }
            }).catch(err => {
                console.log(err)
            })
        },
        modifyPsw () {
            this.switchMenu('')
            this.$router.push('/modify')
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.top-box{height: 85px;}
.top{display: flex; flex-direction: row; align-items: flex-end; padding: 20px 0; height: 45px; background: #009e9e;
    .logo{margin: 0 0 0 20px; height: 45px; cursor: pointer;}
    .right{flex: 1; margin-right: 20px; font-size: 20px; color: #fff; text-align: right;
        span{display: inline-block; margin-left: 20px;}
        .hand{cursor:pointer;}
        .fa-edit{color:#fff;}
    }
}
</style>
