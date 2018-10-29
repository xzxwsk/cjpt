<template>
    <div class="menu" :style="{height: height + 'px'}">
        <!--router 自带路由功能-->
        <el-menu router
                :default-active="menu"
                class="el-menu-vertical-demo"
                background-color="#545c64"
                text-color="#fff"
                active-text-color="#ffd04b">

            <el-submenu index="1">
                <template slot="title">
                    <i class="fa fa-user-circle-o"></i>
                    <span>系统管理</span>
                </template>
                <el-menu-item index="operateMana">
                    <i class="fa fa-bandcamp"></i>
                    <span>运营者管理</span>
                </el-menu-item>
                <el-menu-item index="authMana">
                    <i class="fa fa-id-badge"></i>
                    <span>权限管理</span>
                </el-menu-item>
                <el-menu-item index="priceClassMana">
                    <i class="fa fa-id-badge"></i>
                    <span>价格类管理</span>
                </el-menu-item>
                <el-menu-item index="perClassMana">
                    <i class="fa fa-id-badge"></i>
                    <span>分成类管理</span>
                </el-menu-item>
                <el-menu-item index="serviceClassMana">
                    <i class="fa fa-id-badge"></i>
                    <span>服务类管理</span>
                </el-menu-item>
                <el-menu-item index="contentTipsMana">
                    <i class="fa fa-id-badge"></i>
                    <span>内容提示管理</span>
                </el-menu-item>
                <el-menu-item index="contentLabelMana">
                    <i class="fa fa-id-badge"></i>
                    <span>内容标签管理</span>
                </el-menu-item>
                <el-menu-item index="serviceOfAgentMana">
                    <i class="fa fa-id-badge"></i>
                    <span>服务商服务管理</span>
                </el-menu-item>
                <el-menu-item index="serviceOfBicycleMana"> <!--超级管理员-->
                    <i class="fa fa-id-badge"></i>
                    <span>骑手服务管理(超级管理员)</span>
                </el-menu-item>
                <el-menu-item index="agentOfBicycleMana"> <!--服务商-->
                    <i class="fa fa-id-badge"></i>
                    <span>骑手服务管理(服务商)</span>
                </el-menu-item>
                <el-menu-item index="priceMana"> <!--超级管理员-->
                    <i class="fa fa-id-badge"></i>
                    <span>价格管理(超级管理员)</span>
                </el-menu-item>
                <el-menu-item index="agentOfPriceMana"> <!--服务商-->
                    <i class="fa fa-id-badge"></i>
                    <span>价格管理(服务商)</span>
                </el-menu-item>
            </el-submenu>

            <el-menu-item v-for="(item, index) in userMenu" :key="index" :index="firstLowerCase(item.component)">
                <i :class="item.iconCls"></i>
                <span>{{item.name}}</span>
            </el-menu-item>
            <!--<el-menu-item index="userName">-->
                <!--<i class="fa fa-vcard"></i>-->
                <!--<span>后台用户管理</span>-->
            <!--</el-menu-item> -->

            <!-- <el-menu-item index="userManage">
                <i class="fa fa-user"></i>
                <span>用户管理</span>
            </el-menu-item>
            <el-menu-item index="agentManage">
                <i class="fa fa-users"></i>
                <span>代理商管理</span>
            </el-menu-item>
            <el-menu-item index="bicycleManage">
                <i class="fa fa-bicycle"></i>
                <span>骑手管理</span>
            </el-menu-item>
            <el-menu-item index="bicycleOrderCount">
                <i class="fa fa-bar-chart"></i>
                <span>骑手订单统计</span>
            </el-menu-item>
            <el-menu-item index="modify">
                <i class="fa fa-cog"></i>
                <span>系统管理</span>
            </el-menu-item>
            <el-menu-item index="orderManage">
                <i class="fa fa-pencil-square-o"></i>
                <span>订单管理</span>
            </el-menu-item>
            <el-menu-item index="deliverTxsh">
                <i class="fa fa-cubes"></i>
                <span>骑手提现审核</span>
            </el-menu-item>
            <el-menu-item index="reportInfo"> --> <!--查询用户财务-->
            <!--    <i class="fa fa-bar-chart"></i>
                <span>用户财务</span>
            </el-menu-item>
            <el-menu-item index="financeCount">
                <i class="fa el-icon-date"></i>
                <span>财务统计</span>
            </el-menu-item>
            <el-menu-item index="sysRule">
                <i class="fa fa-exclamation-circle"></i>
                <span>系统规则</span>
            </el-menu-item> -->
        </el-menu>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { $http } from '../assets/js/utils'
export default {
    name: 'left-menu',
    data () {
        return {
            userMenu: [],
            isAgent: false,
            screenHeight: document.body.clientHeight
        }
    },
    computed: {
        ...mapState(['menu']),
        height () {
            let h = this.screenHeight - 85
            return h
        }
    },
    created () {
        this.$nextTick(() => {
            $http({
                url: '/system/agent/getUserMenus'
            }).then(res => {
                if (res.code === 400) {
                    this.userMenu = res.data
                }
            }).catch(err => {
                console.log(err)
                this.$router.push('/login')
            })
            if (JSON.parse(localStorage.userInfo).level === 1) {
                this.isAgent = true
            } else {
                this.isAgent = false
            }
            window.onresize = () => {
                return (() => {
                    this.screenHeight = document.body.clientHeight
                })()
            }
        })
    },
    mounted () {

    },
    methods: {
        firstLowerCase (str) {
            let result = str.replace(/^\S/, L => L.toLowerCase())
            return result
        }
    }
}
</script>
