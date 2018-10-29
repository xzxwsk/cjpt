<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box" :style="{width: !isAgent ? '' : '400px'}">
                <el-row :gutter="20">
                    <el-col :span="8" v-if="!isAgent">
                        <el-cascader
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
                <el-button slot="append" icon="el-icon-search" @click="search">查询</el-button>
            </div>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>财务统计</span>
            </div>
            <div class="card-con" ref="cardCon">
                <el-table
                        v-loading="loading"
                        :height="tableHeight"
                        :data="tableData"
                        stripe
                        style="width: 100%">
                    <el-table-column v-if="!isAgent"
                        prop="platformEarnings"
                        label="平台收益"
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                        prop="agentEarnings"
                        label="代理商收益"
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                        prop="deliverEarnings"
                        label="骑手收益"
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                        prop="totalOrderCount"
                        label="总单数"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="finishOrderCount"
                        label="完成单数"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop="abrogateOrderCount"
                        label="未完成订单数"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop="userCount"
                        label="下单用户数"
                        min-width="100">
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
            loading: false,
            input5: '',
            value1: '',
            currentPage4: 1,
            tableHeight: 0,
            tableData: [],
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
            prompt.page = page
            if (this.searchDateTime.length > 0) {
                prompt.startTime = parseInt((new Date(this.searchDateTime[0])).getTime() / 1000)
                prompt.endTime = parseInt((new Date(this.searchDateTime[1])).getTime() / 1000)
            }
            if (this.countyCode.length > 0) {
                prompt.county = this.countyCode[2]
            }
            this.tableData = []

            $http({
                url: '/agent/searchFinanceAccount',
                data: prompt
            }).then(res => {
                if (res.code === 400) {
                    this.tableData.push(res.data)
                } else {
                    console.log('未查询到相关统计')
                }
                this.loading = false
            }).catch(err => {
                console.log(err)
                this.loading = false
            })
        },
        getDataPage (curPage) {
            this.getData(curPage)
        },
        search () {
            // if (this.countyCode === '' || this.countyCode.length < 2) {
            //     this.$message({
            //         message: '请选择区县',
            //         type: 'error',
            //         duration: 1000
            //     })
            //     return
            // }
            if (this.searchDateTime !== '' && this.searchDateTime.length > 1) {
                this.getData(1)
            } else {
                this.$message({
                    message: '请选择时间',
                    type: 'error',
                    duration: 1000
                })
            }
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
