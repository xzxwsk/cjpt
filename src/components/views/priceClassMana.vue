<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-circle-plus" @click="addFun">添加</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="selectServiceType" @change="handleItemChange" placeholder="请选择服务类型">
                            <el-option
                                v-for="item in selectServiceTypeOptions"
                                :key="item.id"
                                :label="item.categoryName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </div>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>价格类管理</span>
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
                        prop="displayName"
                        label="收费名称">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="priceTips"
                        label="提示文案">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        label="定价主体">
                        <template slot-scope="scope">
                            <span>{{getCutomePriceEntity(scope.row.pricingSubject)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        label="价格是否必填">
                        <template slot-scope="scope">
                            <span>{{scope.row.isRequired === 1 ? "是" : "否"}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        label="是否显示">
                        <template slot-scope="scope">
                            <span>{{scope.row.isDisplay === 1 ? "是" : "否"}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        label="显示顺序">
                        <template slot-scope="scope">
                            <div class="sort_btn">
                                <span><b v-if="scope.$index < tableData.length - 1" @click="downSort(scope.row)">↓</b></span>
                                <span><b v-if="scope.$index > 0" @click="upSort(scope.row)">↑</b></span>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        width="200"
                        label="费用描述">
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
                    <el-form-item label="">
                        <el-select v-model="formDataPop.serviceCategoryId" placeholder="请选择服务类型">
                            <el-option
                                v-for="item in selectServiceTypeOptions"
                                :key="item.id"
                                :label="item.categoryName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="收费名称">
                        <el-input v-model="formDataPop.displayName" placeholder="请输入收费名称"></el-input>
                    </el-form-item>
                    <el-form-item label="提示文案">
                        <el-input v-model="formDataPop.priceTips" placeholder="请输入提示文案"></el-input>
                    </el-form-item>
                    <el-form-item label="定价主体" class="mgb0">
                        <el-select v-model="formDataPop.pricingSubject" placeholder="请选择定价主体">
                            <el-option
                                v-for="item in cutomePriceEntity"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="" class="mgb0" v-if="formDataPop.pricingSubject === 0 || formDataPop.pricingSubject === undefined">
                        <el-checkbox v-model="formDataPop.isRequiredFlag" disabled>价格是否必填</el-checkbox>
                    </el-form-item>
                    <el-form-item label="">
                        <el-checkbox v-model="formDataPop.isDisplay">是否显示</el-checkbox>
                    </el-form-item>
                    <el-form-item label="费用描述">
                        <el-input v-model="formDataPop.comment" type="textarea" :rows="2" placeholder="请输入费用描述"></el-input>
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
import { $http, deepClone } from '../../assets/js/utils'

export default {
    name: 'top',
    data () {
        return {
            loading: false,
            selectServiceType: '',
            selectServiceTypeOptions: [],
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
            cutomePriceEntity: [{
                value: 0,
                label: '服务商'
            }, {
                value: 1,
                label: '用户'
            }],
            dialogVisible: false
        }
    },
    created () {
        this.$nextTick(() => {
            let h = this.$refs.tableCon.offsetHeight
            this.tableHeight = h - 52
            this.getServiceType()
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
        getData (page, serviceCategoryId) {
            this.loading = true
            let param = {
                pageNum: page
            }
            if (serviceCategoryId !== undefined) {
                param.serviceCategoryId = serviceCategoryId
            }
            $http({
                url: '/getServiceCategoryPriceByCategoryId',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.tableData = res.data.list
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
        // 获取服务类型
        getServiceType () {
            $http({
                url: '/getServiceCategory'
            }).then(res => {
                console.log(res)
                if (res.code === 400) {
                    this.selectServiceTypeOptions = res.data.list
                    this.selectServiceType = this.selectServiceTypeOptions[0].id
                    this.getData(1, this.selectServiceType)
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
            this.formDataPop = {
                isRequiredFlag: true
            }
            this.dialogVisible = true
        },
        modify (item) {
            console.log(JSON.stringify(item))
            this.popTitle = '修改'
            item.isRequiredFlag = item.isRequired === 1
            this.formDataPop = deepClone(item)
            this.dialogVisible = true
        },
        // 选择服务类型
        handleItemChange (val) {
            this.getData(1, val)
        },
        // 弹窗确定
        confirmBtn () {
            console.log(JSON.stringify(this.formDataPop))
            let prompt = {
                serviceCategoryId: this.formDataPop.serviceCategoryId,
                displayName: this.formDataPop.displayName,
                priceTips: this.formDataPop.priceTips,
                pricingSubject: this.formDataPop.pricingSubject,
                isDisplay: this.formDataPop.isDisplay ? 1 : 0,
                comment: this.formDataPop.comment
            }
            if (this.formDataPop.pricingSubject === 0) {
                prompt.isRequired = 1
            }
            if (this.popTitle === '修改') {
                prompt.id = this.formDataPop.id
            }
            $http({
                url: '/serviceCategoryPriceUpdate',
                data: prompt
            }).then(res => {
                console.log(res)
                if (res.code === 400) {
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
        // 获取定价主体
        getCutomePriceEntity (val) {
            var str = ''
            switch (val) {
            case 0:
                str = '服务商'
                break
            case 1:
                str = '用户'
                break
            default:
            }
            return str
        },
        // 修改状态
        changeState (val) {
            $http({
                url: '/serviceCategoryPriceUpdate',
                data: val
            }).then(res => {
                if (res.code === 400) {
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
        downSort (row) {
            console.log(JSON.stringify(row))
            this.sort({
                id: row.id,
                serviceCategoryId: row.serviceCategoryId,
                upOrDown: 2
            })
        },
        upSort (row) {
            this.sort({
                id: row.id,
                serviceCategoryId: row.serviceCategoryId,
                upOrDown: 1
            })
        },
        sort (prompt) {
            $http({
                url: '/serviceCategoryPriceSort',
                data: prompt
            }).then(res => {
                if (res.code === 400) {
                    this.getData(1, this.selectServiceType)
                } else if (res.msg) {
                    this.$message({
                        message: res.msg,
                        type: 'warning'
                    })
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

</style>
