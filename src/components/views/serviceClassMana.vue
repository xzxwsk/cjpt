<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-circle-plus" @click="addFirstFun">添加一级服务</el-button>
                    </el-col>
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-circle-plus" @click="addSecondFun">添加二级服务</el-button>
                    </el-col>
                    <!--<el-col :span="8">-->
                        <!--<el-select v-model="searchServiceType" @change="handleItemChange" placeholder="请选择服务类型">-->
                            <!--<el-option-->
                                <!--v-for="item in serviceTypeOptions"-->
                                <!--:key="item.id"-->
                                <!--:label="item.categoryName"-->
                                <!--:value="item.id">-->
                            <!--</el-option>-->
                        <!--</el-select>-->
                    <!--</el-col>-->
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
                <span>服务类管理</span>
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
                        prop="parentCategoryName"
                        label="父类服务">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="categoryName"
                        label="服务名称">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        label="图标地址">
                        <template slot-scope="scope">
                            <img :src="scope.row.categoryIconStr" class="img" />
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="140"
                        label="是否包含起始位置">
                        <template slot-scope="scope">
                            <span>{{scope.row.isContainStartAddress === 1 ? "是" : "否"}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="150"
                        label="是否包含终点位置">
                        <template slot-scope="scope">
                            <span>{{scope.row.isContainEndAddress === 1 ? "是" : "否"}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="140"
                        label="是否包含服务地址">
                        <template slot-scope="scope">
                            <span>{{scope.row.isContainServiceAddress === 1 ? "是" : "否"}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        label="是否包含重量">
                        <template slot-scope="scope">
                            <span>{{scope.row.isContainWeight === 1 ? "是" : "否"}}</span>
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
                        min-width="120"
                        label="分类顺序">
                        <template slot-scope="scope">
                            <div class="sort_btn">
                                <span><b v-if="scope.$index < tableData.length - 1" @click="downSort(scope.row)">↓</b></span>
                                <span><b v-if="scope.$index > 0" @click="upSort(scope.row)">↑</b></span>
                            </div>
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
                    <el-form-item label="设置名称">
                        <el-input v-model="formDataPop.categoryName" placeholder="请输入名称" @blur="checkName"></el-input>
                    </el-form-item>
                    <el-form-item label="图标">
                        <el-upload
                            action=""
                            :http-request="uploadFileFun"
                            list-type="picture-card"
                            accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                            :limit="fileLimit"
                            :on-exceed="exceed">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="formDataPop.comment" type="textarea" :rows="2" placeholder="请输入备注信息"></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-switch
                            v-model="formDataPop.recordStatus"
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

        <el-dialog
            :title="popTitle2"
            :visible.sync="dialogVisible2"
            width="600px"
            top="0">
            <div>
                <el-form :model="formDataPop2" label-width="120px">
                    <el-form-item label="父级分类" class="mgb0">
                        <el-radio-group v-model="formDataPop2.parentCategoryId" class="radio_group">
                            <el-radio :label="parentCategoryItem.id" v-for="(parentCategoryItem, parentCategoryIndex) in parentCategoryLs" :key="parentCategoryIndex">{{parentCategoryItem.categoryName}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="设置名称">
                        <el-input v-model="formDataPop2.categoryName" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="图标">
                        <el-upload
                            action=""
                            :http-request="uploadFileFun2"
                            accept=".jpg,.jpeg,.png,.JPG,.JPEG,.PNG"
                            list-type="picture-card"
                            :limit="fileLimit"
                            :on-exceed="exceed">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="分类扩展" class="mgb0 check_group">
                        <el-checkbox v-model="formDataPop2.isContainStartAddress">包含起始位置</el-checkbox>
                        <el-checkbox v-model="formDataPop2.isContainEndAddress">包含终点位置</el-checkbox>
                        <el-checkbox v-model="formDataPop2.isContainServiceAddress">包含服务地址</el-checkbox>
                        <el-checkbox v-model="formDataPop2.isContainWeight">包含重量</el-checkbox>
                    </el-form-item>
                    <el-form-item label="分类规则" class="mgb0">
                        <el-checkbox v-model="formDataPop2.isAllowDistanceRule">允许距离</el-checkbox>
                        <el-checkbox v-model="formDataPop2.isAllowSpecialRule">允许特殊</el-checkbox>
                        <el-checkbox v-model="formDataPop2.isAllowTimeRule">允许时间</el-checkbox>
                        <el-checkbox v-model="formDataPop2.isAllowWeightRule">允许重量</el-checkbox>
                    </el-form-item>
                    <el-form-item label="备注" class="mgb0">
                        <el-input v-model="formDataPop2.comment" type="textarea" :rows="2" placeholder="请输入备注信息"></el-input>
                    </el-form-item>
                    <el-form-item label="状态" class="mgb0">
                        <el-switch
                            v-model="formDataPop2.recordStatus"
                            :active-value="activeValue"
                            active-color="#009e9e"
                            :inactive-value="inactiveValue"
                            inactive-color="#b7b7b7">
                        </el-switch>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible2 = false">取 消</el-button>
                <el-button type="primary" @click="confirmBtn2">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { $http, $http2, $httpFileUpload, dateFormat } from '../../assets/js/utils'

export default {
    name: 'top',
    data () {
        return {
            loading: false,
            serviceTypeOptions: [],
            searchKey: '',
            currentPage: 0,
            tableHeight: 0,
            tableData: [],
            activeValue: 1,
            inactiveValue: 0,
            pageSize: 10,
            total: 0,
            popTitle: '添加一级服务',
            formDataPop: {},
            dialogVisible: false,
            fileLimit: 1,

            popTitle2: '添加二级服务',
            formDataPop2: {},
            parentCategoryLs: [],
            dialogVisible2: false
        }
    },
    created () {
        this.$nextTick(() => {
            let h = this.$refs.tableCon.offsetHeight
            this.tableHeight = h - 52
            this.getData(1)
            this.getParentCategoryLs(0)
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
            let _searchKey = ''
            if (searchKey === undefined) {
                _searchKey = ''
            } else {
                _searchKey = searchKey
            }
            this.loading = true
            $http({
                url: '/getServiceCategory',
                data: {
                    pageNum: page,
                    categoryName: _searchKey
                }
            }).then(res => {
                if (res.code === 400) {
                    res.data.list.forEach(item => {
                        if (item.categoryIcon.indexOf('http://') === -1) {
                            item.categoryIconStr = this.imgPath + item.categoryIcon
                        } else {
                            item.categoryIconStr = item.categoryIcon
                        }
                    })
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
        // 获取父类列表
        getParentCategoryLs (parentCategoryId) {
            $http({
                url: '/getServiceCategoryByParentId',
                data: {
                    pageNum: 1,
                    parentCategoryId: parentCategoryId
                }
            }).then(res => {
                if (res.code === 400) {
                    this.parentCategoryLs = res.data
                } else {
                    this.parentCategoryLs = []
                }
            }).catch(err => {
                console.log(err)
                this.parentCategoryLs = []
            })
        },
        // 检测用户名重复
        checkName (e) {
            $http({
                url: '/verifyName',
                data: {
                    categoryName: e.target.value
                }
            }).then(res => {
                if (res.code === 400) {
                    this.formDataPop.nameRepeat = false
                } else if (res.msg) {
                    this.$message({
                        message: res.msg,
                        type: 'warning'
                    })
                    this.formDataPop.nameRepeat = true
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
                url: '/recordStatusEdit',
                data: row
            }).then(res => {
                console.log(res)
                this.dialogVisible = false
                if (res.code === 400) {
                    this.$message({
                        message: '修改状态成功',
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
        // 添加按钮
        addFirstFun () {
            this.popTitle = '添加一级分类'
            this.formDataPop = {}
            this.dialogVisible = true
        },
        // 一级服务文件上传
        uploadFileFun (file) {
            let formData = new FormData()
            formData.append('file', file.file)
            $httpFileUpload({
                url: '/Common/UploadPicture',
                data: formData
            }).then(res => {
                if (res.code === 400) {
                    this.formDataPop.categoryIcon = res.data.pictureUrl
                } else if (res.msg) {
                    this.$message({
                        message: res.msg,
                        type: 'warning'
                    })
                } else {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        exceed (files, fileList) {
            this.$message({
                message: '只能上传一张',
                type: 'warning'
            })
        },
        // 添加、修改弹窗确认按钮
        confirmBtn () {
            if (!this.formDataPop.hasOwnProperty('categoryName')) {
                this.$message({
                    message: '请输入服务名称',
                    type: 'warning'
                })
                return
            }
            if (this.formDataPop.nameRepeat) {
                this.$message({
                    message: '名称不能重复',
                    type: 'warning'
                })
            } else {
                $http2({
                    url: '/serviceCategoryUpdate',
                    data: {
                        oneOrSecondLevel: 1,
                        serviceCategoryExtraVo: {},
                        serviceCategoryRuleRestrictionVo: {},
                        serviceCategoryVo: this.formDataPop
                    }
                }).then(res => {
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
            }
        },

        // 添加二级服务
        addSecondFun () {
            this.popTitle2 = '添加二级服务'
            this.formDataPop2 = {}
            this.dialogVisible2 = true
        },
        // 修改按钮
        modify (row) {
            this.popTitle2 = '修改服务分类'
            this.formDataPop2 = {}
            // 通过id获取详情
            $http({
                url: '/getServiceCategoryDetail',
                data: {
                    id: row.id
                }
            }).then(res => {
                this.dialogVisible2 = true
                if (res.code === 400) {
                    this.formDataPop2 = {
                        parentCategoryId: res.data.serviceCategoryVo.parentCategoryId,
                        categoryName: res.data.serviceCategoryVo.categoryName,
                        categoryIcon: res.data.serviceCategoryVo.categoryIcon,
                        comment: res.data.serviceCategoryVo.comment,
                        recordStatus: res.data.serviceCategoryVo.recordStatus,
                        isContainStartAddress: res.data.serviceCategoryExtraVo.isContainStartAddress === 1,
                        isContainEndAddress: res.data.serviceCategoryExtraVo.isContainEndAddress === 1,
                        isContainServiceAddress: res.data.serviceCategoryExtraVo.isContainServiceAddress === 1,
                        isContainWeight: res.data.serviceCategoryExtraVo.isContainWeight === 1,
                        isAllowDistanceRule: res.data.serviceCategoryRuleRestrictionVo.isAllowDistanceRule === 1,
                        isAllowSpecialRule: res.data.serviceCategoryRuleRestrictionVo.isAllowSpecialRule === 1,
                        isAllowTimeRule: res.data.serviceCategoryRuleRestrictionVo.isAllowTimeRule === 1,
                        isAllowWeightRule: res.data.serviceCategoryRuleRestrictionVo.isAllowWeightRule === 1
                    }
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
        // 二级服务文件上传
        uploadFileFun2 (file) {
            let formData = new FormData()
            formData.append('file', file.file)
            $httpFileUpload({
                url: '/Common/UploadPicture',
                data: formData
            }).then(res => {
                if (res.code === 400) {
                    this.formDataPop2.categoryIcon = res.data.pictureUrl
                } else if (res.msg) {
                    this.$message({
                        message: res.msg,
                        type: 'warning'
                    })
                } else {
                    this.$message({
                        message: '上传失败',
                        type: 'warning'
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 添加、修改弹窗2确认按钮
        confirmBtn2 () {
            // console.log(JSON.stringify(this.formDataPop2))
            let prompt = {}
            // 有属性则为修改
            if (this.formDataPop2.oneOrSecondLevel) {
                prompt = this.formDataPop2
            } else {
                prompt = {
                    oneOrSecondLevel: 2,
                    serviceCategoryExtraVo: {
                        isContainEndAddress: this.formDataPop2.isContainEndAddress === true ? 1 : 0,
                        isContainServiceAddress: this.formDataPop2.isContainServiceAddress === true ? 1 : 0,
                        isContainStartAddress: this.formDataPop2.isContainStartAddress === true ? 1 : 0,
                        isContainWeight: this.formDataPop2.isContainWeight === true ? 1 : 0,
                        recordStatus: this.formDataPop2.recordStatus,
                        comment: this.formDataPop2.comment
                    },
                    serviceCategoryRuleRestrictionVo: {
                        isAllowDistanceRule: this.formDataPop2.isAllowDistanceRule === true ? 1 : 0,
                        isAllowSpecialRule: this.formDataPop2.isAllowSpecialRule === true ? 1 : 0,
                        isAllowTimeRule: this.formDataPop2.isAllowTimeRule === true ? 1 : 0,
                        isAllowWeightRule: this.formDataPop2.isAllowWeightRule === true ? 1 : 0,
                        recordStatus: this.formDataPop2.recordStatus,
                        comment: this.formDataPop2.comment
                    },
                    serviceCategoryVo: {
                        parentCategoryId: this.formDataPop2.parentCategoryId,
                        categoryIcon: this.formDataPop2.categoryIcon,
                        categoryName: this.formDataPop2.categoryName,
                        recordStatus: this.formDataPop2.recordStatus,
                        comment: this.formDataPop2.comment
                    }
                }
            }
            // console.log(JSON.stringify(prompt))
            $http2({
                url: '/serviceCategoryUpdate',
                data: prompt
            }).then(res => {
                console.log(res)
                this.dialogVisible2 = false
                if (res.code === 400) {
                    this.$message({
                        message: this.popTitle2 + '成功',
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
        // 按父级分类排序
        downSort (row) {
            this.sort({
                id: row.id,
                parentCategoryId: row.parentCategoryId,
                upOrDown: 2
            })
        },
        upSort (row) {
            this.sort({
                id: row.id,
                parentCategoryId: row.parentCategoryId,
                upOrDown: 1
            })
        },
        sort (prompt) {
            $http({
                url: '/serviceCategorySort',
                data: prompt
            }).then(res => {
                if (res.code === 400) {
                    this.searchKey = ''
                    this.getData(1, this.searchKey)
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
<style lang="scss">
.img{max-width: 100%; max-height: 100%;}
</style>
