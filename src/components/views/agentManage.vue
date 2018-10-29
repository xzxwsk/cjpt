<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-circle-plus" @click="addUser">添加用户</el-button>
                    </el-col>
                    <el-col :span="18">
                        <el-cascader
                                v-model="countyCode"
                                placeholder="请选择区域"
                                :options="areaOptions"
                                @active-item-change="handleItemChange"
                                :props="props"
                        ></el-cascader>
                    </el-col>
                </el-row>
            </div>
            <div class="search-btn">
                <el-input placeholder="请输入代理商手机号查询" v-model="input5" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="searchAgent">查询</el-button>
                </el-input>
            </div>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>代理商管理</span>
            </div>
            <div class="card-con" ref="cardCon">
                <el-table
                        v-loading="loading"
                        :height="tableHeight"
                        :data="tableData"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="userName"
                            label="代理商用户名"
                            min-width="120">
                    </el-table-column>
                    <el-table-column
                            prop="realname"
                            label="代理商姓名"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            prop="mobile"
                            label="代理商电话号码"
                            min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop="enterprisename"
                        label="企业名称"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                            prop="seatnumber"
                            label="座机号码"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            prop="identityCardNo"
                            label="身份证号码"
                            min-width="180">
                    </el-table-column>
                    <el-table-column
                            prop="address"
                            label="联系地址"
                            min-width="180">
                    </el-table-column>
                    <el-table-column
                            prop="name"
                            label="开通区域">
                    </el-table-column>
                    <el-table-column
                            prop="createTime"
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

        <el-dialog
                :title="popTitle"
                :visible.sync="dialogVisible"
                width="500"
                top="0">
            <div>
                <el-form :model="agentForm" label-width="120px">
                    <el-form-item label="代理商用户名">
                        <el-input v-model="agentForm.userName" :disabled="isModify" placeholder="请输入代理商用户名"></el-input>
                    </el-form-item>
                    <el-form-item label="密码">
                        <el-input type="password" v-model="agentForm.password" placeholder="请输入新密码"></el-input>
                    </el-form-item>
                    <el-form-item label="代理商姓名">
                        <el-input v-model="agentForm.realname" :disabled="isModify" placeholder="请输入真实姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="代理商电话号码">
                        <el-input v-model="agentForm.editMobile" placeholder="请输入代理商电话号码"></el-input>
                    </el-form-item>
                    <el-form-item label="企业名称">
                        <el-input v-model="agentForm.enterprisename" placeholder="请输入企业名称"></el-input>
                    </el-form-item>
                    <el-form-item label="座机号码">
                        <el-input v-model="agentForm.seatnumber" placeholder="请输入座机号码"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码">
                        <el-input v-model="agentForm.identityCardNo" :disabled="isModify" placeholder="请输入身份证号码"></el-input>
                    </el-form-item>
                    <el-form-item label="联系地址">
                        <el-input v-model="agentForm.address" placeholder="请输入新的联系地址"></el-input>
                    </el-form-item>
                    <el-form-item label="区县编码">
                        <el-cascader
                                v-model="countyCode2"
                                placeholder="请选择区域"
                                :options="areaOptions"
                                @active-item-change="handleItemChange"
                                @change="getAreaName"
                                :props="props"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="当前状态">
                        <el-switch
                                v-model="agentForm.status"
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
import {deepClone, dateFormat, $http} from '../../assets/js/utils'

