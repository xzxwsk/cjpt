<template>
    <div class="main-con">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>用户权限管理</span>
            </div>
            <div class="table-con" ref="tableCon">
                <el-table
                        v-loading="loading"
                        :height="tableHeight"
                        :data="tableData"
                        stripe
                        style="width: 100%">
                    <el-table-column
                            prop="mobile"
                            label="电话号码"
                            min-width="120">
                    </el-table-column>
                    <el-table-column
                            prop="realname"
                            label="骑手姓名"
                            min-width="100">
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
    </div>
</template>

<script>
import { $http } from '../../assets/js/utils'

export default {
    name: 'top',
    data () {
        return {
            loading: true,
            currentPage: 0,
            tableHeight: 0,
            tableData: [],
            pageSize: 10,
            total: 0,
            popTitle: '',
            dialogVisible: false
        }
    },
    created () {
        this.$nextTick(() => {
            let h = this.$refs.tableCon.offsetHeight
            this.tableHeight = h - 52
            this.getData(1)
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
            $http({
                url: '/searchWithDraw'
            }).then(res => {
                if (res.code === 400) {

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
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
