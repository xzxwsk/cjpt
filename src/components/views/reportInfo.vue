<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box">
                <el-row :gutter="20">
                    <el-col :span="7">
                        <el-select v-model="userType" @change="getData(1)" placeholder="请选择用户类型">
                            <el-option
                                    v-for="(item, index) in userTypeOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </div>
            <div class="search-btn">
                <el-input placeholder="请输入电话号码查询" v-model="input5" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="getData(1)">查询</el-button>
                </el-input>
            </div>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>财务信息</span>
            </div>
            <div class="card-con" ref="cardCon">
                <el-table
                        v-loading="loading"
                        :height="tableHeight"
                        :data="tableData"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            label="电话号码"
                            min-width="120">
                        <template slot-scope="scope">
                            <el-popover
                                    placement="right-start"
                                    title=""
                                    width="500"
                                    trigger="click">
                                <el-table
                                        v-loading="loading2"
                                        :data="tableData2"
                                        stripe
                                        style="width: 100%">
                                    <el-table-column
                                            prop="amount"
                                            label="变化金额">
                                    </el-table-column>
                                    <el-table-column
                                            prop="sourceLabel"
                                            label="变化来源">
                                    </el-table-column>
                                    <el-table-column
                                            prop="changeTimeLabel"
                                            label="变化时间">
                                    </el-table-column>
                                </el-table>
                                <span slot="reference" class="link" @click="setFinanceFlowByMobile(1, scope.row.mobile)">{{scope.row.mobile}}</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="userTypeLabel"
                            label="用户类型"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            prop="totalAmount"
                            label="总入帐金额"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            prop="realAmount"
                            label="当前余额"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            prop="otherAmount"
                            label="推荐人金额"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            prop="advanceAmount"
                            label="总提现金额"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            prop="createTimeLabel"
                            label="创建时间"
                            min-width="120">
                    </el-table-column>
                    <!--<el-table-column-->
                            <!--label="当前状态">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-switch-->
                                    <!--@change="changeState(scope.$index, scope.row)"-->
                                    <!--v-model="scope.row.status"-->
                                    <!--:active-value="activeValue"-->
                                    <!--active-color="#009e9e"-->
                                    <!--:inactive-value="inactiveValue"-->
                                    <!--inactive-color="#b7b7b7">-->
                            <!--</el-switch>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column v-if="!isAgent"
                            label="财务扣款">
                        <template slot-scope="scope">
                            <i class="fa fa-edit" @click="modify(scope.$index, scope.row)"></i>
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
                :title="popTitle"
                :visible.sync="dialogVisible"
                width="500px"
                top="0">
            <div>
                <el-form :model="reportForm" label-width="120px">
                    <el-form-item label="当前余额">
                        <el-input v-model="reportForm.realAmount" disabled=""></el-input>
                    </el-form-item>
                    <el-form-item label="修改余额">
                        <el-input v-model="reportForm.modifyRealAmount" placeholder="请输入扣款金额"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmBtn">确 定</el-button>
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
            loading2: false,
            input5: '',
            value1: '',
            userType: 2, // 默认为骑手
            userTypeOptions: [],
            currentPage4: 0,
            tableHeight: 0,
            tableData: [],
            tableData2: [],
            tableData3: [],
            pageSize: 10,
            total: 0,
            popTitle: '',
            dialogVisible: false,
            curRow: null,
            activeValue: 1,
            inactiveValue: 2,
            reportForm: {},
            isAgent: false
        }
    },
    created () {
        this.$nextTick(() => {
            let h = this.$refs.cardCon.offsetHeight
            this.tableHeight = h - 52

            if (JSON.parse(localStorage.userInfo).level === 1) {
                this.isAgent = true
                this.userTypeOptions = [
                    {
                        label: '骑手',
                        value: 2
                    },
                    {
                        label: '服务商',
                        value: 3
                    }
                ]
                // 服务商
                this.userType = 3
            } else {
                this.isAgent = false
                this.userTypeOptions = [
                    {
                        label: '用户',
                        value: 1
                    },
                    {
                        label: '骑手',
                        value: 2
                    },
                    {
                        label: '服务商',
                        value: 3
                    }
                ]
            }

            this.getData(1)
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
            this.currentPage4 = 1
            this.loading = true
            let prompt = {
                userType: this.userType,
                page: page
            }
            if (this.input5 !== '') {
                prompt.mobile = this.input5
            }
            $http({
                url: '/agent/searchFinanceCustomerByMobile',
                data: prompt
            }).then(res => {
                if (res.code === 400) {
                    let userTypeArr = ['用户', '骑手', '服务商']
                    this.tableData = res.data.list.map(function (item) {
                        item.createTimeLabel = dateFormat(item.createTime * 1000, 'yyyy-MM-dd')
                        item.userTypeLabel = userTypeArr[item.userType - 1]
                        return item
                    })
                } else {
                    console.log('未查询到财务信息')
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
        modify (index, row) {
            this.curRow = row
            this.reportForm = deepClone(row)
            this.reportForm.modifyRealAmount = ''
            this.popTitle = '代理商财务扣款'
            this.dialogVisible = true
        },
        confirmBtn () {
            if (Number(this.reportForm.modifyRealAmount) > Number(this.reportForm.realAmount)) {
                this.$message({
                    message: '扣款金额不能大于当前余额',
                    type: 'error',
                    duration: 1000
                })
                return
            }

            this.dialogVisible = false
            $http({
                url: '/editFinanceAmount',
                data: {
                    financeId: this.curRow.id,
                    amount: this.reportForm.modifyRealAmount
                }
            }).then(res => {
                if (res.code === 400) {
                    this.$message({
                        message: '操作成功',
                        type: 'success',
                        duration: 1000
                    })
                    this.getData(1)
                    // this.reModiTable()
                } else {
                    this.$message({
                        message: '操作失败',
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
        setFinanceFlowByMobile (page, mobile) {
            this.tableData2 = []
            let me = this
            $http({
                url: '/searchFinanceFlowByMobile',
                data: {
                    mobile,
                    userType: this.tableData[0].userType,
                    page: page
                }
            }).then(res => {
                if (res.code === 400) {
                    let sourceLabelArr = []
                    if (me.userType === 1) {
                        sourceLabelArr = ['推荐用户', '推荐骑手', '订单']
                    } else {
                        sourceLabelArr = ['订单', '非订单']
                    }
                    this.tableData2 = res.data.list.map(function (item) {
                        if (me.userType === 1) {
                            item.sourceLabel = sourceLabelArr[item.source - 1]
                        } else {
                            item.sourceLabel = sourceLabelArr[item.source]
                        }
                        item.changeTimeLabel = ''
                        if (item.changeTime !== null) {
                            item.changeTimeLabel = dateFormat(item.changeTime * 1000, 'yyyy-MM-dd')
                        }
                        return item
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        changeState (index, row) {
            this.curRow = index
            this.loading = true
            row.createTime = (new Date(row.createTime)).getTime() / 1000
            $http({
                url: '/agentEdit',
                data: row
            }).then(res => {
                if (res.code === 400) {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    })
                } else {
                    this.$message({
                        message: '修改状态失败',
                        type: 'error',
                        duration: 1000
                    })
                    this.reStatusTable(row)
                }
                this.tableData[index].createTime = dateFormat(this.tableData[index].createTime * 1000, 'yyyy-MM-dd')
                this.loading = false
            }).catch(err => {
                console.log(err)
                this.loading = false
                this.$message({
                    message: '修改状态失败',
                    type: 'error',
                    duration: 1000
                })
                this.tableData[index].createTime = dateFormat(this.tableData[index].createTime * 1000, 'yyyy-MM-dd')
                this.reStatusTable(row)
            })
        },
        reStatusTable (row) {
            this.tableData.map(function (item, index) {
                if (index === this.curRow) {
                    if (item.status === 1) {
                        item.status = 2
                    } else {
                        item.status = 1
                    }
                }
            }, this)
        },
        reModiTable () {
            this.tableData[0].realAmount = this.reportForm.modifyRealAmount
        },
        logout () {
            this.switchMenu('')
            $http({
                url: '/agent/memberExit'
            }).then(res => {
                if (res.data.code === 400) {
                    localStorage.authStatus = false
                    this.$router.push('/login')
                } else {
                    console.log(res.msg)
                }
            }).catch(err => {
                console.log(err)
            })
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
</style>
