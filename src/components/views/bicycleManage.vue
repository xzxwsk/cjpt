<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-cascader v-if="!isAgent"
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
                <el-input placeholder="请输入手机号查询" v-model="input5" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="getData(1)">查询</el-button>
                </el-input>
            </div>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>骑手管理</span>
            </div>
            <div class="card-con" ref="cardCon">
                <el-table
                        v-loading="loading"
                        :height="tableHeight"
                        :data="tableData"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="agentName"
                            label="代理商姓名"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            prop="agentMobile"
                            label="代理商电话号码"
                            min-width="120">
                    </el-table-column>
                    <el-table-column
                            prop="realname"
                            label="真实姓名"
                            min-width="80">
                    </el-table-column>
                    <el-table-column
                            prop="mobile"
                            label="电话号码"
                            min-width="120">
                    </el-table-column>
                    <el-table-column
                        label="身份证照片"
                        min-width="100">
                        <template slot-scope="scope">
                            <img :src="scope.row.identityCardFront" class="img">
                        </template>
                    </el-table-column>
                    <el-table-column
                            prop="identityCardNo"
                            label="身份证号码"
                            min-width="180">
                    </el-table-column>
                    <el-table-column
                        prop="alipayAccount"
                        label="支付宝帐户"
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
                            label="审核状态">
                        <template slot-scope="scope">
                            <span>{{getState(scope.row.checkStatus)}}</span>
                        </template>
                    </el-table-column>
                    <!--<el-table-column-->
                        <!--fixed="right"-->
                        <!--label="当前状态">-->
                        <!--<template slot-scope="scope">-->
                            <!--<el-switch-->
                                <!--@change="changeState(scope.$index, scope.row)"-->
                                <!--v-model="scope.row.states"-->
                                <!--:active-value="activeValue"-->
                                <!--active-color="#009e9e"-->
                                <!--:inactive-value="inactiveValue"-->
                                <!--inactive-color="#b7b7b7">-->
                            <!--</el-switch>-->
                        <!--</template>-->
                    <!--</el-table-column>-->
                    <el-table-column
                            fixed="right"
                            label="操作">
                        <template slot-scope="scope">
                            <i class="fa fa-edit" title="修改" @click="modify(scope.$index, scope.row)"></i>
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
                title="修改骑手信息"
                :visible.sync="dialogVisible"
                width="30%"
                top="0">
            <div>
                <el-form :model="deliverInfoForm" label-width="120px">
                    <el-form-item label="电话号码">
                        <el-input v-model="deliverInfoForm.editMobile" placeholder="请输入新的电话号码"></el-input>
                    </el-form-item>
                    <el-form-item label="联系地址">
                        <el-input v-model="deliverInfoForm.address" placeholder="请输入新的联系地址"></el-input>
                    </el-form-item>
                    <el-form-item label="开通区域编码">
                        <el-cascader
                                v-model="countyCode2"
                                placeholder="请选择新区域"
                                :options="areaOptions"
                                @active-item-change="handleItemChange"
                                :props="props"
                        ></el-cascader>
                    </el-form-item>
                    <el-form-item label="支付宝账户">
                        <el-input v-model="deliverInfoForm.alipayAccount" placeholder="请输入新的支付宝账户"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号码">
                        <el-input v-model="deliverInfoForm.identityCardNo" placeholder="请输入新的身份证号码"></el-input>
                    </el-form-item>
                    <el-form-item label="当前状态">
                        <el-switch
                            v-model="deliverInfoForm.states"
                            :active-value="activeValue"
                            active-color="#009e9e"
                            :inactive-value="inactiveValue"
                            inactive-color="#b7b7b7">
                        </el-switch>
                    </el-form-item>
                    <el-form-item label="审核状态">
                        <el-select v-model="deliverInfoForm.checkStatus" placeholder="请选择审核状态">
                            <el-option
                                    v-for="(item, index) in checkStatusOptions"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <!--<el-form-item label="审核意见">-->
                        <!--<el-input type="textarea" v-model="deliverInfoForm.checkMemo" placeholder="请输入审核意见"></el-input>-->
                    <!--</el-form-item>-->
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
            checkStatusOptions: [
                {
                    label: '审核不通过',
                    value: 0
                },
                {
                    label: '需要审核',
                    value: 1
                },
                {
                    label: '审核通过',
                    value: 2
                },
                {
                    label: '未完善资料',
                    value: 3
                }
            ],
            activeValue: 1,
            inactiveValue: 2,
            deliverInfoForm: {
                pwd: '',
                mobile: '',
                address: '',
                county: ''
            },
            isAgent: false
        }
    },
    created () {
        this.$nextTick(() => {
            if (JSON.parse(localStorage.userInfo).level === 1) {
                this.isAgent = true
            } else {
                this.isAgent = false
            }
            let h = this.$refs.cardCon.offsetHeight
            this.tableHeight = h - 52
            this.getData(1)
            this.getArea(0)
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
        getData (page) {
            this.loading = true
            let prompt = {}
            prompt.mobile = this.input5
            prompt.page = page
            if (this.countyCode.length > 0) {
                prompt.county = this.countyCode[2]
            }
            $http({
                url: '/agent/searchDeliverByCountyOrMobile',
                data: prompt
            }).then(res => {
                if (res.code === 400) {
                    this.tableData = res.data.list.map(function (item) {
                        item.createTime = dateFormat(item.createTime * 1000, 'yyyy-MM-dd')
                        return item
                    })
                    this.total = res.data.total
                } else {
                    console.log('未查询到相关骑手')
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
        // 点修改，弹出弹窗，重置输入框
        modify (index, row) {
            this.curRow = index
            this.countyCode2 = []
            this.deliverInfoForm = deepClone(row)
            this.deliverInfoForm.pwd = ''
            this.deliverInfoForm.editMobile = ''
            this.dialogVisible = true
        },
        // 修改弹窗确认按钮
        confirmBtn () {
            this.dialogVisible = false
            if (this.countyCode2.length > 0) {
                this.deliverInfoForm.province = this.countyCode2[0]
                this.deliverInfoForm.city = this.countyCode2[1]
                this.deliverInfoForm.county = this.countyCode2[2]
            }
            this.deliverInfoForm.createTime = (new Date(this.deliverInfoForm.createTime)).getTime() / 1000

            // 未输入新号码
            if (this.deliverInfoForm.editMobile === '') {
                delete this.deliverInfoForm['editMobile']
                // delete this.deliverInfoForm['mobile']
            }

            $http({
                url: '/agent/editDeliver',
                data: this.deliverInfoForm
            }).then(res => {
                if (res.code === 400) {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    })
                    this.reModiTable()
                } else {
                    let msg = '修改信息失败'
                    if (res.msg) {
                        msg = res.msg
                    }
                    if (res.code === 1008) {
                        msg = '该区域未开通'
                    }
                    this.$message({
                        message: msg,
                        type: 'error',
                        duration: 1000
                    })
                }
            }).catch(err => {
                console.log(err)
                this.$message({
                    message: '修改信息失败',
                    type: 'error',
                    duration: 1000
                })
            })
        },
        changeState (index, row) {
            this.curRow = index
            this.loading = true
            row.createTime = (new Date(row.createTime)).getTime() / 1000
            $http({
                url: '/agent/editDeliver',
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
        getState (state) {
            let result = ''
            switch (state) {
            case 0:
                result = '审核不通过'
                break
            case 1:
                result = '需要审核'
                break
            case 2:
                result = '审核通过'
                break
            case 3:
                result = '未完善资料'
                break
            default:
            }
            return result
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
        reStatusTable (row) {
            this.tableData.map(function (item, index) {
                if (index === this.curRow) {
                    if (item.states === 1) {
                        item.states = 2
                    } else {
                        item.states = 1
                    }
                }
            }, this)
        },
        reModiTable () {
            if (this.deliverInfoForm.createTime && this.deliverInfoForm.createTime !== '') {
                this.deliverInfoForm.createTime = dateFormat(this.deliverInfoForm.createTime * 1000, 'yyyy-MM-dd')
            } else {
                this.deliverInfoForm.createTime = dateFormat(new Date(), 'yyyy-MM-dd')
            }
            this.tableData = this.tableData.map(function (item, index) {
                if (index === this.curRow) {
                    // 修改了区域
                    if (this.countyCode2.length > 0) {
                        // 县名称
                        let selectArea = ''
                        this.areaOptions.some(function (item) {
                            if (item.code === this.countyCode2[0]) {
                                item.children.some(function (sub) {
                                    if (sub.code === this.countyCode2[1]) {
                                        sub.children.some(function (third) {
                                            if (third.code === this.countyCode2[2]) {
                                                selectArea = third.name
                                            }
                                        }, this)
                                    }
                                }, this)
                            }
                        }, this)
                        this.deliverInfoForm.name = selectArea
                    }
                    return this.deliverInfoForm
                } else {
                    return item
                }
            }, this)
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
    width: 60px; height: 80px;
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
