<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-cascader v-if="!isAgent"
                             v-model="countyCode"
                             placeholder="请选择区域"
                             :options="areaOptions"
                             @active-item-change="handleItemChange"
                             :props="props"
                        ></el-cascader>
                    </el-col>
                    <el-col :span="16">
                        <el-date-picker
                            v-model="searchDateTime"
                            type="datetimerange"
                            :picker-options="pickerOptions2"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                        </el-date-picker>
                    </el-col>
                </el-row>
            </div>
            <div class="search-btn">
                <el-input placeholder="请输入手机号查询" v-model="input5" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="getData(1)">查询</el-button>
                </el-input>
            </div>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>报表信息</span>
            </div>
            <div class="card-con" ref="cardCon">
                <el-table
                        v-loading="loading"
                        :height="tableHeight"
                        :data="tableData"
                        stripe
                        :row-key="getRowKeys"
                        :expand-row-keys="expands"
                        @expand-change="clickTr">
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <el-table
                                v-loading="loadings"
                                :data="expandsAll[props.row.deliverId]"
                                stripe
                                style="width: 100%">
                                <el-table-column
                                    prop="ordersn"
                                    label="订单编号"
                                    min-width="180">
                                </el-table-column>
                                <el-table-column
                                    prop="deliverMobile"
                                    label="骑手电话"
                                    min-width="120">
                                </el-table-column>
                                <el-table-column
                                    prop="startPhone"
                                    label="用户电话"
                                    min-width="120">
                                </el-table-column>
                                <el-table-column
                                    prop="endPhone"
                                    label="收货人电话"
                                    min-width="120">
                                </el-table-column>
                                <el-table-column
                                    label="支付类型"
                                    min-width="100">
                                    <template slot-scope="scope">
                                        <span>{{getPayStr(scope.row.payType)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="dispatchPrice"
                                    label="运费"
                                    min-width="100">
                                </el-table-column>
                                <el-table-column
                                    prop="tipPrice"
                                    label="小费"
                                    min-width="100">
                                </el-table-column>
                                <el-table-column
                                    prop="transId"
                                    label="第三方订单编号"
                                    min-width="280">
                                </el-table-column>
                                <el-table-column
                                    prop="goodsRemark"
                                    label="订单内容"
                                    min-width="140">
                                </el-table-column>
                                <el-table-column
                                    label="下单时间"
                                    min-width="160">
                                    <template slot-scope="scope">
                                        <span>{{date(scope.row.createTime)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="抢单时间"
                                    min-width="160">
                                    <template slot-scope="scope">
                                        <span>{{date(scope.row.orderTime)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="当前状态"
                                    min-width="100">
                                    <template slot-scope="scope">
                                        <span>{{getState(scope.row.status)}}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="deliverName"
                        label="骑手姓名"
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                        prop="mobile"
                        label="电话号码"
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                        prop="totalAmount"
                        label="接单总数"
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                        prop="completAmount"
                        label="完成订单总数"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="cancelAmount"
                        label="取消单数"
                        min-width="120">
                    </el-table-column>
                </el-table>
                <div class="pagination" v-if="total>0">
                    <el-pagination
                            :current-page="currentPage4"
                            :page-size="pageSize"
                            layout="total, prev, pager, next, jumper"
                            @current-change="getDataPage"
                            :total="total">
                    </el-pagination>
                </div>
            </div>
        </el-card>

    </div>
</template>

<script>
import {deepClone, dateFormat, $http, $http2} from '../../assets/js/utils'

export default {
    name: 'top',
    data () {
        return {
            loading: false,
            loadings: false,
            input5: '',
            value1: '',
            currentPage4: 1,
            tableHeight: 0,
            tableData: [],
            expands: [],
            expandsAll: {},
            pageSize: 10,
            total: 0,
            popTitle: '',
            dialogVisible: false,
            curRow: null,
            countyCode: [],
            areaOptions: [],
            props: {
                label: 'name',
                value: 'code',
                children: 'children'
            },
            searchDateTime: '',
            pickerOptions2: {
                shortcuts: [{
                    text: '今天',
                    onClick (picker) {
                        const day = dateFormat(new Date(), 'yyyy-MM-dd')
                        const start = new Date(day + ' 00:00:00')
                        const end = new Date(day + ' 23:59:59')
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一周',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近一个月',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        picker.$emit('pick', [start, end])
                    }
                }, {
                    text: '最近三个月',
                    onClick (picker) {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        picker.$emit('pick', [start, end])
                    }
                }]
            },
            isAgent: false
        }
    },
    created () {
        this.$nextTick(() => {
            let h = this.$refs.cardCon.offsetHeight
            this.tableHeight = h - 52
            this.getArea(0)
            this.getData(1)

            if (JSON.parse(localStorage.userInfo).level === 1) {
                this.isAgent = true
            } else {
                this.isAgent = false
            }
        })
    },
    mounted () {
        window.onresize = () => {
            return (() => {
                let h = document.body.clientHeight
                this.tableHeight = h - 85 - 80 - 58 - 40 - 55
            })()
        }
    },
    methods: {
        getData (page) {
            this.loading = true

            let prompt = {}
            if (this.countyCode.length > 0) {
                prompt.county = this.countyCode[2]
            }
            if (this.searchDateTime.length > 0) {
                prompt.startTime = parseInt((new Date(this.searchDateTime[0])).getTime() / 1000)
                prompt.endTime = parseInt((new Date(this.searchDateTime[1])).getTime() / 1000)
            }
            prompt.mobile = this.input5
            prompt.pageNum = page
            this.tableData = []

            $http2({
                url: '/agent/getDeliverOrderCount',
                data: prompt
            }).then(res => {
                if (res.code === 400) {
                    this.tableData = res.data.list.map(function (item, index) {
                        item.index = index
                        // 如数据出错无骑手id，随机生成id
                        if (!item.deliverId) {
                            item.deliverId = 10000 - index
                        }
                        return item
                    }, this)
                    this.total = res.data.total
                } else {
                    console.log('未查询到相关统计')
                    this.tableData = []
                    this.total = 0
                }
                this.loading = false
            }).catch(err => {
                console.log(err)
                this.tableData = []
                this.total = 0
                this.loading = false
            })
        },
        getDataPage (curPage) {
            this.getData(curPage)
        },
        getArea (ParentCode) {
            $http({
                url: '/agent/searchAreaByParentCode',
                data: {
                    ParentCode: ParentCode
                }
            }).then(res => {
                this.areaOptions = []
                this.areaOptions = res.data.list.map(function (item) {
                    let area = deepClone(item)
                    area.children = []
                    return area
                }, this)
            }).catch(err => {
                console.log(err)
                this.$message({
                    message: '获取区域失败',
                    type: 'error',
                    duration: 1000
                })
            })
        },
        handleItemChange (val) {
            let flag = false
            if (val.length === 1) {
                this.areaOptions.some(function (item) {
                    if (item.code === val[0]) {
                        if (item.children.length > 0) {
                            flag = true
                        }
                    }
                })
            } else if (val.length === 2) {
                this.areaOptions.some(function (item) {
                    if (item.code === val[0]) {
                        item.children.some(function (sub) {
                            if (sub.code === val[1]) {
                                if (sub.children.length > 0) {
                                    flag = true
                                }
                            }
                        })
                    }
                })
            } else if (val.length === 3) {
                flag = true
            }
            if (!flag) {
                $http({
                    url: '/agent/searchAreaByParentCode',
                    data: {
                        ParentCode: val[val.length - 1]
                    }
                }).then(res => {
                    let children = []
                    if (val.length < 2) {
                        children = res.data.list.map(function (item) {
                            let area = deepClone(item)
                            area.children = []
                            return area
                        }, this)
                    } else {
                        children = res.data.list
                    }

                    this.setArea(children, this.areaOptions, val)
                }).catch(err => {
                    console.log(err)
                    this.$message({
                        message: '获取区域失败',
                        type: 'error',
                        duration: 1000
                    })
                })
            }
        },
        setArea (children, options, codeArr) {
            options.some(function (item) {
                if (codeArr[0] === item.code) {
                    if (codeArr.length === 1) {
                        item.children = children
                    } else if (codeArr.length === 2) {
                        item.children.some(function (sub) {
                            if (sub.code === codeArr[1]) {
                                sub.children = children
                            }
                        })
                    }
                }
            })
        },
        getAreaName (v) {
            let areaName = ''
            this.areaOptions.some(function (item) {
                if (v[0] === item.code) {
                    item.children.some(function (sub) {
                        if (v[1] === sub.code) {
                            sub.children.some(function (third) {
                                if (v[2] === third.code) {
                                    areaName = third.name
                                }
                            })
                        }
                    })
                }
            })
            return areaName
        },
        getRowKeys (row) {
            return row.deliverId
        },
        // 获取行子数据
        clickTr (row, expandedRows) {
            let id = row.deliverId
            // let mobile = row.mobile
            if (this.expands[0] === id) {
                this.expands = []
            } else {
                this.expands = []
                this.expands.push(id)
            }
            if (!this.expandsAll[id]) {
                this.loadings = true
                let prompt = {
                    id: id
                }
                $http2({
                    url: '/agent/getDeliverOrderInfo',
                    data: prompt
                }).then(res => {
                    this.loadings = false
                    if (res.code === 400) {
                        if (res.data && res.data.list) {
                            this.expandsAll[id] = res.data.list
                            /*
                            this.expandsAll[id] = res.data.list.map(function (item) {
                                item.mobile = mobile
                                return item
                            })
                            */
                        } else {
                            this.expandsAll[id] = []
                        }
                    } else {
                        this.expandsAll[id] = []
                        console.log(res.msg)
                    }
                }).catch(err => {
                    console.log(err)
                })
            }
        },
        getState (state) {
            let result = ''
            switch (state) {
            case 0:
                result = '订单超时'
                break
            case 1:
                result = '待支付'
                break
            case 2:
                result = '待抢单'
                break
            case 3:
                result = '待取货'
                break
            case 4:
                result = '待收货'
                break
            case 5:
                result = '订单完成'
                break
            case 6:
                result = '订单完成'
                break
            case 7:
                result = '等待退款'
                break
            case 8:
                result = '退款完成'
                break
            case 9:
                result = '订单取消'
                break
            case 10:
                result = '已删除订单'
                break
            case -1:
                result = '订单已锁定'
                break
            case -2:
                result = '处理订单'
                break
            default:
            }
            return result
        },
        getPayStr (pay) {
            let payTypeLabel = ''
            switch (pay) {
            case 1:
                payTypeLabel = '余额支付'
                break
            case 2:
                payTypeLabel = '在线支付'
                break
            case 3:
                payTypeLabel = '货到付款'
                break
            case 11:
                payTypeLabel = '后台付款'
                break
            case 21:
                payTypeLabel = '微信支付'
                break
            case 22:
                payTypeLabel = '支付宝支付'
                break
            default:
            }
            return payTypeLabel
        },
        date (date) {
            if (date) {
                return dateFormat(date * 1000, 'yyyy-MM-dd hh:mm:ss')
            } else {
                return ''
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.search{
    display: flex; flex-direction: row; padding: 20px;
    .select-box {
        padding: 0 20px 0 0; width: 600px;
        .el-select{width: 100%;}
    }
    .search-btn{
        flex: 1;
    }
}
.img{
    border-radius: 50%;
}
.card-con{
    height: 100%;
}
.fa-edit{
    font-size: 22px; color: #048992; cursor: pointer;
}
.order-prompt{
    color: #048992; text-decoration: underline; cursor: pointer;
}
.demo-table-expand {
    font-size: 0;
}
.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}
.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}
</style>
