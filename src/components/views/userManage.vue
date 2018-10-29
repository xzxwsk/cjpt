<template>
    <div class="main-con">
        <div class="search">
            <el-input placeholder="请输入用户手机号" v-model="input5" clearable class="input-with-select">
                <el-button slot="append" icon="el-icon-search" @click="searchMember">查询</el-button>
            </el-input>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>用户管理</span>
            </div>
            <div class="card-con" ref="cardCon">
                <el-table
                        v-loading="loading"
                        :height="tableHeight"
                        :data="tableData"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            label="用户头像"
                            min-width="100">
                        <template slot-scope="scope">
                            <img :src="scope.row.avatar" class="img">
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="id"
                            label="用户ID"
                            min-width="80">
                    </el-table-column>
                    <el-table-column
                            prop="mobile"
                            label="手机号"
                            min-width="150">
                    </el-table-column>
                    <el-table-column
                            prop="createtime"
                            label="创建时间"
                            min-width="120">
                    </el-table-column>
                    <el-table-column
                            prop="referee"
                            label="推荐人">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址"
                            min-width="220">
                    </el-table-column>
                    <el-table-column
                            prop="identityCardNo"
                            label="身份证"
                            min-width="180">
                    </el-table-column>
                    <el-table-column
                            label="当前状态"
                            width="100">
                        <template slot-scope="scope">
                            <el-switch
                                    @change="changeState(scope.row)"
                                    v-model="scope.row.status"
                                    :active-value="activeValue"
                                    active-color="#009e9e"
                                    :inactive-value="inactiveValue"
                                    inactive-color="#b7b7b7">
                            </el-switch>
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
import {$http, dateFormat} from '../../assets/js/utils'

export default {
    name: 'top',
    data () {
        return {
            loading: true,
            input5: '',
            activeValue: 1,
            inactiveValue: 2,
            currentPage4: 1,
            tableHeight: 0,
            tableData: [],
            pageSize: 10,
            total: 0,
            curRow: null
        }
    },
    created () {
        this.$nextTick(() => {
            let h = this.$refs.cardCon.offsetHeight
            this.tableHeight = h - 52
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
            this.loading = true
            $http({
                url: '/searchAllMember',
                data: {
                    page: page
                }
            }).then(res => {
                if (res.code === 400) {
                    this.tableData = res.data.list.map(function (item) {
                        if (item.createtime) {
                            item.createtime = dateFormat(item.createtime * 1000, 'yyyy-MM-dd')
                        }
                        return item
                    })
                    this.total = res.data.total
                } else {
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
        changeState (row) {
            this.loading = false
            this.curRow = row
            row.createtime = (new Date(row.createtime)).getTime() / 1000
            $http({
                url: '/imprisonOrFreeMember',
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
                this.tableData.map(function (item) {
                    if (item.id === row.id) {
                        item.createtime = dateFormat(item.createtime * 1000, 'yyyy-MM-dd')
                    }
                })

                this.loading = false
            }).catch(err => {
                console.log(err)
                this.loading = false
                this.$message({
                    message: '修改状态失败',
                    type: 'error',
                    duration: 1000
                })
                this.tableData.map(function (item) {
                    if (item.id === row.id) {
                        item.createtime = dateFormat(item.createtime * 1000, 'yyyy-MM-dd')
                    }
                })
                this.reStatusTable(row)
            })
        },
        searchMember () {
            $http({
                url: '/searchMemberByMobile',
                data: {
                    mobile: this.input5
                }
            }).then(res => {
                if (res.code === 400) {
                    this.tableData = []
                    if (res.data.createtime) {
                        res.data.createtime = dateFormat(res.data.createtime * 1000, 'yyyy-MM-dd')
                    }
                    this.tableData.push(res.data)
                    this.total = 0
                    this.currentPage4 = 1
                } else {
                    console.log('未查询到该用户')
                    this.tableData = []
                    this.total = 0
                }
            }).catch(err => {
                console.log(err)
                this.tableData = []
                this.total = 0
            })
        },
        reStatusTable (row) {
            this.tableData.map(function (item, index) {
                if (item.id === this.curRow.id) {
                    if (item.status === 1) {
                        item.status = 2
                    } else {
                        item.status = 1
                    }
                }
            }, this)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.search{
    padding: 20px;
}
.img{
    max-width: 60px; max-height: 80px; border-radius: 50%;
}
.card-con{
    height: 100%;
}
</style>
