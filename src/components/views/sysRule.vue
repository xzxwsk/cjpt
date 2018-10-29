<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box">
                <el-row :gutter="20">
                    <el-col :span="20">
                        <el-cascader v-if="!isAgent"
                                v-model="countyCode"
                                placeholder="请选择区域"
                                :options="areaOptions"
                                @active-item-change="handleItemChange"
                                :props="props"
                        ></el-cascader>
                        <!--<el-input placeholder="请输入开始时间" v-model="startTimeIpt" class="input-with-select"></el-input>-->
                    </el-col>
                    <!--<el-col :span="1" style="padding-top: 10px">-</el-col>-->
                    <!--<el-col :span="6">-->
                        <!--<el-input placeholder="请输入结束时间" v-model="endTimeIpt" class="input-with-select"></el-input>-->
                    <!--</el-col>-->
                </el-row>
            </div>
            <div class="search-btn">
                <el-input placeholder="请输入代理商手机号查询" v-model="input5" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="getData(0)">查询</el-button>
                </el-input>
            </div>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>系统规则</span>
            </div>
            <div class="card-con" ref="cardCon">
                <el-table
                        v-loading="loading"
                        :height="tableHeight"
                        :data="tableData"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="areaCode"
                            label="区域编码"
                            min-width="150">
                    </el-table-column>
                    <el-table-column
                            prop="baseMileage"
                            label="默认公里数"
                            min-width="80">
                    </el-table-column>
                    <el-table-column
                            prop="basePrice"
                            label="距离费用"
                            min-width="100">
                    </el-table-column>
                    <el-table-column
                            prop="weightMarkup"
                            label="超重费用">
                    </el-table-column>
                    <el-table-column
                            prop="mileageMarkup"
                            label="超距费用">
                    </el-table-column>
                    <el-table-column
                            prop="nightMarkup"
                            label="夜间价格">
                    </el-table-column>
                    <el-table-column
                        prop="specialMarkup"
                        label="特殊加价">
                    </el-table-column>
                    <el-table-column
                        prop="beginTime"
                        label="开始时间">
                    </el-table-column>
                    <el-table-column
                        prop="endTime"
                        label="结束时间">
                    </el-table-column>
                    <el-table-column
                        prop="initialWeight"
                        label="初始重量">
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
                custom-class="modify-rule"
                title="修改规则"
                :visible.sync="dialogVisible"
                width="30%"
                top="0">
            <div>
                <el-form :model="ruleForm" label-width="120px">
                    <p class="prompt">说明文字</p>
                    <el-form-item label="起止时间">
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-input placeholder="请输入开始时间" v-model="ruleForm.beginTime" class="input-with-select"></el-input>
                                <!--<el-time-select-->
                                    <!--v-model="startTime"-->
                                    <!--:picker-options="{-->
                                        <!--start: '00:00',-->
                                        <!--step: '01:00',-->
                                        <!--end: '23:00'-->
                                    <!--}"-->
                                    <!--placeholder="开始时间">-->
                                <!--</el-time-select>-->
                            </el-col>
                            <el-col :span="1">-</el-col>
                            <el-col :span="8">
                                <el-input placeholder="请输入结束时间" v-model="ruleForm.endTime" class="input-with-select"></el-input>
                                <!--<el-time-select-->
                                    <!--v-model="endTime"-->
                                    <!--:picker-options="{-->
                                        <!--start: '00:00',-->
                                        <!--step: '01:00',-->
                                        <!--end: '23:00',-->
                                        <!--minTime: startTime-->
                                    <!--}"-->
                                    <!--placeholder="结束时间">-->
                                <!--</el-time-select>-->
                            </el-col>
                        </el-row>
                        <!--<el-time-picker-->
                            <!--is-range-->
                            <!--v-model="time"-->
                            <!--format="H"-->
                            <!--range-separator="至"-->
                            <!--start-placeholder="开始时间"-->
                            <!--end-placeholder="结束时间"-->
                            <!--placeholder="请选择起止时间">-->
                        <!--</el-time-picker>-->
                    </el-form-item>
                    <el-form-item label="初始重量">
                        <el-input v-model="ruleForm.initialWeight" placeholder="请输入初始重量" style="width: 80%"></el-input>
                    </el-form-item>
                    <el-form-item label="默认公里数">
                        <el-input v-model="ruleForm.baseMileage" placeholder="请输入默认公里数" style="width: 80%"></el-input> KM
                    </el-form-item>
                    <el-form-item label="距离费用">
                        <el-input v-model="ruleForm.basePrice" placeholder="请输入距离费用" style="width: 80%"></el-input> 默认费用
                    </el-form-item>
                    <el-form-item label="超重费用">
                        <el-input v-model="ruleForm.weightMarkup" placeholder="请输入超重费用" style="width: 80%"></el-input> KG/元
                    </el-form-item>
                    <el-form-item label="超距费用">
                        <el-input v-model="ruleForm.mileageMarkup" placeholder="请输入超距费用" style="width: 80%"></el-input> KM/元
                    </el-form-item>
                    <el-form-item label="夜间价格">
                        <el-input v-model="ruleForm.nightMarkup" placeholder="请输入夜间价格" style="width: 80%"></el-input>
                    </el-form-item>
                    <el-form-item label="特殊加价">
                        <el-input v-model="ruleForm.specialMarkup" placeholder="请输入特殊加价" style="width: 80%"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmModify">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import {deepClone, $http} from '../../assets/js/utils'

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
            areaOptions: [],
            props: {
                label: 'name',
                value: 'code',
                children: 'children'
            },
            activeValue: 1,
            inactiveValue: 2,
            ruleForm: {
                areaCode: 0,
                baseMileage: 'string',
                basePrice: 0,
                beginTime: 0,
                endTime: 0,
                id: 0,
                mileageMarkup: 0,
                nightMarkup: 0,
                specialMarkup: 0,
                weightMarkup: 0
            },
            isAgent: false,
            time: [],
            startTime: '',
            endTime: ''
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
            if (this.input5 !== '') {
                prompt.mobile = this.input5
            }
            if (this.countyCode.length > 0) {
                prompt.county = this.countyCode[2]
            }

            $http({
                url: '/agent/searchCarriageDispatchByCounty',
                data: prompt
            }).then(res => {
                if (res.code === 400) {
                    // this.tableData = res.data.list.map(function (item) {
                    //     item.beginTimeLabel = dateFormat(item.beginTime * 1000, 'hh')
                    //     item.endTimeLabel = dateFormat(item.endTime * 1000, 'hh')
                    //     return item
                    // })
                    this.tableData = res.data.list
                    this.total = res.data.total
                } else {
                    console.log('未查询到相关规则')
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
        modify (index, row) {
            this.curRow = index
            // let now = dateFormat(new Date(), 'yyyy-MM-dd')
            this.ruleForm = deepClone(row)
            // this.time = [new Date(now + ' ' + row.beginTimeLabel), new Date(now + ' ' + row.endTimeLabel)]
            // this.startTime = row.beginTimeLabel + ':00'
            // this.endTime = row.endTimeLabel + ':00'
            this.dialogVisible = true
        },
        confirmModify () {
            var regu = /^[1-9]\d*$/
            console.log(regu.test(this.ruleForm.beginTime))
            if (!regu.test(this.ruleForm.beginTime) || !regu.test(this.ruleForm.endTime)) {
                this.$message({
                    message: '开始时间或结束时间必须为整数',
                    type: 'error',
                    duration: 1000
                })
                return
            }
            if (!(this.ruleForm.beginTime >= 0 && this.ruleForm.beginTime <= 24)) {
                this.$message({
                    message: '开始时间必须为0-23点的整数',
                    type: 'error',
                    duration: 1000
                })
                return
            }
            if (!(this.ruleForm.endTime >= 0 && this.ruleForm.endTime <= 24)) {
                this.$message({
                    message: '结束时间必须为0-23点的整数',
                    type: 'error',
                    duration: 1000
                })
                return
            }
            /*
            if (parseInt(this.ruleForm.endTime) < parseInt(this.ruleForm.beginTime)) {
                this.$message({
                    message: '结果时间不能小于开始时间',
                    type: 'error',
                    duration: 1000
                })
                return
            }
            */
            this.dialogVisible = false
            // this.ruleForm.beginTime = (new Date('2018-01-01 ' + this.startTime + ':00')).getTime() / 1000
            // this.ruleForm.endTime = (new Date('2018-01-01 ' + this.endTime + ':00')).getTime() / 1000
            $http({
                url: '/agent/editCarriageDispatch',
                data: this.ruleForm
            }).then(res => {
                if (res.code === 400) {
                    this.$message({
                        message: '修改成功',
                        type: 'success',
                        duration: 1000
                    })
                    // this.getData(1)
                    this.reModiTable()
                } else {
                    this.$message({
                        message: '修改信息失败',
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
        getState (state) {
            let result = ''
            switch (state) {
            case 1:
                result = '待审核'
                break
            case 2:
                result = '审核中'
                break
            case 3:
                result = '审核通过'
                break
            case 4:
                result = '审核不通过'
                break
            default:
            }
            return result
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
            this.tableData = this.tableData.map(function (item, index) {
                if (index === this.curRow) {
                    // item.beginTimeLabel = dateFormat('2018-01-01 ' + this.startTime + ':00', 'hh')
                    // item.endTimeLabel = dateFormat('2018-01-01 ' + this.endTime + ':00', 'hh')
                    item = this.ruleForm
                    return item
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
.el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 90%;
}
</style>
