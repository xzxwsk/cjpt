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
                <el-input placeholder="请输入查询关键字" v-model="searchKey" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="searchFun">查询</el-button>
                </el-input>
            </div>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>分成类管理</span>
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
                        prop="username"
                        label="服务商用户名">
                    </el-table-column>
                    <el-table-column
                            min-width="120"
                            prop="categoryName"
                            label="服务名">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="platformRate"
                        label="平台分成比例">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="providerRate"
                        label="服务商分成比例">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="runnerRate"
                        label="骑手分成比例">
                    </el-table-column>
                    <el-table-column
                        width="200"
                        label="备注">
                        <template slot-scope="scope">
                            <el-popover
                                placement="bottom"
                                title=""
                                trigger="hover"
                                :content="scope.row.comment">
                                <span class="order-prompt" slot="reference">{{scope.row.comment.substr(0, 15)}}</span>
                            </el-popover>
                        </template>
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
                    <el-table-column
                        fixed="right"
                        label="操作">
                        <template slot-scope="scope">
                            <i class="fa fa-edit" title="修改" @click="modify(scope.row)"></i>
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
            width="600px"
            top="0">
            <div>
                <el-form :model="formDataPop" label-width="120px">
                    <div v-if="popTitle !== '修改'">
                        <el-form-item label="">
                            <el-radio-group v-model="formDataPop.selectType">
                                <el-radio label="0">服务商</el-radio>
                                <el-radio label="1">服务</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <div v-if="formDataPop.selectType === '0'">
                            <el-form-item label="服务商">
                                <!--<div class="services_ls_box">
                                    <div class="services_ls">
                                        <el-transfer :titles="agentLsTitles" :data="serviceAgentOptions" @left-check-change="getServicesForAgent"
                                             filterable
                                             :props="{
                                                key: 'id',
                                                label: 'realName'
                                             }">
                                        </el-transfer>
                                    </div>
                                </div>-->
                                <el-select v-model="formDataPop.serviceCategoryProviderId" remote :remote-method="getAgentLs" @change="getServicesForAgent"
                                    filterable
                                    placeholder="请选择服务商">
                                    <el-option
                                        v-for="item in serviceAgentOptions"
                                        :key="item.id"
                                        :label="item.realName"
                                        :value="item.providerId">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="">
                                <el-select v-model="formDataPop.serviceCategoryId" placeholder="请选择服务">
                                    <el-option
                                        v-for="item in servicesOptions"
                                        :key="item.id"
                                        :label="item.categoryName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                                <!--
                                列表形式
                                <div class="services_ls_box">
                                    <div class="services_ls">
                                        <el-transfer :titles="serviceLsTitles" v-model="formDataPop.serviceCategoryId" :data="servicesOptions"
                                            :props="{
                                                key: 'id',
                                                label: 'categoryName'
                                            }">
                                        </el-transfer>
                                    </div>
                                </div>
                                -->
                            </el-form-item>
                        </div>

                        <div v-else>
                            <el-form-item label="服务">
                                <el-select v-model="formDataPop.serviceCategoryId2" @change="getAgentForServices" clearable
                                           filterable
                                           placeholder="请选择服务">
                                    <el-option
                                        v-for="item in servicesOptions2"
                                        :key="item.id"
                                        :label="item.categoryName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="">
                                <el-select v-model="formDataPop.serviceCategoryProviderId2"
                                           filterable
                                           placeholder="请选择服务商">
                                    <el-option
                                        v-for="item in serviceAgentOptions2"
                                        :key="item.id"
                                        :label="item.realName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </div>
                    <el-form-item label="平台分成比例">
                        <el-input v-model="formDataPop.platformRate" placeholder="请输入平台分成比例"></el-input>
                    </el-form-item>
                    <el-form-item label="服务商分成比例">
                        <el-input v-model="formDataPop.providerRate" placeholder="请输入服务商分成比例"></el-input>
                    </el-form-item>
                    <el-form-item label="骑手分成比例">
                        <el-input v-model="formDataPop.runnerRate" placeholder="请输入骑手分成比例"></el-input>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="formDataPop.comment" type="textarea" :rows="2" placeholder="请输入备注"></el-input>
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
            serviceAgentOptions: [],
            serviceAgentOptions2: [],
            serviceAgentFlag: false,
            servicesOptions: [],
            servicesOptions2: [],
            servicesFlag: false,
            servicesFlag2: false,
            agentLsTitles: ['选择服务商'],
            // serviceLsTitles: ['服务'],
            dialogVisible: false
        }
    },
    created () {
        this.$nextTick(() => {
            let h = this.$refs.tableCon.offsetHeight
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
        getData (page, searchKey) {
            let _searchKey = ''
            if (searchKey === undefined) {
                _searchKey = ''
            } else {
                _searchKey = searchKey
            }
            this.loading = true
            $http({
                url: '/getScProviderDivide',
                data: {
                    pageNum: page,
                    params: _searchKey
                }
            }).then(res => {
                console.log(res)
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
        searchFun () {
            this.getData(1, this.searchKey)
        },
        // 获取服务商
        getAgentLs (searchKey) {
            let _searchKey = ''
            if (searchKey === undefined) {
                _searchKey = ''
            } else {
                _searchKey = searchKey
            }
            $http({
                url: '/agent/getServiceCategoryByProviderId',
                data: {
                    paramName: _searchKey,
                    pageSize: 100
                }
            }).then(res => {
                if (res.code === 400) {
                    this.serviceAgentFlag = true
                    this.serviceAgentOptions = res.data
                } else {
                    this.serviceAgentOptions = []
                    console.log('未查询到相关服务商')
                }
            }).catch(err => {
                this.serviceAgentOptions = []
                console.log(err)
            })
        },
        // 服务
        // 获取服务分类
        getServiceTypeLs (searchKey) {
            let _searchKey = ''
            if (searchKey === undefined) {
                _searchKey = ''
            } else {
                _searchKey = searchKey
            }
            $http({
                url: '/getServiceCategory',
                data: {
                    categoryName: _searchKey,
                    pageSize: 100
                }
            }).then(res => {
                console.log('服务：', res)
                if (res.code === 400) {
                    this.servicesFlag2 = true
                    this.servicesOptions2 = res.data.list
                } else {
                    this.servicesOptions2 = []
                    console.log('未查询到相关服务分类')
                }
            }).catch(err => {
                this.servicesOptions2 = []
                console.log(err)
            })
        },
        // 根据服务商获取服务
        getServicesForAgent (id) {
            $http({
                url: '/agent/getServiceCategoryProvider',
                data: {
                    providerId: id
                }
            }).then(res => {
                if (res.code === 400) {
                    this.servicesFlag = true
                    this.servicesOptions = res.data.list
                } else {
                    console.log('未查询到相关服务')
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 根据服务获取服务商
        getAgentForServices (serviceCategoryId) {
            $http({
                url: '/agent/getServiceCategoryProvider',
                data: {
                    serviceCategoryId: serviceCategoryId,
                    pageSize: 100
                }
            }).then(res => {
                if (res.code === 400) {
                    this.serviceAgentOptions2 = res.data.list
                } else {
                    console.log('未查询到相关服务商')
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 添加按钮
        addFun () {
            this.popTitle = '添加'
            this.formDataPop = {
                selectType: '0'
            }
            // 获取弹窗可选项
            this.getServiceLs()
            this.dialogVisible = true
        },
        // 修改按钮
        modify (row) {
            this.popTitle = '修改'
            this.formDataPop = deepClone(row)
            console.log(JSON.stringify(row))
            // 获取弹窗可选项
            this.getServiceLs()
            this.dialogVisible = true
        },
        // 添加、修改弹窗确认按钮
        confirmBtn () {
            let param = {}
            if (this.formDataPop.selectType === '0') {
                param = {
                    serviceCategoryProviderId: this.formDataPop.serviceCategoryId,
                    platformRate: this.formDataPop.platformRate,
                    runnerRate: this.formDataPop.runnerRate,
                    providerRate: this.formDataPop.providerRate,
                    comment: this.formDataPop.comment
                }
            } else {
                param = {
                    serviceCategoryProviderId: this.formDataPop.serviceCategoryProviderId2,
                    platformRate: this.formDataPop.platformRate,
                    runnerRate: this.formDataPop.runnerRate,
                    providerRate: this.formDataPop.providerRate,
                    comment: this.formDataPop.comment
                }
            }
            if (this.popTitle === '修改') {
                param.id = this.formDataPop.id
            }

            $http({
                url: '/scProviderDivideUpdate',
                data: param
            }).then(res => {
                console.log(res)
                this.dialogVisible = false
                if (res.code === 400) {
                    this.$message({
                        message: this.popTitle + '成功',
                        type: 'success'
                    })
                    this.getData(1)
                } else if (res.msg) {
                    this.$message({
                        message: res.msg,
                        type: 'warning'
                    })
                } else {
                    this.$message({
                        message: '操作失败',
                        type: 'warning'
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 修改状态
        changeState (row) {
            console.log(JSON.stringify(row))
            $http({
                url: '/scProviderDivideUpdate',
                data: row
            }).then(res => {
                console.log(res)
                this.dialogVisible = false
                if (res.code === 400) {
                    this.$message({
                        message: '修改状态成功',
                        type: 'success'
                    })
                    this.getData(1)
                } else if (res.msg) {
                    this.$message({
                        message: res.msg,
                        type: 'warning'
                    })
                } else {
                    this.$message({
                        message: '操作失败',
                        type: 'warning'
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 获取弹窗可选项
        getServiceLs () {
            // 服务商
            // 获取列表选项 服务商
            if (!this.serviceAgentFlag) {
                this.getAgentLs()
            }
            // 服务
            // 获取列表选项 服务
            if (!this.servicesFlag2) {
                this.getServiceTypeLs()
            }

            // 获取服务
            // if (!this.servicesFlag) {
            //     this.getServicesForAgent()
            // }
        },
        date (date) {
            if (date) {
                return dateFormat(date, 'yyyy-MM-dd hh:mm:ss')
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
