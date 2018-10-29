<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box">
                <el-button type="primary" icon="el-icon-circle-plus" @click="addUser">添加用户</el-button>
            </div>
            <div class="search-btn">
                <el-input placeholder="请输入用户手机号" v-model="input5" clearable class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="searchMember">查询</el-button>
                </el-input>
            </div>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>用户管理</span>
                <span><el-button icon="el-icon-close" @click="batchDel">批量删除</el-button></span>
            </div>
            <div class="card-con" ref="cardCon">
                <el-table
                        :height="tableHeight"
                        :data="tableData"
                        @selection-change="handleSelectionChange"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>
                    <el-table-column
                            label="用户头像"
                            width="100">
                        <template slot-scope="scope">
                            <img :src="scope.row.img" class="img">
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="date"
                            label="日期"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="姓名"
                            width="180">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="地址">
                    </el-table-column>
                    <el-table-column
                            label="当前状态"
                            width="100">
                        <template slot-scope="scope">
                            <el-switch
                                    @change="changeState(scope.row)"
                                    v-model="scope.row.status"
                                    active-color="#009e9e"
                                    inactive-color="#b7b7b7">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            width="100">
                        <template slot-scope="scope">
                            <i class="fa fa-edit" @click="modify(scope.$index, scope.row)"></i>
                            <i class="el-icon-delete" @click="del(scope.$index, scope.row)"></i>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination">
                    <el-pagination
                            :current-page="currentPage4"
                            :page-sizes="[100, 200, 300, 400]"
                            :page-size="100"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="400">
                    </el-pagination>
                </div>
            </div>
        </el-card>

        <el-dialog
                :title="dialogTitle"
                :visible.sync="dialogVisible"
                width="30%"
                top="0">
            <div>
                <el-form ref="addUserForm" :model="addUserForm" :rules="addUserRules" label-width="80px">
                    <el-form-item label="用户名" prop="userName">
                        <el-input v-model="addUserForm.userName" placeholder="请输入用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="录入日期" prop="date">
                        <el-date-picker
                                v-model="addUserForm.date"
                                type="date"
                                placeholder="录入日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input v-model="addUserForm.password" placeholder="请输入密码"></el-input>
                    </el-form-item>
                    <el-form-item label="权限" prop="auth">
                        <el-input v-model="addUserForm.auth" placeholder="请设置权限"></el-input>
                    </el-form-item>
                    <el-form-item label="用户描述">
                        <el-input v-model="addUserForm.desc" placeholder="请输入用户描述"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitAddUserForm">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="提示"
                :visible.sync="dialogVisiblePrompt"
                width="30%"
                top="0">
            <span>是否修改"{{info}}"为取消订单</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisiblePrompt = false">取 消</el-button>
                <el-button type="primary" @click="confirmDelete">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'backStageUserManage',
    data () {
        return {
            input5: '',
            currentPage4: 4,
            tableHeight: 0,
            tableData: [{
                img: '/static/images/img1.jpg',
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                status: true
            }, {
                img: '/static/images/img1.jpg',
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1517 弄',
                status: false
            }, {
                img: '/static/images/img1.jpg',
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1519 弄',
                status: true
            }, {
                img: '/static/images/img1.jpg',
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1516 弄',
                status: false
            }],
            multipleSelection: [],
            dialogVisiblePrompt: false,
            curIndex: 0,
            info: '',
            dialogVisible: false,
            addUserForm: {
                userName: '',
                date: '',
                password: '',
                auth: '',
                desc: ''
            },
            addUserRules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                date: [
                    { required: true, message: '请选择日期', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                auth: [
                    { required: true, message: '请设置权限', trigger: 'blur' }
                ]
            },
            dialogTitle: ''
        }
    },
    created () {
        this.$nextTick(() => {
            let h = this.$refs.cardCon.offsetHeight
            this.tableHeight = h - 52
            this.getData(0)
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
        addUser () {
            this.dialogTitle = '添加用户'
            this.dialogVisible = true
        },
        submitAddUserForm () {
            this.$refs['addUserForm'].validate((valid) => {
                if (valid) {
                    this.dialogVisible = false
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        handleSelectionChange (val) {
            this.multipleSelection = val
        },
        batchDel () {
            this.tableData = this.tableData.filter(function (item, index) {
                let isContain = false
                this.multipleSelection.some(function (selItem) {
                    let isEqual = true
                    for (let key in item) {
                        if (item[key] !== selItem[key]) {
                            isEqual = false
                        }
                    }
                    if (isEqual) {
                        isContain = true
                    }
                    return isEqual
                })
                if (!isContain) {
                    console.log(index)
                    return item
                }
            }, this)
        },
        modify (index, row) {
            this.dialogTitle = '修改用户'
            this.dialogVisible = true
        },
        changeState (row) {
            console.log(row)
        },
        del (index, row) {
            this.dialogVisiblePrompt = true
            this.curIndex = index
            this.info = row.name
        },
        confirmDelete () {
            this.dialogVisiblePrompt = false
            this.tableData.splice(this.curIndex, 1)
        },
        getData (page) {
            // this.$post.post('/searchAllMember', {page: page}).then(res => {
            //     if (res.data.code === 400) {
            //         console.log(res.data.data.list)
            //     }
            // }).catch(err => {
            //     console.log(err)
            // })
        },
        searchMember () {
            if (this.input5 === '') {
                this.$message({
                    message: '请输入用户手机号',
                    type: 'error',
                    duration: 1000
                })
            } else {
                // 15308367519
                // this.$post.post('/searchMemberByMobile', {mobile: this.input5}).then(res => {
                //     if (res.data.code === 400) {
                //         console.log(res.data.data)
                //     } else {
                //         console.log('未查询到该用户')
                //     }
                // }).catch(err => {
                //     console.log(err)
                // })
            }
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.search{
    display: flex; flex-direction: row; padding: 20px;
    .select-box {
        width: 600px;
    }
    .search-btn{
        flex: 1;
    }
}
.fa, .el-icon-delete{
    font-size: 20px; cursor: pointer;
}
</style>
