<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-circle-plus" @click="addFun">添加</el-button>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="searchServiceType" @change="handleItemChange" placeholder="请选择服务类型">
                            <el-option
                                v-for="item in serviceTypeOptions"
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
                <span>内容提示管理</span>
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
                        prop="contentTitle"
                        label="内容标题">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="contentTips"
                        label="内容提示">
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
                    <el-form-item label="">
                        <el-select v-model="formDataPop.serviceCategoryId"
                            placeholder="请选择服务类型">
                            <el-option
                                v-for="item in serviceTypeOptions"
                                :key="item.id"
                                :label="item.categoryName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="内容标题">
                        <el-input v-model="formDataPop.contentTitle" placeholder="请输入内容标题"></el-input>
                    </el-form-item>
                    <el-form-item label="内容提示">
                        <el-input v-model="formDataPop.contentTips" placeholder="请输入内容提示"></el-input>
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
            searchServiceType: '',
            currentPage: 0,
            tableHeight: 0,
            tableData: [],
            activeValue: 1,
            inactiveValue: 0,
            pageSize: 10,
            total: 0,
            popTitle: '',
            formDataPop: {},
            serviceTypeOptions: [],
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
        getData (page, serviceCategoryId) {
            let param = {
                pageNum: page
            }
            if (serviceCategoryId !== undefined) {
                param.serviceCategoryId = serviceCategoryId
            }
            this.loading = true
            $http({
                url: '/getServiceCategoryContent',
                data: param
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
        searchFun () {
            this.getData(1, this.searchKey)
        },
        // 获取服务类型
        getServiceLs () {
            $http({
                url: '/getServiceCategory'
            }).then(res => {
                if (res.code === 400) {
                    this.serviceTypeOptions = res.data.list
                } else {
                    this.serviceTypeOptions = []
                    console.log('未查询到相关服务类型')
                }
            }).catch(err => {
                this.serviceTypeOptions = []
                console.log(err)
            })
        },
        // 添加按钮
        addFun () {
            this.popTitle = '添加'
            this.formDataPop = {}
            this.dialogVisible = true
        },
        // 修改按钮
        modify (row) {
            this.popTitle = '修改'
            this.formDataPop = deepClone(row)
            this.dialogVisible = true
        },
        // 添加、修改弹窗确认按钮
        confirmBtn () {
            $http({
                url: '/serviceCategoryContentUpdate',
                data: this.formDataPop
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
            $http({
                url: '/serviceCategoryContentUpdate',
                data: row
            }).then(res => {
                this.dialogVisible = false
                if (res.code === 400) {
                    this.$message({
                        message: '修改状态成功',
                        type: 'success'
                    })
                    this.getData(1, this.searchServiceType)
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
        // 搜索服务类型
        handleItemChange (val) {
            this.getData(1, val)
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