export default {
    name: 'top',
    data () {
        return {
            loading: true,
            input5: '',
            value1: '',
            currentPage4: 1,
            tableHeight: 0,
            tableData: [],
            pageSize: 10,
            total: 0,
            popTitle: '',
            dialogVisible: false,
            curRow: null,
            countyCode: [],
            countyCode2: [],
            areaOptions: [],
            props: {
                label: 'name',
                value: 'code',
                children: 'children'
            },
            activeValue: 1,
            inactiveValue: 2,
            agentForm: {
                id: '',
                mobile: '',
                seatnumber: '',
                realname: '',
                identityCardNo: '',
                address: '',
                userName: '',
                password: ''
            },
            isAgent: false
        }
    },
    created () {
        this.$nextTick(() => {
            let h = this.$refs.cardCon.offsetHeight
            this.tableHeight = h - 52
            this.getData(1)
            this.getArea(0)

            if (JSON.parse(localStorage.userInfo).level === 1) {
                this.isAgent = true
            } else {
                this.isAgent = false
            }
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
    computed: {
        isModify () {
            return this.curRow !== null
        }
    },
    methods: {
        getData (page) {
            this.loading = true
            $http({
                url: '/searchAllAgent',
                data: {
                    page: page
                }
            }).then(res => {
                if (res.code === 400) {
                    this.tableData = res.data.list.map(function (item) {
                        item.createTime = dateFormat(item.createTime * 1000, 'yyyy-MM-dd')
                        return item
                    })
                    this.total = res.data.total
                } else {
                    console.log('未查询到相关代理商')
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
        searchAgent () {
            if (this.countyCode === '' || this.countyCode.length < 2) {
                this.$message({
                    message: '请选择区县',
                    type: 'error',
                    duration: 1000
                })
                return
            }
            this.loading = true
            $http({
                url: '/searchAgentByMobileOrCounty',
                data: {
                    county: this.countyCode[2],
                    mobile: this.input5
                }
            }).then(res => {
                if (res.code === 400) {
                    this.tableData = []
                    res.data.createTime = dateFormat(res.data.createTime * 1000, 'yyyy-MM-dd')
                    this.tableData.push(res.data)
                    this.total = res.data.total
                } else {
                    console.log('未查询到相关代理商')
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
            this.curRow = null
            this.popTitle = '添加代理商'
            this.countyCode2 = []
            this.agentForm = {
                mobile: '',
                seatnumber: '',
                realname: '',
                identityCardNo: '',
                address: '',
                userName: '',
                password: ''
            }
            this.dialogVisible = true
        },
        modify (index, row) {
            this.curRow = index
            this.agentForm = deepClone(row)
            this.agentForm.password = ''
            this.agentForm.editMobile = ''
            this.popTitle = '修改代理商信息'
            this.dialogVisible = true
        },
        confirmBtn () {
            if (this.countyCode2.length > 0) {
                this.agentForm.county = this.countyCode2[2]
            }
            let url = ''
            if (this.curRow !== null) {
                url = '/agent/agentEdit'
                if (this.agentForm.editMobile === '') { // 修改后的新号码
                    delete this.agentForm['editMobile']
                    delete this.agentForm['mobile']
                }
                this.agentForm.createTime = (new Date(this.tableData[this.curRow].createTime)).getTime() / 1000
            } else {
                url = '/agent/agentInsert'
                if (this.countyCode2.length < 2) {
                    this.$message({
                        message: '请选择区域',
                        type: 'error',
                        duration: 1000
                    })
                    return
                }
                this.agentForm.province = this.countyCode2[0]
                this.agentForm.city = this.countyCode2[1]
                this.agentForm.county = this.countyCode2[2]
                this.agentForm.name = this.getAreaName(this.countyCode2)
                this.agentForm.mobile = this.agentForm.editMobile
                delete this.agentForm['id']
            }

            this.dialogVisible = false
            $http({
                url: url,
                data: this.agentForm
            }).then(res => {
                if (res.code === 400) {
                    this.$message({
                        message: this.popTitle + '成功',
                        type: 'success',
                        duration: 1000
                    })
                    this.getData(1)
                    // this.reModiTable()
                } else if (res.code === 1007) {
                    this.$message({
                        message: '该区域已开通',
                        type: 'error',
                        duration: 1000
                    })
                } else if (res.code === 1006) {
                    this.$message({
                        message: '用户帐号已存在',
                        type: 'error',
                        duration: 1000
                    })
                } else if (res.code === 1005) {
                    this.$message({
                        message: '手机号已存在',
                        type: 'error',
                        duration: 1000
                    })
                } else {
                    this.$message({
                        message: this.popTitle + '失败',
                        type: 'error',
                        duration: 1000
                    })
                }
            }).catch(err => {
                console.log(err)
                this.$message({
                    message: this.popTitle + '失败',
                    type: 'error',
                    duration: 1000
                })
            })
        },
        changeState (index, row) {
            this.curRow = index
            this.loading = true
            row.createTime = (new Date(row.createTime)).getTime() / 1000
            delete row['password']
            $http({
                url: '/agent/agentEdit',
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
                this.tableData[index].createTime = dateFormat(this.tableData[index].createTime * 1000, 'yyyy-MM-dd')
                this.loading = false
            }).catch(err => {
                console.log(err)
                this.loading = false
                this.$message({
                    message: '修改状态失败',
                    type: 'error',
                    duration: 1000
                })
                this.tableData[index].createTime = dateFormat(this.tableData[index].createTime * 1000, 'yyyy-MM-dd')
                this.reStatusTable(row)
            })
        },
        getArea (ParentCode) {
            $http({
                url: '/agent/searchAreaByParentCode',
                data: {
                    ParentCode: ParentCode
                }
            }).then(res => {
                this.areaOptions = []
                this.areaOptions = res.data.list.map(function (item) {
                    let area = deepClone(item)
                    area.children = []
                    return area
                }, this)
            }).catch(err => {
                console.log(err)
                this.$message({
                    message: '获取区域失败',
                    type: 'error',
                    duration: 1000
                })
            })
        },
        handleItemChange (val) {
            let flag = false
            if (val.length === 1) {
                this.areaOptions.some(function (item) {
                    if (item.code === val[0]) {
                        if (item.children.length > 0) {
                            flag = true
                        }
                    }
                })
            } else if (val.length === 2) {
                this.areaOptions.some(function (item) {
                    if (item.code === val[0]) {
                        item.children.some(function (sub) {
                            if (sub.code === val[1]) {
                                if (sub.children.length > 0) {
                                    flag = true
                                }
                            }
                        })
                    }
                })
            } else if (val.length === 3) {
                flag = true
            }
            if (!flag) {
                $http({
                    url: '/agent/searchAreaByParentCode',
                    data: {
                        ParentCode: val[val.length - 1]
                    }
                }).then(res => {
                    let children = []
                    if (val.length < 2) {
                        children = res.data.list.map(function (item) {
                            let area = deepClone(item)
                            area.children = []
                            return area
                        }, this)
                    } else {
                        children = res.data.list
                    }

                    this.setArea(children, this.areaOptions, val)
                }).catch(err => {
                    console.log(err)
                    this.$message({
                        message: '获取区域失败',
                        type: 'error',
                        duration: 1000
                    })
                })
            }
        },
        setArea (children, options, codeArr) {
            options.some(function (item) {
                if (codeArr[0] === item.code) {
                    if (codeArr.length === 1) {
                        item.children = children
                    } else if (codeArr.length === 2) {
                        item.children.some(function (sub) {
                            if (sub.code === codeArr[1]) {
                                sub.children = children
                            }
                        })
                    }
                }
            })
        },
        getAreaName (v) {
            let areaName = ''
            this.areaOptions.some(function (item) {
                if (v[0] === item.code) {
                    item.children.some(function (sub) {
                        if (v[1] === sub.code) {
                            sub.children.some(function (third) {
                                if (v[2] === third.code) {
                                    areaName = third.name
                                }
                            })
                        }
                    })
                }
            })
            return areaName
        },
        reStatusTable (row) {
            this.tableData.map(function (item, index) {
                if (index === this.curRow) {
                    if (item.status === 1) {
                        item.status = 2
                    } else {
                        item.status = 1
                    }
                }
            }, this)
        },
        reModiTable () {
            if (this.agentForm.createTime && this.agentForm.createTime !== '') {
                this.agentForm.createTime = dateFormat(this.agentForm.createTime * 1000, 'yyyy-MM-dd')
            } else {
                this.agentForm.createTime = dateFormat(new Date(), 'yyyy-MM-dd')
            }
            if (this.curRow) { // 修改代理商信息
                this.tableData = this.tableData.map(function (item, index) {
                    if (index === this.curRow) {
                        return this.agentForm
                    } else {
                        return item
                    }
                }, this)
            } else {
                this.tableData.push(this.agentForm)
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
        padding: 0 20px 0 0; width: 600px;
        .el-select{width: 100%;}
    }
    .search-btn{
        flex: 1;
    }
}
.img{
    border-radius: 50%;
}
.card-con{
    height: 100%;
}
.fa-edit{
    font-size: 22px; color: #048992; cursor: pointer;
}
.order-prompt{
    color: #048992; text-decoration: underline; cursor: pointer;
}
</style>
