<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-circle-plus" @click="addFun">添加</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="search-btn">
                <el-input placeholder="请输入骑手名称关键字查询" v-model="searchKey" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="searchFun">查询</el-button>
                </el-input>
            </div>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>骑手服务管理</span>
            </div>
            <div class="table-con" ref="tableCon">
                <el-table
                    v-loading="loading"
                    :height="tableHeight"
                    :data="tableData"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        min-width="120"
                        prop="categoryName"
                        label="服务名称">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="deliveryName"
                        label="骑手姓名">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="mobile"
                        label="骑手电话">
                    </el-table-column>
                    <el-table-column
                        min-width="160"
                        label="创建时间">
                        <template slot-scope="scope">
                            <span>{{date(scope.row.createTime)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="160"
                        label="更新时间">
                        <template slot-scope="scope">
                            <span>{{date(scope.row.updateTime)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="当前状态">
                        <template slot-scope="scope">
                            <el-switch
                                @change="changeState(scope.row)"
                                v-model="scope.row.recordStatus"
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
                            :current-page="currentPage"
                            :page-size="pageSize"
                            layout="total, prev, pager, next, jumper"
                            @current-change="getData"
                            :total="total">
                    </el-pagination>
                </div>
            </div>
        </el-card>
        <el-dialog
            :title="popTitle"
            :visible.sync="dialogVisible"
            width="800px"
            top="0">
            <div>
                <el-form :model="formDataPop" label-width="120px">
                    <el-form-item label="服务">
                        <el-select v-model="formDataPop.serviceLsId" filterable placeholder="请选择服务类型">
                            <el-option
                                v-for="item in servicesOptions"
                                :key="item.id"
                                :label="item.categoryName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-form-item label="">
                            <el-transfer :titles="bicycleLsTitles" v-model="formDataPop.bicycleId" :data="selectBicycleOptions"
                                :props="{
                                    key: 'id',
                                    label: 'realname'
                                }">
                            </el-transfer>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="formDataPop.comment" type="textarea" :rows="2" placeholder="请输入备注"></el-input>
                    </el-form-item>
                    <el-form-item
                        fixed="right"
                        label="状态">
                        <template slot-scope="scope">
                            <el-switch
                                v-model="formDataPop.recordStatus"
                                :active-value="activeValue"
                                active-color="#009e9e"
                                :inactive-value="inactiveValue"
                                inactive-color="#b7b7b7">
                            </el-switch>
                        </template>
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
import { $http, dateFormat, deepClone } from '../../assets/js/utils'

export default {
    name: 'top',
    data () {
        return {
            loading: false,
            providerId: '', // 服务商Id
            searchKey: '',
            currentPage: 0,
            tableHeight: 0,
            tableData: [],
            activeValue: 1,
            inactiveValue: 0,
            pageSize: 10,
            total: 0,
            popTitle: '',
            formDataPop: {},
            bicycleLsTitles: ['骑手', '已绑定骑手'],
            servicesOptions: [],
            selectAgentOptions: [], // 弹窗服务商
            selectBicycleOptions: [], // 弹窗骑手
            dialogVisible: false
        }
    },
    created () {
        this.providerId = JSON.parse(localStorage.userInfo).id
        this.$nextTick(() => {
            let h = this.$refs.tableCon.offsetHeight
            this.tableHeight = h - 52
            this.getData(1)
            this.getServiceLs()
            this.getBycycleForAgent()
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
        getData (page, providerId, searchKey) {
            this.loading = true
            let _searchKey = ''
            if (searchKey === undefined) {
                _searchKey = ''
            } else {
                _searchKey = searchKey
            }
            $http({
                url: '/agent/getScProviderDelivery',
                data: {
                    pageNum: page,
                    providerId: this.providerId,
                    deliveryName: _searchKey
                }
            }).then(res => {
                if (res.code === 400) {
                    this.tableData = res.data.list
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
        // 获取服务分类列表
        getServiceLs () {
            $http({
                url: '/agent/getServiceCategoryByProviderId',
                data: {
                    providerId: this.providerId
                }
            }).then(res => {
                if (res.code === 400) {
                    this.servicesOptions = res.data
                } else if (res.msg) {
                    // this.$message({
                    //     message: res.msg,
                    //     type: 'warning'
                    // })
                    this.servicesOptions = []
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 获取当前服务商骑手列表
        getBycycleForAgent (val) {
            $http({
                url: '/agent/getDelivery',
                data: {
                    providerId: this.providerId
                }
            }).then(res => {
                if (res.code === 400) {
                    this.selectBicycleOptions = res.data
                } else if (res.msg) {
                    // this.$message({
                    //     message: res.msg,
                    //     type: 'warning'
                    // })
                    this.selectBicycleOptions = []
                }
            }).catch(err => {
                console.log(err)
            })
        },
        addFun () {
            this.popTitle = '添加'
            this.dialogVisible = true
        },
        modify (item) {
            console.log(JSON.stringify(item))
            this.popTitle = '修改'
            this.formDataPop = deepClone(item)
            this.dialogVisible = true
        },
        // 弹窗确定
        confirmBtn () {
            let param = {
                serviceCategoryProviderIds: this.formDataPop.serviceLsId,
                comment: this.formDataPop.comment,
                recordStatus: this.formDataPop.recordStatus
            }
            if (this.formDataPop.bicycleId.length > 0) {
                param.deliveryIds = this.formDataPop.bicycleId.join(',')
            } else {
                param.deliveryIds = ''
            }
            // console.log(JSON.stringify(param))
            $http({
                url: '/agent/scProviderDeliveryUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.$message({
                        message: this.popTitle + '成功',
                        type: 'success'
                    })
                    this.dialogVisible = false
                    this.searchKey = ''
                    this.getData(1)
                } else if (res.msg) {
                    this.$message({
                        message: res.msg,
                        type: 'warning'
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 修改状态
        changeState (row) {
            $http({
                url: '/agent/recordStatuEdit',
                data: {
                    id: row.id,
                    recordStatus: row.recordStatus
                }
            }).then(res => {
                if (res.code === 400) {
                    this.getData(1, this.providerId, this.searchKey)
                } else if (res.msg) {
                    this.$message({
                        message: res.msg,
                        type: 'warning'
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        searchFun () {
            this.getData(1, this.providerId, this.searchKey)
        },
        date (date) {
            if (date) {
                return dateFormat(new Date(date).getTime() + new Date().getTimezoneOffset() * 60 * 1000, 'yyyy-MM-dd hh:mm:ss')
            } else {
                return ''
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.services_ls_box{width: 200px; overflow: hidden;
    .services_ls{
        width: 1000px;
    }
}
</style>
