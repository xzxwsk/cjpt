<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-col :span="18">
                            <el-cascader
                                    v-model="countyCode"
                                    placeholder="请选择区域"
                                    :options="areaOptions"
                                    @active-item-change="handleItemChange"
                                    :props="props"
                            ></el-cascader>
                        </el-col>
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
                <span>系统管理</span>
            </div>
            <div class="card-con" ref="cardCon">
                <el-table
                        v-loading="loading"
                        :height="tableHeight"
                        :data="tableData"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="mobile"
                            label="电话号码"
                            min-width="120">
                    </el-table-column>
                    <el-table-column
                            prop="realname"
                            label="骑手姓名"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            prop="identityCardNo"
                            label="身份证号码"
                            min-width="180">
                    </el-table-column>
                    <el-table-column
                            prop="realAmountShow"
                            label="当前余额"
                            min-width="100">
                        <!--<template slot-scope="scope">-->
                            <!--<el-popover-->
                                    <!--placement="bottom"-->
                                    <!--title=""-->
                                    <!--width="250"-->
                                    <!--trigger="hover">-->
                                <!--<el-table-->
                                        <!--v-loading="loading"-->
                                        <!--:data="tableData2"-->
                                        <!--stripe-->
                                        <!--style="width: 500px">-->
                                    <!--<el-table-column-->
                                            <!--prop="mobile"-->
                                            <!--label="变化金额">-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column-->
                                            <!--prop="mobile"-->
                                            <!--label="变化来源">-->
                                    <!--</el-table-column>-->
                                    <!--<el-table-column-->
                                            <!--prop="mobile"-->
                                            <!--label="变化时间">-->
                                    <!--</el-table-column>-->
                                <!--</el-table>-->
                                <!--<span slot="reference">{{scope.row.realAmount}}</span>-->
                            <!--</el-popover>-->
                        <!--</template>-->
                    </el-table-column>
                    <el-table-column
                            prop="amountShow"
                            label="提现金额"
                            min-width="120">
                    </el-table-column>
                    <el-table-column
                            prop="advanceAmountShow"
                            label="已提现总额">
                    </el-table-column>
                    <el-table-column
                            prop="createTimeLabel"
                            label="创建时间"
                            min-width="120">
                    </el-table-column>
                    <el-table-column
                        prop="isApprovalLabel"
                        label="审核状态"
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                        min-width="160"
                        fixed="right"
                        label="同意提现">
                        <template slot-scope="scope">
                            <el-button type="success" size="small" :disabled="isEnable(scope.row)" @click="changeAccessState(scope.row, 2)">同意</el-button>
                            <el-button type="danger" size="small" :disabled="isEnable(scope.row)" @click="changeAccessState(scope.row, 3)">不同意</el-button>
                            <!--<el-switch-->
                                    <!--@change="changeAccessState(scope.$index, scope.row)"-->
                                    <!--v-model="scope.row.isApproval"-->
                                    <!--:active-value="activeValue"-->
                                    <!--active-color="#009e9e"-->
                                    <!--:inactive-value="inactiveValue"-->
                                    <!--inactive-color="#b7b7b7">-->
                            <!--</el-switch>-->
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
    </div>
</template>

<script>
import {deepClone, dateFormat, $http} from '../../assets/js/utils'

export default {
    name: 'top',
    data () {
        return {
            loading: true,
            input5: '',
            value1: '',
            currentPage4: 0,
            tableHeight: 0,
            tableData: [],
            tableData2: [],
            pageSize: 10,
            total: 0,
            popTitle: '',
            dialogVisible: false,
            curRow: null,
            countyCode: [],
            countyCode2: [],
            areaOptions: [],
            props: {
                label: 'name',
                value: 'code',
                children: 'children'
            },
            activeValue: 1,
            inactiveValue: 2,
            agentForm: {
                id: '',
                mobile: '',
                seatnumber: '',
                realname: '',
                identityCardNo: '',
                address: '',
                status: 1,
                userName: '',
                password: ''
            }
        }
    },
    created () {
        this.$nextTick(() => {
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
            prompt.mobile = this.input5
            prompt.page = page
            if (this.countyCode.length > 0) {
                prompt.county = this.countyCode[2]
            }
            $http({
                url: '/searchWithDraw',
                data: prompt
            }).then(res => {
                if (res.code === 400) {
                    this.tableData = res.data.list.map(function (item) {
                        item.createTimeLabel = dateFormat(item.createTime * 1000, 'yyyy-MM-dd')
                        item.realAmountShow = item.realAmount.toFixed(2)
                        item.amountShow = item.amount.toFixed(2)
                        item.advanceAmountShow = item.advanceAmount.toFixed(2)
                        item.isApprovalLabel = this.getState(item.isApproval)
                        return item
                    }, this)
                    this.total = res.data.total
                } else {
                    console.log('未查询到相关骑手提现申请')
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
        changeAccessState (row, isApproval) { // 同意提现
            // this.curRow = index
            this.loading = true
            $http({
                url: '/withDrawApproval',
                data: {
                    id: row.id,
                    isApproval: isApproval
                }
            }).then(res => {
                console.log(res)
                if (res.code === 400) {
                    this.$message({
                        message: '审核成功',
                        type: 'success',
                        duration: 1000
                    })
                    this.getData(1)
                } else {
                    this.$message({
                        message: '操作失败',
                        type: 'error',
                        duration: 1000
                    })
                    // this.reStatusTable(row)
                }
                this.loading = false
            }).catch(err => {
                console.log(err)
                this.loading = false
                this.$message({
                    message: '操作失败',
                    type: 'error',
                    duration: 1000
                })
                // this.reStatusTable(row)
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
        reStatusTable (row) {
            console.log(JSON.stringify(row), this.curRow)
            this.tableData.map(function (item, index) {
                if (index === this.curRow) {
                    if (item.isApproval === 1) {
                        item.isApproval = 2
                    } else {
                        item.status = 1
                    }
                }
            }, this)
        },
        reModiTable () {
            if (this.agentForm.createTime && this.agentForm.createTime !== '') {
                this.agentForm.createTime = dateFormat(this.agentForm.createTime * 1000, 'yyyy-MM-dd')
            } else {
                this.agentForm.createTime = dateFormat(new Date(), 'yyyy-MM-dd')
            }
            if (this.curRow) { // 修改代理商信息
                this.tableData = this.tableData.map(function (item, index) {
                    if (index === this.curRow) {
                        return this.agentForm
                    } else {
                        return item
                    }
                }, this)
            } else {
                this.tableData.push(this.agentForm)
            }
        },
        getState (state) {
            let result = ''
            switch (state) {
            case 1:
                result = '需要审核'
                break
            case 2:
                result = '审核通过'
                break
            case 3:
                result = '审核不通过'
                break
            case 4:
                result = '提现失败'
                break
            default:
            }
            return result
        },
        isEnable (row) {
            return row.isApproval !== 1
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
