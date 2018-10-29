<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-circle-plus" @click="addFun">添加</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="selectServiceTypeValue" @change="getDataForServicesType" placeholder="请选择服务类型">
                            <el-option
                                v-for="item in servicesTypeOptions"
                                :key="item.id"
                                :label="item.categoryName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
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
                <span>价格管理</span>
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
            <div class="pop_content">
                <el-form :model="formDataPop" label-width="120px">
                    <el-form-item label="">
                        <el-select v-model="formDataPop.selectServiceTypeValue" placeholder="请选择服务类型">
                            <el-option
                                v-for="item in servicesTypeOptions"
                                :key="item.id"
                                :label="item.categoryName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-card class="form_field_card">
                        <div slot="header" class="clearfix">
                            <span class="b">收费类型</span>
                        </div>
                        <div class="text item">
                            <el-form-item label="基础金额">
                                <el-row :gutter="20">
                                    <el-col :span="18"><el-input v-model="formDataPop.comment" type="text" placeholder="请输入金额"></el-input></el-col>
                                    <el-col :span="5">元</el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="订金金额">
                                <el-row :gutter="20">
                                    <el-col :span="18"><el-input v-model="formDataPop.comment" type="text" placeholder="请输入订金金额"></el-input></el-col>
                                    <el-col :span="5">元</el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="上门服务费金额">
                                <el-row :gutter="20">
                                    <el-col :span="18"><el-input v-model="formDataPop.comment" type="text" placeholder="请输入上门服务费金额"></el-input></el-col>
                                    <el-col :span="5">元</el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="" class="mgb0 mgl10">
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-button @click="savePriceType">保 存</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </div>
                    </el-card>
                    <el-card class="form_field_card">
                        <div slot="header" class="clearfix">
                            <span class="b">加价类型</span>
                        </div>
                        <div class="text item">
                            <el-radio-group v-model="activeName" class="mgb20">
                                <el-radio-button label="1">重量加价</el-radio-button>
                                <el-radio-button label="2">距离加价</el-radio-button>
                                <el-radio-button label="3">夜间加价</el-radio-button>
                                <el-radio-button label="4">特殊加价</el-radio-button>
                            </el-radio-group>
                            <el-form-item label="">
                                <el-radio-group v-model="radioValue">
                                    <el-radio :label="3">固定</el-radio>
                                    <el-radio :label="6">单价</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="名称">
                                <el-row :gutter="20">
                                    <el-col :span="18"><el-input v-model="formDataPop.comment" type="text" :placeholder="'请输入' + (radioValue===3 ? '固定' : '单价' ) + '名称'"></el-input></el-col>
                                    <el-col :span="5">元</el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="金额">
                                <el-row :gutter="20">
                                    <el-col :span="18"><el-input v-model="formDataPop.comment" type="text" :placeholder="'请输入' + (radioValue===3 ? '固定' : '单价' ) + '金额'"></el-input></el-col>
                                    <el-col :span="5">元</el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="" class="mgb0 mgl10">
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-button @click="saveAddPriceType">保 存</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </div>
                    </el-card>
                    <el-table
                        v-loading="loading"
                        height="200"
                        :data="tableDataPop"
                        stripe
                        style="width: 100%">
                        <el-table-column
                            min-width="120"
                            prop="providerId"
                            label="起始">
                        </el-table-column>
                        <el-table-column
                            min-width="120"
                            prop="realName"
                            label="终止">
                        </el-table-column>
                        <el-table-column
                            min-width="120"
                            prop="serviceCategoryId"
                            label="类型">
                        </el-table-column>
                        <el-table-column
                            min-width="120"
                            prop="categoryName"
                            label="数值">
                        </el-table-column>
                        <el-table-column
                            fixed="right"
                            label="操作">
                            <template slot-scope="scope">
                                <i class="fa fa-trash-o" title="修改" @click="delPop(scope.row)"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
            </div>
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
            selectProviderValue: '', // 搜索服务商
            selectAgentOptions: [], // 服务商选项,
            selectServiceTypeValue: '', // 搜索服务类型
            servicesTypeOptions: [], // 服务类型选项
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
            activeName: '', // 加价类型选中选项卡
            radioValue: '', // 加价类型单选框值
            tableDataPop: [],
            dialogVisible: false
        }
    },
    created () {
        this.providerId = JSON.parse(localStorage.userInfo).id
        this.$nextTick(() => {
            let h = this.$refs.tableCon.offsetHeight
            this.tableHeight = h - 52
            this.getData(1)
            this.getServiceTypeOfProvider()
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
        getData (page, serviceType, searchKey) {
            this.loading = true
            let param = {
                pageNum: page
            }
            if (serviceType !== undefined) {
                param.serviceType = serviceType
            }
            if (searchKey !== undefined) {
                param.paramName = searchKey
            }
            $http({
                url: '/agent/getServiceCategoryByProviderId',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.tableData = res.data
                    this.total = res.data.length
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
        // 通过服务商获取服务类型
        getServiceTypeOfProvider () {
            $http({
                url: '/getServiceCategory',
                data: {
                    providerId: this.providerId
                }
            }).then(res => {
                if (res.code === 400) {
                    this.servicesTypeOptions = res.data.list
                } else {
                    this.servicesTypeOptions = []
                }
            }).catch(err => {
                this.servicesTypeOptions = []
                console.log(err)
            })
        },
        // 弹窗通过服务商获取服务类型
        getServiceTypeOfProviderPop (val) {
            $http({
                url: '/getServiceCategory'
            }).then(res => {
                if (res.code === 400) {
                    this.servicesTypeOptionsPop = res.data.list
                } else {
                    this.servicesTypeOptionsPop = []
                }
            }).catch(err => {
                this.servicesTypeOptionsPop = []
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
        // 收费类型 保存
        savePriceType () {

        },
        // 选择加价类型tab
        handleTabClick (val) {
            console.log(val.label)
        },
        // 加价类型 保存
        saveAddPriceType () {

        },
        delPop (item) {

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
            this.getData(1, this.selectServiceTypeValue, this.searchKey)
        },
        // 选择服务类型搜索数据
        getDataForServicesType (val) {
            this.getData(1, val, this.searchKey)
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
</style>
