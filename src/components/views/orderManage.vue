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
                    <el-col :span="8">
                        <el-input placeholder="请输入订单号码查询" v-model="input3" class="input-with-select"></el-input>
                    </el-col>
                    <el-col :span="8">
                        <el-input placeholder="请输入起点电话查询" v-model="input4" class="input-with-select"></el-input>
                    </el-col>
                </el-row>
            </div>
            <div class="search-btn">
                <el-input placeholder="请输入骑手电话号码" v-model="input5" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="getData(1)">查询</el-button>
                </el-input>
            </div>
        </div>
        <el-card class="box-card">
            <div class="card-con" ref="cardCon">
                <el-table
                        v-loading="loading"
                        :height="tableHeight"
                        :data="tableData"
                        :row-class-name="tableRowClassName"
                        stripe>
                    <el-table-column
                            prop="ordersn"
                            label="订单编号"
                            min-width="180">
                    </el-table-column>
                    <el-table-column
                            prop="startPhone"
                            label="用户电话号码"
                            min-width="120">
                    </el-table-column>
                    <el-table-column
                            prop="endPhone"
                            label="收货人电话"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="deliverName"
                            label="接单骑手姓名"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="deliverMobile"
                            label="骑手电话"
                            width="120">
                    </el-table-column>
                    <el-table-column
                            prop="payTypeLabel"
                            label="支付类型">
                    </el-table-column>
                    <el-table-column
                            prop="orderTypeLabel"
                            label="订单类型">
                    </el-table-column>
                    <el-table-column
                            prop="dispatchPriceShow"
                            label="运费">
                    </el-table-column>
                    <el-table-column
                            prop="tipPriceShow"
                            label="小费">
                    </el-table-column>
                    <el-table-column
                            prop="transId"
                            label="第三方支付订单编号"
                            width="180">
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
                        label="发货地址"
                        min-width="250">
                        <template slot-scope="scope">
                            <span>{{scope.row.startAddress}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="收货地址"
                        min-width="250">
                        <template slot-scope="scope">
                            <span>{{scope.row.endAddress}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="订单内容"
                        width="250">
                        <template slot-scope="scope">
                            <el-popover
                                placement="bottom"
                                title=""
                                width="200"
                                trigger="hover"
                                :content="scope.row.goodsRemark">
                                <span class="order-prompt" slot="reference">{{scope.row.goodsRemark.substr(0, 15)}}</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="备注"
                        width="250">
                        <template slot-scope="scope">
                            <el-popover
                                placement="bottom"
                                title=""
                                width="200"
                                trigger="hover"
                                :content="scope.row.remark">
                                <span class="order-prompt" slot="reference">{{scope.row.remark.substr(0, 15)}}</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="当前状态">
                        <template slot-scope="scope">
                            <span>{{getState(scope.row.status)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            fixed="right"
                            label="取消订单"
                            width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.status === 9">已取消</span>
                            <i v-else class="fa fa-mail-reply" title="取消" @click="modify(scope.row)"></i>
                        </template>
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

        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="30%"
                top="0">
            <span>是否取消该订单</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="cancelOrder">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {deepClone, dateFormat, $http} from '../../assets/js/utils'

export default {
    name: 'top',
    data () {
        return {
            loading: true,
            input3: '',
            input4: '',
            input5: '',
            statusValue: 0,
            statusOptions: [{
                label: '已完成',
                value: 0
            }, {
                label: '待支付',
                value: 1
            }, {
                label: '已取消',
                value: 2
            }],
            // statusOptions: [{
            //     label: '余额支付',
            //     value: 1
            // }, {
            //     label: '在线支付',
            //     value: 2
            // }, {
            //     label: '货到付款',
            //     value: 3
            // }, {
            //     label: '后台付款',
            //     value: 1
            // }, {
            //     label: '微信支付',
            //     value: 21
            // }, {
            //     label: '支付宝支付',
            //     value: 22
            // }],
            // orderTypeOptions: [{
            //     label: '帮我买',
            //     value: 1
            // }, {
            //     label: '帮我取',
            //     value: 2
            // }, {
            //     label: '帮我送',
            //     value: 3
            // }],
            value1: '',
            currentPage4: 1,
            tableHeight: 0,
            tableData: [],
            pageSize: 10,
            total: 0,
            dialogVisible: false,
            curRow: null,
            countyCode: [],
            areaOptions: [],
            props: {
                label: 'name',
                value: 'code',
                children: 'children'
            },
            isAgent: false
        }
    },
    created () {
        this.$nextTick(() => {
            if (JSON.parse(localStorage.userInfo).level === 1) {
                this.isAgent = true
            } else {
                this.isAgent = false
            }
            let h = this.$refs.cardCon.offsetHeight
            this.tableHeight = h - 52
            this.getData(1)
            this.getArea(0)
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
            prompt.ordersn = this.input3
            prompt.startPhone = this.input4
            prompt.deliverMobile = this.input5
            prompt.page = page
            if (this.countyCode.length > 0) {
                prompt.county = this.countyCode[2]
            }
            $http({
                url: '/agent/searchOrder',
                data: prompt
            }).then(res => {
                if (res.code === 400) {
                    this.tableData = res.data.list.map(function (item) {
                        let payTypeLabel = ''
                        let orderTypeLabel = ''
                        if (item.payType) {
                            switch (item.payType.toString()) {
                            case '1':
                                payTypeLabel = '余额支付'
                                break
                            case '2':
                                payTypeLabel = '在线支付'
                                break
                            case '3':
                                payTypeLabel = '货到付款'
                                break
                            case '11':
                                payTypeLabel = '后台付款'
                                break
                            case '21':
                                payTypeLabel = '微信支付'
                                break
                            case '22':
                                payTypeLabel = '支付宝支付'
                                break
                            default:
                                payTypeLabel = ''
                            }
                        } else {
                            payTypeLabel = ''
                        }

                        if (item.orderType) {
                            switch (item.orderType.toString()) {
                            case '1':
                                orderTypeLabel = '帮我买'
                                break
                            case '2':
                                orderTypeLabel = '帮我取'
                                break
                            case '3':
                                orderTypeLabel = '帮我送'
                                break
                            default:
                                orderTypeLabel = ''
                            }
                        } else {
                            orderTypeLabel = ''
                        }
                        item.payTypeLabel = payTypeLabel
                        item.orderTypeLabel = orderTypeLabel
                        item.dispatchPriceShow = item.dispatchPrice.toFixed(2)
                        item.tipPriceShow = item.tipPrice.toFixed(2)

                        return item
                    })
                    this.total = res.data.total
                } else {
                    console.log('未查询到相关订单')
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
        modify (row) {
            this.curRow = row
            this.dialogVisible = true
        },
        cancelOrder () {
            this.dialogVisible = false
            $http({
                url: '/agent/editOrder',
                data: {
                    id: this.curRow.id
                }
            }).then(res => {
                if (res.code === 400) {
                    this.tableData = this.tableData.filter(function (item) {
                        return item.id !== this.curRow.id
                    }, this)
                    this.total -= 1
                    this.$message({
                        message: '订单取消成功',
                        type: 'success',
                        duration: 1000
                    })
                } else {
                    console.log('取消失败')
                    this.$message({
                        message: '订单取消失败',
                        type: 'error',
                        duration: 1000
                    })
                }
            }).catch(err => {
                console.log(err)
                this.$message({
                    message: '操作失败',
                    type: 'error',
                    duration: 1000
                })
            })
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
        date (date) {
            if (date) {
                return dateFormat(date * 1000, 'yyyy-MM-dd hh:mm:ss')
            } else {
                return ''
            }
        },
        // 已取消订单显示不同颜色
        tableRowClassName ({row, rowIndex}) {
            if (row.status === 9) {
                return 'warning-row'
            }
            return ''
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.search{
    .el-date-editor{
        width: 100%;
    }
}
.img{
    border-radius: 50%;
}
.fa-mail-reply{
    font-size: 22px; color: #048992; cursor: pointer;
}
.order-prompt{
    color: #048992; text-decoration: underline; cursor: pointer;
}
</style>
