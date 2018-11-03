<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-circle-plus" @click="addFun">添加</el-button>
                    </el-col>
                    <!--<el-col :span="8">-->
                        <!--<el-select v-model="selectAgentValue" @change="handleItemChange" placeholder="请选择服务商">-->
                            <!--<el-option-->
                                <!--v-for="item in agentOptions"-->
                                <!--:key="item.id"-->
                                <!--:label="item.categoryName"-->
                                <!--:value="item.id">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    <!--</el-col>-->
                </el-row>
            </div>
            <div class="search-btn">
                <el-input placeholder="请输入服务名或服务商名查询" v-model="searchKey" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="searchFun">查询</el-button>
                </el-input>
            </div>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>服务商服务管理</span>
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
                        prop="providerId"
                        label="服务商ID">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="realName"
                        label="服务商名称">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="serviceCategoryId"
                        label="服务ID">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="categoryName"
                        label="服务名称">
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
                    <!--<el-table-column-->
                        <!--fixed="right"-->
                        <!--label="操作">-->
                        <!--<template slot-scope="scope">-->
                            <!--<i class="fa fa-edit" title="修改" @click="modify(scope.row)"></i>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
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
                    <el-form-item label="">
                        <el-select v-model="formDataPop.serviceCategoryId" placeholder="请选择服务类型" @change="getServicesForType">
                            <el-option
                                v-for="item in selectServiceTypeOptions"
                                :key="item.id"
                                :label="item.categoryName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <div class="services_ls_box">
                            <div class="services_ls">
                                <el-transfer :titles="agentLsTitles" :data="selectAgentOptions" @left-check-change="setSelectAgent"
                                    filterable
                                    :props="{
                                        key: 'providerId',
                                        label: 'realName'
                                    }">
                                </el-transfer>
                            </div>
                        </div>
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
            selectAgentValue: '', // 搜索服务商
            agentOptions: [], // 服务商选项
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
            servicesOptions: [],
            selectServiceTypeOptions: [], // 弹窗服务类型
            selectAgentOptions: [], // 弹窗服务商
            agentLsTitles: ['服务商'],
            dialogVisible: false
        }
    },
    created () {
        this.$nextTick(() => {
            let h = this.$refs.tableCon.offsetHeight
            this.tableHeight = h - 52
            this.getData(1)
            this.getServiceLs()
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
            this.loading = true
            let param = {
                pageNum: page
            }
            if (searchKey !== undefined) {
                param.paramName = searchKey
            }
            $http({
                url: '/agent/getServiceCategoryProvider',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.tableData = res.data.list
                    this.total = res.data.total
                } else {
                    console.log('未查询到相关服务商')
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
        // 获取服务类型
        getServiceLs () {
            $http({
                url: '/getServiceCategory'
            }).then(res => {
                if (res.code === 400) {
                    this.selectServiceTypeOptions = res.data.list
                } else {
                    this.selectServiceTypeOptions = []
                    console.log('未查询到相关服务类型')
                }
            }).catch(err => {
                this.selectServiceTypeOptions = []
                console.log(err)
            })
        },
        // 获取服务商列表
        getAgentLs () {
            $http({
                url: '/getServiceCategory'
            }).then(res => {
                console.log(res)
                if (res.code === 400) {
                    this.agentOptions = res.data.list
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
        addFun () {
            this.popTitle = '添加'
            this.formDataPop = {}
            this.dialogVisible = true
        },
        modify (item) {
            this.popTitle = '修改'
            this.formDataPop = deepClone(item)
            this.dialogVisible = true
        },
        // 选择服务类型
        handleItemChange (val) {
            this.getData(1, val)
        },
        // 选择服务商
        setSelectAgent (val) {
            this.formDataPop.providerIds = val.join(',')
        },
        // 弹窗确定
        confirmBtn () {
            let param = deepClone(this.formDataPop)
            delete param['serviceCategoryId']
            $http({
                url: '/serviceCategoryProviderEdit',
                data: param
            }).then(res => {
                console.log(res)
                if (res.code === 400) {
                    this.searchKey = ''
                    this.getData(1)
                } else if (res.msg) {
                    this.$message({
                        message: res.msg,
                        type: 'warning'
                    })
                }
                this.dialogVisible = false
            }).catch(err => {
                console.log(err)
            })
        },
        // 选择服务类型 获取服务
        getServicesForType (val) {
            this.formDataPop.serviceCategoryIds = val
            $http({
                url: '/agent/getServiceCategoryProvider',
                data: {
                    serviceCategoryId: val
                }
            }).then(res => {
                if (res.code === 400) {
                    this.selectAgentOptions = res.data.list
                } else if (res.msg) {
                    this.selectAgentOptions = []
                    this.$message({
                        message: res.msg,
                        duration: 1000,
                        type: 'warning'
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 选择服务 获取服务商
        getAgentForServices (val) {

        },
        // 修改状态
        changeState (val) {
            $http({
                url: '/agent/recordStatusEdit',
                data: {
                    id: val.id,
                    recordStatus: val.recordStatus
                }
            }).then(res => {
                if (res.code === 400) {
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
        searchFun () {
            this.getData(1, this.searchKey)
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
