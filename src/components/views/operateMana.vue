<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-circle-plus" @click="addUser">添加运营者</el-button>
                    </el-col>
                    <el-col :span="18">
                        <span class="label">*最多只能添加三个子帐号</span>
                    </el-col>
                </el-row>
            </div>
            <!--<div class="search-btn">
                <el-input placeholder="请输入手机号码查询" v-model="searchIpt" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="getData(1)">查询</el-button>
                </el-input>
            </div>-->
        </div>
        <div class="table-con" ref="tableCon">
            <el-card class="box-card">
                <el-table
                        v-loading="loading"
                        :height="tableHeight"
                        :data="tableData"
                        stripe
                        style="width: 100%">
                    <el-table-column
                        prop="userName"
                        label="用户名"
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        prop="mobile"
                        label="运营者电话"
                        min-width="100">
                    </el-table-column>
                    <el-table-column
                        prop="password"
                        label="密码"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                        prop="createTimeStr"
                        label="创建时间"
                        min-width="120">
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="当前状态">
                        <template slot-scope="scope">
                            <el-switch
                                @change="changeState(scope.$index, scope.row)"
                                v-model="scope.row.status"
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
                            <i class="fa fa-edit" @click="modify(scope.$index, scope.row)"></i>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination" v-if="total > 0">
                    <el-pagination
                        :current-page="currentPage"
                        :page-size="pageSize"
                        layout="total, prev, pager, next, jumper"
                        @current-change="getData"
                        :total="total">
                    </el-pagination>
                </div>
            </el-card>
        </div>
        <el-dialog
            :title="popTitle"
            :visible.sync="dialogVisible"
            :width="popWidth"
            top="0">
            <div>
                <el-form :model="formData" label-width="100px">
                    <el-form-item label="用户名">
                        <el-input v-model="formData.userName" placeholder="请输入新用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input type="password" v-model="formData.passwordNew" placeholder="请输入新密码"></el-input>
                    </el-form-item>
                    <el-form-item label="运营者电话">
                        <el-input v-model="formData.mobile" placeholder="请输入新电话号码"></el-input>
                    </el-form-item>
                    <el-form-item label="当前状态">
                        <el-switch
                            v-model="formData.status"
                            :active-value="activeValue"
                            active-color="#009e9e"
                            :inactive-value="inactiveValue"
                            inactive-color="#b7b7b7">
                        </el-switch>
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
import { dateFormat, $http } from '../../assets/js/utils'

export default {
    name: 'top',
    data () {
        return {
            searchIpt: '',
            loading: true,
            tableHeight: 0,
            tableData: [],
            currentPage: 1,
            pageSize: 1,
            total: 0,
            activeValue: 1,
            inactiveValue: 2,
            formData: {
                userName: '',
                password: '',
                mobile: '',
                status: 1
            },
            dialogVisible: false,
            popTitle: '',
            popWidth: '500px',
            isEdit: false
        }
    },
    created () {
        this.$nextTick(() => {
            let h = this.$refs.tableCon.offsetHeight
            this.tableHeight = h - 52
        })
    },
    mounted () {
        window.onresize = () => {
            return (() => {
                let h = document.body.clientHeight
                this.tableHeight = h - 85 - 80 - 58 - 40 - 55
            })()
        }

        this.getData(1)
    },
    methods: {
        getData (page) {
            this.loading = true
            $http({
                url: '/agent/searchAgentByParentId'
            }).then(res => {
                if (res.code === 400) {
                    this.tableData = res.data.map(function (item) {
                        item.createTimeStr = dateFormat(item.createTime * 1000, 'yyyy-MM-dd')
                        return item
                    })
                    // this.total = 1
                    // console.log(this.tableData)
                } else {
                    console.log('未查询到运营者信息')
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
        addUser () {
            if (this.tableData.length > 2) {
                this.$message({
                    message: '最多只能添加三个子帐号',
                    type: 'error',
                    duration: 1000
                })
                return
            }
            this.formData = {
                userName: '',
                passwordNew: '',
                mobile: '',
                status: 1
            }
            this.popTitle = '添加运营者'
            this.dialogVisible = true
            this.isEdit = false
        },
        changeState (index, row) {
            $http({
                url: '/agent/agentEdit',
                data: row
            }).then(res => {
                if (res.code === 400) {
                    this.getData(1)
                }
            }).catch(err => {
                console.log(err)
            })
        },
        modify (index, row) {
            this.formData = row
            this.formData.passwordNew = ''
            this.popTitle = '修改运营者'
            this.dialogVisible = true
            this.isEdit = true
        },
        confirmBtn () {
            let url = '/agent/agentInsert'
            if (this.isEdit) {
                url = '/agent/agentEdit'
            }
            this.dialogVisible = false
            if (this.formData.passwordNew !== '') {
                this.formData.password = this.formData.passwordNew
            } else {
                delete this.formData.password
            }
            $http({
                url: url,
                data: this.formData
            }).then(res => {
                if (res.code === 400) {
                    this.getData(1)
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
