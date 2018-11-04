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
            <div class="search-btn">
                <el-input placeholder="请输入查询关键字" v-model="searchKey" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="searchFun">查询</el-button>
                </el-input>
            </div>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>内容标签管理</span>
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
                        prop="labelName"
                        label="标签名称">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="serviceCategoryName"
                        label="服务类型">
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
                    <el-form-item label="标签名称">
                        <el-input v-model="formDataPop.labelName" placeholder="请输入标签名称"></el-input>
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
            serviceTypeOptions: [],
            dialogVisible: false
        }
    },
    created () {
        this.$nextTick(() => {
            let h = this.$refs.tableCon.offsetHeight
            this.tableHeight = h - 52
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
        getData (page, serviceCategoryId, searchKey) {
            let param = {
                pageNum: page
            }
            if (serviceCategoryId !== undefined) {
                param.serviceCategoryId = serviceCategoryId
            }
            if (searchKey !== undefined) {
                param.labelName = searchKey
            }
            this.loading = true
            $http({
                url: '/getServiceCategoryLabel',
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
        // 按服务类型搜索
        handleItemChange (val) {
            this.searchKey = ''
            this.getData(1, this.searchServiceType, this.searchKey)
        },
        searchFun () {
            this.getData(1, this.searchServiceType, this.searchKey)
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
                url: '/serviceCategoryLabelUpdate',
                data: this.formDataPop
            }).then(res => {
                console.log(res)
                this.dialogVisible = false
                if (res.code === 400) {
                    this.$message({
                        message: this.popTitle + '成功',
                        type: 'success'
                    })
                    this.searchKey = ''
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
        // 修改状态
        changeState (row) {
            console.log(JSON.stringify(row))
            $http({
                url: '/serviceCategoryLabelUpdate',
                data: row
            }).then(res => {
                this.dialogVisible = false
                if (res.code === 400) {
                    this.$message({
                        message: '修改状态成功',
                        type: 'success'
                    })
                    this.getData(1, this.searchServiceType, this.searchKey)
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
        // 获取服务类型
        getServiceLs () {
            $http({
                url: '/getServiceCategory'
            }).then(res => {
                if (res.code === 400) {
                    this.serviceTypeOptions = res.data.list
                    // this.searchServiceType = this.serviceTypeOptions[0].id
                    this.getData(1)
                } else {
                    this.serviceTypeOptions = []
                    console.log('未查询到相关服务类型')
                }
            }).catch(err => {
                this.serviceTypeOptions = []
                console.log(err)
            })
        },
        downSort (row) {
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
                url: '/serviceCategoryLabelSort',
                data: prompt
            }).then(res => {
                if (res.code === 400) {
                    this.searchKey = ''
                    this.getData(1, this.searchServiceType, this.searchKey)
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
