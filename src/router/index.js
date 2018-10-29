import Vue from 'vue'
import Router from 'vue-router'
import main from '@/components/main'
import login from '@/components/views/login'
import reg from '@/components/views/regist'
// import modify from '@/components/views/modifyPsw'
import sysmana from '@/components/views/sysMana' // 系统管理 服务商列表
import index from '@/components/welcome'
import building from '@/components/building'
import userName from '@/components/views/userName'
import userManage from '@/components/views/userManage'
import orderManage from '@/components/views/orderManage'
import bicycleManage from '@/components/views/bicycleManage'
import sysRule from '@/components/views/sysRule'
import agentManage from '@/components/views/agentManage'
import reportInfo from '@/components/views/reportInfo' // 报表信息，查询用户财务
import financeManage from '@/components/views/financeManage' // 用户流水
import deliverTxsh from '@/components/views/deliverTxsh' // 骑手提现审核
import financeCount from '@/components/views/financeCount' // 财务统计
import bicycleOrderCount from '@/components/views/bicycleOrderCount' // 骑手订单统计
import operateMana from '@/components/views/operateMana' // 运营者管理
import authMana from '@/components/views/authMana' // 权限管理
import priceClassMana from '@/components/views/priceClassMana' // 价格类管理
import perClassMana from '@/components/views/perClassMana' // 分成类管理
import serviceClassMana from '@/components/views/serviceClassMana' // 分成类管理
import contentTipsMana from '@/components/views/contentTipsMana' // 内容提示管理
import contentLabelMana from '@/components/views/contentLabelMana' // 内容标签管理
import serviceOfAgentMana from '@/components/views/serviceOfAgentMana' // 服务商服务管理 (管理员帐号)
import serviceOfBicycleMana from '@/components/views/serviceOfBicycleMana' // 骑手服务管理 (超级管理员帐号)
import agentOfBicycleMana from '@/components/views/agentOfBicycleMana' // 骑手服务管理 (服务商帐号)
import priceMana from '@/components/views/priceMana' // 价格管理 (超级管理员帐号)
import agentOfPriceMana from '@/components/views/agentOfPriceMana' // 价格管理 (服务商帐号)

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/index',
            component: main,
            meta: { auth: true },
            children: [ // children针对 <router-view name="main"></router-view> 嵌套命名视图
                {
                    path: 'index',
                    name: 'index', // 欢迎页面welcome
                    components: {
                        main: index // main对应 <router-view name="main"></router-view>
                    }
                },
                {
                    path: 'build',
                    name: 'build', // 正在建设中...
                    components: {
                        main: building
                    }
                },
                {
                    path: 'userName',
                    name: 'userName', // 后台用户管理(暂没使用)
                    components: {
                        main: userName
                    }
                },
                {
                    path: 'userManage',
                    name: 'userManage', // 用户帐号管理
                    components: {
                        main: userManage
                    }
                },
                {
                    path: 'orderManage',
                    name: 'orderManage', // 订单管理
                    components: {
                        main: orderManage
                    }
                },
                {
                    path: 'bicycleManage',
                    name: 'bicycleManage', // 骑手管理
                    components: {
                        main: bicycleManage
                    }
                },
                {
                    path: '/bicycleOrderCount',
                    name: 'bicycleOrderCount', // 骑手订单统计
                    components: {
                        main: bicycleOrderCount
                    }
                },
                {
                    path: 'sysRule',
                    name: 'sysRule', // 系统规则管理
                    components: {
                        main: sysRule
                    }
                },
                {
                    path: 'agentManage',
                    name: 'agentManage', // 代理商管理
                    components: {
                        main: agentManage
                    }
                },
                {
                    path: 'modify',
                    name: 'sysmana', // 系统管理 服务商列表
                    components: {
                        main: sysmana // main对应 <router-view name="main"></router-view>
                    }
                },
                {
                    path: 'operateMana',
                    name: 'operateMana', // 运营者管理
                    components: {
                        main: operateMana
                    }
                },
                {
                    path: 'authMana',
                    name: 'authMana', // 权限管理
                    components: {
                        main: authMana
                    }
                },
                {
                    path: '/reportInfo',
                    name: 'reportInfo', // 报表信息，查询用户财务
                    components: {
                        main: reportInfo
                    }
                },
                {
                    path: '/financeManage',
                    name: 'financeManage', // 用户流水
                    components: {
                        main: financeManage
                    }
                },
                {
                    path: '/deliverTxsh',
                    name: 'deliverTxsh', // 骑手提现审核
                    components: {
                        main: deliverTxsh
                    }
                },
                {
                    path: '/financeCount',
                    name: 'financeCount', // 财务统计
                    components: {
                        main: financeCount
                    }
                },
                {
                    path: '/priceClassMana',
                    name: 'priceClassMana', // 价格类管理
                    components: {
                        main: priceClassMana
                    }
                },
                {
                    path: '/perClassMana',
                    name: 'perClassMana', // 分成类管理
                    components: {
                        main: perClassMana
                    }
                },
                {
                    path: '/serviceClassMana',
                    name: 'serviceClassMana', // 服务类管理
                    components: {
                        main: serviceClassMana
                    }
                },
                {
                    path: '/contentTipsMana',
                    name: 'contentTipsMana', // 内容提示管理
                    components: {
                        main: contentTipsMana
                    }
                },
                {
                    path: '/contentLabelMana',
                    name: 'contentLabelMana', // 内容标签管理
                    components: {
                        main: contentLabelMana
                    }
                },
                {
                    path: '/serviceOfAgentMana',
                    name: 'serviceOfAgentMana', // 服务商服务管理
                    components: {
                        main: serviceOfAgentMana
                    }
                },
                {
                    path: '/serviceOfBicycleMana',
                    name: 'serviceOfBicycleMana', // 骑手服务管理(超级管理员)
                    components: {
                        main: serviceOfBicycleMana
                    }
                },
                {
                    path: '/agentOfBicycleMana',
                    name: 'agentOfBicycleMana', // 骑手服务管理(服务商)
                    components: {
                        main: agentOfBicycleMana
                    }
                },
                {
                    path: '/priceMana',
                    name: 'priceMana', // 价格管理(超级管理员)
                    components: {
                        main: priceMana
                    }
                },
                {
                    path: '/agentOfPriceMana',
                    name: 'agentOfPriceMana', // 价格管理(服务商)
                    components: {
                        main: agentOfPriceMana
                    }
                }
            ]
        },
        {
            path: '/login',
            component: login,
            meta: { auth: false }
        },
        {
            path: '/reg',
            component: reg,
            meta: { auth: false }
        }
    ]
})
