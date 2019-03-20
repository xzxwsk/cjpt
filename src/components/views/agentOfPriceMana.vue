<template>
    <div class="main-con">
        <div class="search">
            <div class="select-box">
                <el-row :gutter="20">
                    <el-col :span="6">
                        <el-button type="primary" icon="el-icon-circle-plus" @click="addFun">添加</el-button>
                    </el-col>
                    <!--<el-col :span="10">
                        <el-cascader
                            v-model="countyCode"
                            placeholder="请选择区域"
                            :options="areaOptions"
                            @active-item-change="handleItemChange"
                            @change="getAgentOfArea"
                            :props="props"
                        ></el-cascader>
                    </el-col>-->
                    <el-col :span="8">
                        <el-select v-model="selectServiceTypeValue" clearable @change="getDataForServicesType" placeholder="请选择服务类型">
                            <el-option
                                v-for="item in servicesTypeOptions"
                                :key="item.id"
                                :label="item.categoryName"
                                :value="item.serviceCategoryId">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </div>
            <div class="search-btn">
                <el-input placeholder="请输入服务名或服务商名查询" v-model="searchKey" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="searchFun">查询</el-button>
                </el-input>
            </div>
        </div>
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span>价格管理</span>
            </div>
            <div class="table-con" ref="tableCon">
                <el-table
                    v-loading="loading"
                    :height="tableHeight"
                    :data="tableData"
                    stripe
                    style="width: 100%">
                    <!--<el-table-column
                        min-width="120"
                        prop="realName"
                        label="服务商">
                    </el-table-column>-->
                    <el-table-column
                        min-width="120"
                        prop="categoryName"
                        label="服务">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        label="收费类型">
                        <template slot-scope="scope">
                            <el-popover
                                placement="bottom"
                                title=""
                                trigger="hover"
                                :content="scope.row.priceDeatil">
                                <span class="order-prompt" slot="reference">{{scope.row.priceName}}</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="180"
                        label="加价类型">
                        <template slot-scope="scope">
                            <div slot="reference">
                                <span class="order-prompt" @click="zongliangjiajia(scope.row)">重量加价</span>、
                                <span class="order-prompt" @click="julijiajia(scope.row)">距离加价</span>、
                                <span class="order-prompt" @click="yejianjiajia(scope.row)">时间加价</span>、
                                <span class="order-prompt" @click="teshujiajia(scope.row)">特殊加价</span>
                            </div>
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

        <!--  添加、修改弹窗 -->
        <el-dialog
            :title="popTitle"
            :visible.sync="dialogVisible"
            width="600px"
            top="0">
            <div class="pop_content">
                <el-form :model="formDataPop" label-width="120px">
                    <div v-if="popTitle !== '修改'">
                        <!--<el-form-item label="">
                                <el-row :gutter="20">
                                    <el-col :span="12">
                                        <el-cascader
                                            v-model="formDataPop.countyCodePop"
                                            placeholder="请选择区域"
                                            :options="areaOptions"
                                            @active-item-change="handleItemChange"
                                            @change="getAgentOfAreaPop"
                                            :props="props"
                                        ></el-cascader>
                                    </el-col>
                                    <el-col :span="8">{{providerName}}</el-col>
                                </el-row>
                            </el-form-item>-->
                        <el-form-item label="">
                            <el-select v-model="formDataPop.selectServiceTypeValue" placeholder="请选择服务类型"
                                       @change="getPriceType">
                                <el-option
                                    v-for="item in servicesTypeOptionsPop"
                                    :key="item.id"
                                    :label="item.categoryName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>

                    <el-card class="form_field_card">
                        <div slot="header" class="clearfix">
                            <span class="b">收费类型</span>
                        </div>
                        <div class="text item">
                            <el-form-item v-for="priceItem in priceType" :label="priceItem.displayName" :key="priceItem.id">
                                <el-row :gutter="20">
                                    <el-col :span="18">
                                        <el-input v-model="priceItem.providerPrice" type="number" placeholder="请输入金额"></el-input>
                                    </el-col>
                                    <el-col :span="5">元</el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="" class="mgb0 mgl10" v-if="priceType.length > 0">
                                <el-row :gutter="20">
                                    <el-col :span="24">
                                        <el-button @click="savePriceType">保 存</el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                        </div>
                    </el-card>

                    <div v-if="popTitle !== '修改'">
                        <el-card class="form_field_card">
                            <div slot="header" class="clearfix">
                                <span class="b">加价类型</span>
                            </div>
                            <div class="text item">
                                <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
                                    <el-tab-pane label="重量加价" name="first">
                                        <el-form-item label="">
                                            <el-radio-group v-model="formDataPop.priceType">
                                                <el-radio :label="0">固定</el-radio>
                                                <el-radio :label="1">比例</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <el-form-item label="起始重量">
                                            <el-row :gutter="20">
                                                <el-col :span="18"><el-input v-model="formDataPop.startWeight" type="number" :placeholder="'请输入起始重量'"></el-input></el-col>
                                                <el-col :span="5">Kg</el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item label="结束重量">
                                            <el-row :gutter="20">
                                                <el-col :span="18"><el-input v-model="formDataPop.endWeight" type="number" :placeholder="'请输入结束重量'"></el-input></el-col>
                                                <el-col :span="5">Kg</el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item label="加价数量">
                                            <el-row :gutter="20">
                                                <el-col :span="18"><el-input v-model="formDataPop.priceAmount" type="number" :placeholder="'请输入加价数量'"></el-input></el-col>
                                                <el-col :span="5">{{formDataPop.priceType===0 ? '元' : '%'}}</el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item label="" class="mgb0 mgl10">
                                            <el-row :gutter="20">
                                                <el-col :span="24">
                                                    <el-button @click="saveAddPriceTypeZl">保 存</el-button>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-table
                                            v-loading="loading"
                                            height="200"
                                            :data="zlTableDataPop"
                                            stripe
                                            style="width: 100%">
                                            <el-table-column
                                                min-width="120"
                                                prop="startWeight"
                                                label="起始">
                                            </el-table-column>
                                            <el-table-column
                                                min-width="120"
                                                prop="endWeight"
                                                label="终止">
                                            </el-table-column>
                                            <el-table-column
                                                min-width="120"
                                                label="类型">
                                                <template slot-scope="scope">
                                                    <div slot="reference">
                                                        {{scope.row.priceType === 0 ? '固定值' : '比例'}}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                min-width="120"
                                                label="数值">
                                                <template slot-scope="scope">
                                                    <div slot="reference">
                                                        {{scope.row.priceAmount + (scope.row.priceType === 0 ? '元' : '%')}}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                fixed="right"
                                                label="操作">
                                                <template slot-scope="scope">
                                                    <i class="fa fa-trash-o" title="删除" @click="delZlPop(scope.row)"></i>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-tab-pane>

                                    <el-tab-pane label="距离加价" name="second">
                                        <el-form-item label="">
                                            <el-radio-group v-model="formDataPop.priceTypeJl">
                                                <el-radio :label="0">固定</el-radio>
                                                <el-radio :label="1">比例</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <el-form-item label="起始距离">
                                            <el-row :gutter="20">
                                                <el-col :span="18"><el-input v-model="formDataPop.startDistance" type="number" :placeholder="'请输入起始距离'"></el-input></el-col>
                                                <el-col :span="5">Km</el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item label="结束距离">
                                            <el-row :gutter="20">
                                                <el-col :span="18"><el-input v-model="formDataPop.endDistance" type="number" :placeholder="'请输入结束距离'"></el-input></el-col>
                                                <el-col :span="5">Km</el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item label="加价数量">
                                            <el-row :gutter="20">
                                                <el-col :span="18"><el-input v-model="formDataPop.priceAmountJl" type="number" :placeholder="'请输入加价数量'"></el-input></el-col>
                                                <el-col :span="5">{{formDataPop.priceTypeJl===0 ? '元' : '%'}}</el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item label="" class="mgb0 mgl10">
                                            <el-row :gutter="20">
                                                <el-col :span="24">
                                                    <el-button @click="saveAddPriceTypeJl">保 存</el-button>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-table
                                            v-loading="loading"
                                            height="200"
                                            :data="jlTableDataPop"
                                            stripe
                                            style="width: 100%">
                                            <el-table-column
                                                min-width="120"
                                                prop="startDistance"
                                                label="起始">
                                            </el-table-column>
                                            <el-table-column
                                                min-width="120"
                                                prop="endDistance"
                                                label="结束">
                                            </el-table-column>
                                            <el-table-column
                                                min-width="120"
                                                label="类型">
                                                <template slot-scope="scope">
                                                    <div slot="reference">
                                                        {{scope.row.priceType === 0 ? '固定值' : '比例'}}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                min-width="120"
                                                label="数值">
                                                <template slot-scope="scope">
                                                    <div slot="reference">
                                                        {{scope.row.priceAmount + (scope.row.priceType === 0 ? '元' : '%')}}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                fixed="right"
                                                label="操作">
                                                <template slot-scope="scope">
                                                    <i class="fa fa-trash-o" title="删除" @click="delJlPop(scope.row)"></i>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-tab-pane>

                                    <el-tab-pane label="时间加价" name="third">
                                        <el-form-item label="">
                                            <el-radio-group v-model="formDataPop.priceTypeYj">
                                                <el-radio :label="0">固定</el-radio>
                                                <el-radio :label="1">比例</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <el-form-item label="开始时间">
                                            <el-row :gutter="20">
                                                <el-col :span="18"><el-input v-model="formDataPop.startTime" type="number" :placeholder="'请输入开始时间'"></el-input></el-col>
                                                <el-col :span="5">时</el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item label="结束时间">
                                            <el-row :gutter="20">
                                                <el-col :span="18"><el-input v-model="formDataPop.endTime" type="number" :placeholder="'请输入结束时间'"></el-input></el-col>
                                                <el-col :span="5">时</el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item label="加价数量">
                                            <el-row :gutter="20">
                                                <el-col :span="18"><el-input v-model="formDataPop.priceAmountYj" type="number" :placeholder="'请输入加价数量'"></el-input></el-col>
                                                <el-col :span="5">{{formDataPop.priceTypeYj===0 ? '元' : '%'}}</el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item label="" class="mgb0 mgl10">
                                            <el-row :gutter="20">
                                                <el-col :span="24">
                                                    <el-button @click="saveAddPriceTypeYj">保 存</el-button>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-table
                                            v-loading="loading"
                                            height="200"
                                            :data="yjTableDataPop"
                                            stripe
                                            style="width: 100%">
                                            <el-table-column
                                                min-width="120"
                                                prop="startTime"
                                                label="起始">
                                            </el-table-column>
                                            <el-table-column
                                                min-width="120"
                                                prop="endTime"
                                                label="结束">
                                            </el-table-column>
                                            <el-table-column
                                                min-width="120"
                                                label="类型">
                                                <template slot-scope="scope">
                                                    <div slot="reference">
                                                        {{scope.row.priceType === 0 ? '固定值' : '比例'}}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                min-width="120"
                                                label="数值">
                                                <template slot-scope="scope">
                                                    <div slot="reference">
                                                        {{scope.row.priceAmount + (scope.row.priceType === 0 ? '元' : '%')}}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                fixed="right"
                                                label="操作">
                                                <template slot-scope="scope">
                                                    <i class="fa fa-trash-o" title="删除" @click="delYjPop(scope.row)"></i>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-tab-pane>
                                    <el-tab-pane label="特殊加价" name="fourth">
                                        <el-form-item label="">
                                            <el-radio-group v-model="formDataPop.priceTypeTs">
                                                <el-radio :label="0">固定</el-radio>
                                                <el-radio :label="1">比例</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                        <el-form-item label="加价名称">
                                            <el-row :gutter="20">
                                                <el-col :span="18"><el-input v-model="formDataPop.displayName" type="text" :placeholder="'请输入加价名称'"></el-input></el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item label="加价数量">
                                            <el-row :gutter="20">
                                                <el-col :span="18"><el-input v-model="formDataPop.priceAmountTs" type="number" :placeholder="'请输入加价数量'"></el-input></el-col>
                                                <el-col :span="5">{{formDataPop.priceTypeTs===0 ? '元' : '%'}}</el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-form-item label="" class="mgb0 mgl10">
                                            <el-row :gutter="20">
                                                <el-col :span="24">
                                                    <el-button @click="saveAddPriceTypeTs">保 存</el-button>
                                                </el-col>
                                            </el-row>
                                        </el-form-item>
                                        <el-table
                                            v-loading="loading"
                                            height="200"
                                            :data="tsTableDataPop"
                                            stripe
                                            style="width: 100%">
                                            <el-table-column
                                                min-width="120"
                                                prop="displayName"
                                                label="加价名称">
                                            </el-table-column>
                                            <el-table-column
                                                min-width="120"
                                                label="类型">
                                                <template slot-scope="scope">
                                                    <div slot="reference">
                                                        {{scope.row.priceType === 0 ? '固定值' : '比例'}}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                min-width="120"
                                                label="数值">
                                                <template slot-scope="scope">
                                                    <div slot="reference">
                                                        {{scope.row.priceAmount + (scope.row.priceType === 0 ? '元' : '%')}}
                                                    </div>
                                                </template>
                                            </el-table-column>
                                            <el-table-column
                                                fixed="right"
                                                label="操作">
                                                <template slot-scope="scope">
                                                    <i class="fa fa-trash-o" title="删除" @click="delTsPop(scope.row)"></i>
                                                </template>
                                            </el-table-column>
                                        </el-table>
                                    </el-tab-pane>
                                </el-tabs>
                            </div>
                        </el-card>
                    </div>
                </el-form>
            </div>
        </el-dialog>

        <!-- 重量弹窗 -->
        <el-dialog
            :title="popTitleModiZl"
            :visible.sync="dialogVisibleModiZl"
            width="600px"
            top="0">
            <div class="pop_content">
                <el-form :model="formDataPopZl" label-width="120px">
                    <el-form-item label="">
                        <el-radio-group v-model="formDataPopZl.priceType">
                            <el-radio :label="0">固定</el-radio>
                            <el-radio :label="1">比例</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="起始重量">
                        <el-row :gutter="20">
                            <el-col :span="18"><el-input v-model="formDataPopZl.startWeight" type="number" :placeholder="'请输入起始重量'"></el-input></el-col>
                            <el-col :span="5">Kg</el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="结束重量">
                        <el-row :gutter="20">
                            <el-col :span="18"><el-input v-model="formDataPopZl.endWeight" type="number" :placeholder="'请输入结束重量'"></el-input></el-col>
                            <el-col :span="5">Kg</el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="加价数量">
                        <el-row :gutter="20">
                            <el-col :span="18"><el-input v-model="formDataPopZl.priceAmount" type="number" :placeholder="'请输入加价数量'"></el-input></el-col>
                            <el-col :span="5">{{formDataPopZl.priceType===0 ? '元' : '%'}}</el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="" class="mgl10">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-button @click="saveAddPriceTypeModiZl">保 存</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
                <el-table
                    v-loading="loading"
                    height="200"
                    :data="zlTableDataPopModi"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        min-width="120"
                        prop="startWeight"
                        label="起始">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="endWeight"
                        label="终止">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        label="类型">
                        <template slot-scope="scope">
                            <div slot="reference">
                                {{scope.row.priceType === 0 ? '固定值' : '比例'}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        label="数值">
                        <template slot-scope="scope">
                            <div slot="reference">
                                {{scope.row.priceAmount + (scope.row.priceType === 0 ? '元' : '%')}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作">
                        <template slot-scope="scope">
                            <i class="fa fa-trash-o" title="删除" @click="delZlPopModi(scope.row)"></i>
                            <i class="fa fa-edit" title="修改" @click="xgZlPopModi(scope.row)"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>

        <!-- 夜间弹窗 -->
        <el-dialog
            :title="popTitleModiYj"
            :visible.sync="dialogVisibleModiYj"
            width="600px"
            top="0">
            <div class="pop_content">
                <el-form :model="formDataPopYj" label-width="120px">
                    <el-form-item label="">
                        <el-radio-group v-model="formDataPopYj.priceType">
                            <el-radio :label="0">固定</el-radio>
                            <el-radio :label="1">比例</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="开始时间">
                        <el-row :gutter="20">
                            <el-col :span="18"><el-input v-model="formDataPopYj.startTime" type="number" :placeholder="'请输入开始时间'"></el-input></el-col>
                            <el-col :span="5">时</el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="结束时间">
                        <el-row :gutter="20">
                            <el-col :span="18"><el-input v-model="formDataPopYj.endTime" type="number" :placeholder="'请输入结束时间'"></el-input></el-col>
                            <el-col :span="5">时</el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="加价数量">
                        <el-row :gutter="20">
                            <el-col :span="18"><el-input v-model="formDataPopYj.priceAmount" type="number" :placeholder="'请输入加价数量'"></el-input></el-col>
                            <el-col :span="5">{{formDataPopYj.priceType===0 ? '元' : '%'}}</el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="" class="mgb0 mgl10">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-button @click="saveAddPriceTypeYjModi">保 存</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
                <el-table
                    v-loading="loading"
                    height="200"
                    :data="yjTableDataPopModi"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        min-width="120"
                        prop="startTime"
                        label="起始">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="endTime"
                        label="结束">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        label="类型">
                        <template slot-scope="scope">
                            <div slot="reference">
                                {{scope.row.priceType === 0 ? '固定值' : '比例'}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        label="数值">
                        <template slot-scope="scope">
                            <div slot="reference">
                                {{scope.row.priceAmount + (scope.row.priceType === 0 ? '元' : '%')}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作">
                        <template slot-scope="scope">
                            <i class="fa fa-trash-o" title="删除" @click="delYjPopModi(scope.row)"></i>
                            <i class="fa fa-edit" title="修改" @click="xgYjPopModi(scope.row)"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>

        <!-- 特殊弹窗 -->
        <el-dialog
            :title="popTitleModiTs"
            :visible.sync="dialogVisibleModiTs"
            width="600px"
            top="0">
            <div class="pop_content">
                <el-form :model="formDataPopTs" label-width="120px">
                    <el-form-item label="">
                        <el-radio-group v-model="formDataPopTs.priceType">
                            <el-radio :label="0">固定</el-radio>
                            <el-radio :label="1">比例</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="加价名称">
                        <el-row :gutter="20">
                            <el-col :span="18"><el-input v-model="formDataPopTs.displayName" type="text" :placeholder="'请输入加价名称'"></el-input></el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="加价数量">
                        <el-row :gutter="20">
                            <el-col :span="18"><el-input v-model="formDataPopTs.priceAmount" type="number" :placeholder="'请输入加价数量'"></el-input></el-col>
                            <el-col :span="5">{{formDataPopTs.priceType===0 ? '元' : '%'}}</el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="" class="mgb0 mgl10">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-button @click="saveAddPriceTypeTsModi">保 存</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
                <el-table
                    v-loading="loading"
                    height="200"
                    :data="tsTableDataPopModi"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        min-width="120"
                        prop="displayName"
                        label="加价名称">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        label="类型">
                        <template slot-scope="scope">
                            <div slot="reference">
                                {{scope.row.priceType === 0 ? '固定值' : '比例'}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        label="数值">
                        <template slot-scope="scope">
                            <div slot="reference">
                                {{scope.row.priceAmount + (scope.row.priceType === 0 ? '元' : '%')}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作">
                        <template slot-scope="scope">
                            <i class="fa fa-trash-o" title="修改" @click="delTsPopModi(scope.row)"></i>
                            <i class="fa fa-edit" title="修改" @click="xgTsPopModi(scope.row)"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>

        <!-- 距离弹窗 -->
        <el-dialog
            :title="popTitleModiJl"
            :visible.sync="dialogVisibleModiJl"
            width="600px"
            top="0">
            <div class="pop_content">
                <el-form :model="formDataPopJl" label-width="120px">
                    <el-form-item label="">
                        <el-radio-group v-model="formDataPopJl.priceType">
                            <el-radio :label="0">固定</el-radio>
                            <el-radio :label="1">比例</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="起始距离">
                        <el-row :gutter="20">
                            <el-col :span="18"><el-input v-model="formDataPopJl.startDistance" type="number" :placeholder="'请输入起始距离'"></el-input></el-col>
                            <el-col :span="5">Km</el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="结束距离">
                        <el-row :gutter="20">
                            <el-col :span="18"><el-input v-model="formDataPopJl.endDistance" type="number" :placeholder="'请输入结束距离'"></el-input></el-col>
                            <el-col :span="5">Km</el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="加价数量">
                        <el-row :gutter="20">
                            <el-col :span="18"><el-input v-model="formDataPopJl.priceAmount" type="number" :placeholder="'请输入加价数量'"></el-input></el-col>
                            <el-col :span="5">{{formDataPopJl.priceType===0 ? '元' : '%'}}</el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="" class="mgb0 mgl10">
                        <el-row :gutter="20">
                            <el-col :span="24">
                                <el-button @click="saveAddPriceTypeJlModi">保 存</el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
                <el-table
                    v-loading="loading"
                    height="200"
                    :data="jlTableDataPopModi"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        min-width="120"
                        prop="startDistance"
                        label="起始">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        prop="endDistance"
                        label="结束">
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        label="类型">
                        <template slot-scope="scope">
                            <div slot="reference">
                                {{scope.row.priceType === 0 ? '固定值' : '比例'}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        min-width="120"
                        label="数值">
                        <template slot-scope="scope">
                            <div slot="reference">
                                {{scope.row.priceAmount + (scope.row.priceType === 0 ? '元' : '%')}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作">
                        <template slot-scope="scope">
                            <i class="fa fa-trash-o" title="删除" @click="delJlPopModi(scope.row)"></i>
                            <i class="fa fa-edit" title="修改" @click="xgJlPopModi(scope.row)"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { $http, $http2, dateFormat, deepClone } from '../../assets/js/utils'

export default {
    name: 'top',
    data () {
        return {
            loading: false,
            countyCode: [510000, 510100],
            areaOptions: [],
            props: {
                label: 'name',
                value: 'code',
                children: 'children'
            },
            selectProviderValue: '', // 搜索服务商
            selectAgentOptions: [], // 服务商选项,
            providerId: '', // 区域所属服务商
            providerName: '',
            selectServiceTypeValue: '', // 搜索服务类型
            servicesTypeOptions: [], // 服务类型选项
            searchKey: '',
            currentPage: 0,
            tableHeight: 0,
            tableData: [],
            activeValue: 1,
            inactiveValue: 0,
            pageSize: 10,
            total: 0,
            // 添加、修改
            curId: null,
            popTitle: '',
            formDataPop: {},
            servicesTypeOptionsPop: [], // 服务类型选项 弹窗
            priceType: [], // 收费类型
            activeName: 'first', // 加价类型选中选项卡
            zlTableDataPop: [],
            jlTableDataPop: [],
            yjTableDataPop: [],
            tsTableDataPop: [],
            dialogVisible: false,
            // 重量
            dialogVisibleModiZl: false,
            popTitleModiZl: '',
            formDataPopZl: {},
            zlTableDataPopModi: [],
            // 夜间
            dialogVisibleModiYj: false,
            popTitleModiYj: '',
            formDataPopYj: {},
            yjTableDataPopModi: [],
            // 特殊
            dialogVisibleModiTs: false,
            popTitleModiTs: '',
            formDataPopTs: {},
            tsTableDataPopModi: [],
            // 距离
            dialogVisibleModiJl: false,
            popTitleModiJl: '',
            formDataPopJl: {},
            jlTableDataPopModi: []
        }
    },
    created () {
        this.$nextTick(() => {
            // let h = this.$refs.tableCon.offsetHeight
            // this.tableHeight = h - 52
            let h = document.body.clientHeight
            this.tableHeight = h - 85 - 80 - 58 - 40 - 55
            this.providerId = JSON.parse(localStorage.userInfo).agentId
            this.getData(1)
            // this.getArea(0)
            // 获取当前服务商所属服务类型列表
            this.getServiceTypeOfProvider(this.providerId)
            // 获取当前服务商所属服务类型列表 (弹窗)
            this.getServiceTypeOfProviderPop(this.providerId)
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
    watch: {
        dialogVisible (curVal, oldVal) {
            if (!curVal) {
                this.curId = null
            }
        }
    },
    methods: {
        getData (page, serviceType, searchKey) {
            this.loading = true
            let param = {
                pageNum: page
            }
            if (serviceType !== undefined) {
                param.serviceCategoryId = serviceType
            }
            if (searchKey !== undefined) {
                param.paramName = searchKey
            }
            if (this.providerId !== '') {
                param.providerId = this.providerId
            }
            $http({
                url: '/agent/getScProviderPrice',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.tableData = res.data.list
                    console.log(this.tableData)
                    this.total = res.data.total
                } else {
                    console.log('未查询到相关服务商')
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
        // 搜索
        searchFun () {
            this.getData(1, this.selectServiceTypeValue, this.searchKey)
        },
        // 选择服务类型搜索
        getDataForServicesType (val) {
            this.getData(1, val, this.searchKey)
        },
        addFun () {
            this.popTitle = '添加'
            this.curId = null
            this.formDataPop = {
                // countyCodePop: [510000, 510100],
                priceType: 1,
                startWeight: 0,
                endWeight: 0,
                priceAmount: 0,

                priceTypeJl: 1,
                startDistance: 0,
                endDistance: 0,
                priceAmountJl: 0,

                priceTypeYj: 1,
                startTime: 0,
                endTime: 0,
                priceAmountYj: 0,

                priceTypeTs: 1,
                displayName: '',
                priceAmountTs: 0
            }
            this.dialogVisible = true
        },
        modify (item) {
            console.log('当前行', JSON.stringify(item))
            this.popTitle = '修改'
            this.formDataPop = deepClone(item)
            this.dialogVisible = true
            this.curId = item.id
            // this.formDataPop = {
            //     countyCodePop: [510000, 510100],
            //     priceType: 1,
            //     startWeight: 0,
            //     endWeight: 0,
            //     priceAmount: 0,
            //
            //     priceTypeJl: 1,
            //     startDistance: 0,
            //     endDistance: 0,
            //     priceAmountJl: 0,
            //
            //     priceTypeYj: 1,
            //     startTime: 0,
            //     endTime: 0,
            //     priceAmountYj: 0,
            //
            //     priceTypeTs: 1,
            //     displayName: '',
            //     priceAmountTs: 0
            // }
            this.getPriceType(item)
            // 读取出当前服务商所属地址
            // console.log(JSON.stringify(this.areaOptions))
        },

        // 选择地区后筛选服务商
        getAgentOfArea (val) {
            $http({
                url: '/searchAgentByMobileOrCounty',
                data: {
                    county: this.countyCode[2]
                }
            }).then(res => {
                console.log(res)
                if (res.code === 400) {
                    this.providerId = res.data.id
                    console.log(res.data.realname)
                    // 通过服务商获取服务类型列表
                    this.getServiceTypeOfProvider(res.data.id)
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
        // 通过服务商获取服务类型
        getServiceTypeOfProvider (val) {
            $http({
                url: '/agent/getServiceCategoryByProviderId',
                data: {
                    providerId: val
                }
            }).then(res => {
                console.log('服务类型：', res)
                if (res.code === 400) {
                    this.servicesTypeOptions = res.data
                } else {
                    this.servicesTypeOptions = []
                }
            }).catch(err => {
                this.servicesTypeOptions = []
                console.log(err)
            })
        },

        // 选择地区后筛选服务商 (弹窗)
        getAgentOfAreaPop (val) {
            $http({
                url: '/searchAgentByMobileOrCounty',
                data: {
                    county: this.formDataPop.countyCodePop[2]
                }
            }).then(res => {
                if (res.code === 400) {
                    // 通过服务商获取服务类型列表 (弹窗)
                    this.providerName = res.data.realname
                    this.getServiceTypeOfProviderPop(res.data.id)
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
        // 通过服务商获取服务类型 (弹窗)
        getServiceTypeOfProviderPop (val) {
            $http({
                url: '/agent/getServiceCategoryByProviderId',
                data: {
                    providerId: val
                }
            }).then(res => {
                if (res.code === 400) {
                    this.servicesTypeOptionsPop = res.data
                } else {
                    this.servicesTypeOptionsPop = []
                }
            }).catch(err => {
                this.servicesTypeOptionsPop = []
                console.log(err)
            })
        },

        // 获取收费类型 和 加价类型
        getPriceType (val) {
            let id = ''
            let serviceCategory = []
            if (this.curId !== null) {
                serviceCategory.push({
                    serviceCategoryId: val.serviceCategoryId
                })
                id = val.id
            } else {
                serviceCategory = this.servicesTypeOptionsPop.filter(item => {
                    return item.id === val
                })
                id = val
            }
            // 获取收费类型
            $http({
                url: '/agent/getScProviderPriceByScpPId',
                data: {
                    serviceCategoryProviderId: id
                }
            }).then(res => {
                console.log('收费类型：', res)
                if (res.code === 400) {
                    this.priceType = res.data
                } else if (res.msg) {
                    this.$message({
                        message: res.msg,
                        type: 'warning'
                    })
                }
            }).catch(err => {
                console.log(err)
            })
            // 获取重量加价
            this.getZlJj(id)
            // 获取距离加价
            this.getJlJj(id)
            // 获取夜间加价
            this.getYjJj(id)
            // 获取特殊加价
            this.getTsJj(id)
        },
        // 保存收费类型
        savePriceType () {
            // let scProviderPriceVos = []
            this.priceType.forEach(item => {
                if (item.providerPrice !== undefined && item.providerPrice !== '') {
                    // scProviderPriceVos.push({
                    //     id: this.formDataPop.id,
                    //     providerPrice: item.priceValue,
                    //     serviceCategoryPriceId: item.id,
                    //     serviceCategoryProviderId: this.formDataPop.serviceCategoryId
                    // })
                } else {
                    item.providerPrice = 0
                }
            })
            // console.log(scProviderPriceVos)
            // return
            $http2({
                url: '/agent/scProviderPriceUpdate',
                data: {
                    scProviderPriceVos: this.priceType
                }
            }).then(res => {
                if (res.code === 400) {
                    this.$message({
                        message: res.msg,
                        type: 'success'
                    })
                    this.dialogVisible = false
                    this.searchFun()
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
        // 选择加价类型tab
        handleTabClick (val) {
            console.log('切换加价类型：', val.label)
        },
        // 保存重量加价
        saveAddPriceTypeZl () {
            if (!this.formDataPop.selectServiceTypeValue) {
                this.$message({
                    message: '请选择服务',
                    type: 'warning'
                })
                return
            }
            let param = {
                serviceCategoryProviderId: this.formDataPop.selectServiceTypeValue,
                startWeight: this.formDataPop.startWeight,
                endWeight: this.formDataPop.endWeight,
                priceType: this.formDataPop.priceType,
                priceAmount: this.formDataPop.priceAmount,
                recordStatus: 1
            }
            $http({
                url: '/scProviderWeightRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.getZlJj(this.formDataPop.selectServiceTypeValue)
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
        // 保存加价距离
        saveAddPriceTypeJl () {
            if (!this.formDataPop.selectServiceTypeValue) {
                this.$message({
                    message: '请选择服务',
                    type: 'warning'
                })
                return
            }
            let param = {
                serviceCategoryProviderId: this.formDataPop.selectServiceTypeValue,
                startDistance: this.formDataPop.startDistance,
                endDistance: this.formDataPop.endDistance,
                priceType: this.formDataPop.priceTypeJl,
                priceAmount: this.formDataPop.priceAmountJl,
                recordStatus: 1
            }
            $http({
                url: '/scProviderDistanceRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    // 获取距离加价
                    this.getJlJj(this.formDataPop.selectServiceTypeValue)
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
        // 保存夜间加价
        saveAddPriceTypeYj () {
            if (!this.formDataPop.selectServiceTypeValue) {
                this.$message({
                    message: '请选择服务',
                    type: 'warning'
                })
                return
            }
            let param = {
                serviceCategoryProviderId: this.formDataPop.selectServiceTypeValue,
                startTime: this.formDataPop.startTime,
                endTime: this.formDataPop.endTime,
                priceType: this.formDataPop.priceTypeYj,
                priceAmount: this.formDataPop.priceAmountYj,
                recordStatus: 1
            }
            $http({
                url: '/scProviderTimeRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    // 获取夜间加价
                    this.getYjJj(this.formDataPop.selectServiceTypeValue)
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
        // 保存特殊加价
        saveAddPriceTypeTs () {
            if (!this.formDataPop.selectServiceTypeValue) {
                this.$message({
                    message: '请选择服务',
                    type: 'warning'
                })
                return
            }
            let param = {
                serviceCategoryProviderId: this.formDataPop.selectServiceTypeValue,
                displayName: this.formDataPop.displayName,
                priceType: this.formDataPop.priceTypeTs,
                priceAmount: this.formDataPop.priceAmountTs,
                recordStatus: 1
            }
            $http({
                url: '/scProviderSpecialRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    // 获取特殊加价
                    this.getTsJj(this.formDataPop.selectServiceTypeValue)
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
        // 删除重量加价
        delZlPop (item) {
            let param = {
                id: item.id,
                recordStatus: 0
            }
            $http({
                url: '/scProviderWeightRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.$message({
                        message: '删除重量加价成功',
                        type: 'success'
                    })
                    this.getZlJj(this.formDataPop.selectServiceTypeValue)
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
        // 删除距离加价
        delJlPop (item) {
            let param = {
                id: item.id,
                recordStatus: 0
            }
            $http({
                url: '/scProviderDistanceRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.$message({
                        message: '删除距离加价成功',
                        type: 'warning'
                    })
                    this.getJlJj(this.formDataPop.selectServiceTypeValue)
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
        // 删除夜间加价
        delYjPop (item) {
            let param = {
                id: item.id,
                recordStatus: 0
            }
            $http({
                url: '/scProviderTimeRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.$message({
                        message: '删除时间加价成功',
                        type: 'warning'
                    })
                    this.getYjJj(this.formDataPop.selectServiceTypeValue)
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
        // 删除特殊加价
        delTsPop (item) {
            let param = {
                id: item.id,
                recordStatus: 0
            }
            $http({
                url: '/scProviderSpecialRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.$message({
                        message: '删除特殊加价成功',
                        type: 'warning'
                    })
                    this.getTsJj(this.formDataPop.selectServiceTypeValue)
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
        // 获取重量加价
        getZlJj (id) {
            $http({
                url: '/getScProviderWeightRuleByScpId',
                data: {
                    serviceCategoryProviderId: id
                }
            }).then(res => {
                console.log('重量加价：', res)
                if (res.code === 400) {
                    this.zlTableDataPop = res.data.list.filter(item => item.recordStatus)
                } else {
                    this.zlTableDataPop = []
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 获取距离加价
        getJlJj (id) {
            $http({
                url: '/getProviderDistanceRuleByScpId',
                data: {
                    serviceCategoryProviderId: id
                }
            }).then(res => {
                console.log('距离加价：', res)
                if (res.code === 400) {
                    this.jlTableDataPop = res.data.list.filter(item => item.recordStatus)
                } else {
                    this.jlTableDataPop = []
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 获取夜间加价
        getYjJj (id) {
            $http({
                url: '/getScProviderTimeRuleByScpId',
                data: {
                    serviceCategoryProviderId: id
                }
            }).then(res => {
                console.log('夜间加价：', res)
                if (res.code === 400) {
                    this.yjTableDataPop = res.data.list.filter(item => item.recordStatus)
                } else {
                    this.yjTableDataPop = []
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 获取特殊加价
        getTsJj (id) {
            $http({
                url: '/getScProviderSpecialRuleByScpId',
                data: {
                    serviceCategoryProviderId: id
                }
            }).then(res => {
                console.log('特殊加价：', res)
                if (res.code === 400) {
                    this.tsTableDataPop = res.data.list.filter(item => item.recordStatus)
                } else {
                    this.tsTableDataPop = []
                }
            }).catch(err => {
                console.log(err)
            })
        },

        // 重量加价(修改弹窗)
        zongliangjiajia (row) {
            console.log('点击行：', JSON.stringify(row))
            this.popTitleModiZl = '重量加价修改'
            this.dialogVisibleModiZl = true
            this.formDataPopZl = {
                serviceCategoryProviderId: row.id,
                priceType: 1,
                startWeight: '',
                endWeight: '',
                priceAmount: '',
                recordStatus: 1
            }
            // 获取列表
            this.getZlJjModi(row.id)
        },
        // 重量加价 保存(修改弹窗)
        saveAddPriceTypeModiZl () {
            let param = {
                serviceCategoryProviderId: this.formDataPopZl.serviceCategoryProviderId,
                startWeight: this.formDataPopZl.startWeight,
                endWeight: this.formDataPopZl.endWeight,
                priceType: this.formDataPopZl.priceType,
                priceAmount: this.formDataPopZl.priceAmount,
                recordStatus: 1
            }
            if (this.formDataPopZl.hasOwnProperty('rowId')) {
                param.id = this.formDataPopZl.rowId
            }
            $http({
                url: '/scProviderWeightRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    // 获取列表
                    this.getZlJjModi(this.formDataPopZl.serviceCategoryProviderId)
                    this.formDataPopZl = {
                        priceType: 1,
                        serviceCategoryProviderId: this.formDataPopZl.serviceCategoryProviderId
                    }
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
        // 删除重量加价(修改弹窗)
        delZlPopModi (item) {
            let param = {
                id: item.id,
                recordStatus: 0
            }
            $http({
                url: '/scProviderWeightRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.$message({
                        message: '删除重量加价成功',
                        type: 'success'
                    })
                    // 获取列表
                    this.getZlJjModi(this.formDataPopZl.serviceCategoryProviderId)
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
        xgZlPopModi (item) {
            let _temp = deepClone(item)
            let _id = _temp.id
            delete _temp.id
            this.formDataPopZl = _temp
            this.formDataPopZl.rowId = _id
        },
        // 获取重量加价列表(修改弹窗)
        getZlJjModi (id) {
            $http({
                url: '/getScProviderWeightRuleByScpId',
                data: {
                    serviceCategoryProviderId: id
                }
            }).then(res => {
                console.log('重量加价列表：', res)
                if (res.code === 400) {
                    this.zlTableDataPopModi = res.data.list.filter(item => item.recordStatus)
                } else {
                    console.log(res.msg)
                    this.zlTableDataPopModi = []
                }
            }).catch(err => {
                console.log(err)
            })
        },

        // 距离加价
        julijiajia (row) {
            console.log('点击行：', JSON.stringify(row))
            this.popTitleModiJl = '距离加价修改'
            this.dialogVisibleModiJl = true
            this.formDataPopJl = {
                serviceCategoryProviderId: row.id,
                priceType: 1,
                startDistance: '',
                endDistance: '',
                priceAmount: '',
                recordStatus: 1
            }
            this.getJlJjModi(row.id)
        },
        // 距离加价 保存(修改弹窗)
        saveAddPriceTypeJlModi () {
            let param = {
                serviceCategoryProviderId: this.formDataPopJl.serviceCategoryProviderId,
                startDistance: this.formDataPopJl.startDistance,
                endDistance: this.formDataPopJl.endDistance,
                priceType: this.formDataPopJl.priceType,
                priceAmount: this.formDataPopJl.priceAmount,
                recordStatus: 1
            }
            if (this.formDataPopJl.hasOwnProperty('rowId')) {
                param.id = this.formDataPopJl.rowId
            }
            $http({
                url: '/scProviderDistanceRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.getJlJjModi(this.formDataPopJl.serviceCategoryProviderId)
                    this.formDataPopJl = {
                        priceType: 1,
                        serviceCategoryProviderId: this.formDataPopJl.serviceCategoryProviderId
                    }
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
        // 删除距离加价(修改弹窗)
        delJlPopModi (item) {
            let param = {
                id: item.id,
                recordStatus: 0
            }
            $http({
                url: '/scProviderDistanceRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.$message({
                        message: '删除距离加价成功',
                        type: 'success'
                    })
                    this.getJlJjModi(this.formDataPopJl.serviceCategoryProviderId)
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
        xgJlPopModi (item) {
            let _temp = deepClone(item)
            let _id = _temp.id
            delete _temp.id
            this.formDataPopJl = _temp
            this.formDataPopJl.rowId = _id
        },
        // 获取距离加价列表(修改弹窗)
        getJlJjModi (id) {
            $http({
                url: '/getProviderDistanceRuleByScpId',
                data: {
                    serviceCategoryProviderId: id
                }
            }).then(res => {
                if (res.code === 400) {
                    console.log('距离加价列表：', res)
                    this.jlTableDataPopModi = res.data.list.filter(item => item.recordStatus)
                } else {
                    console.log(res.msg)
                    this.jlTableDataPopModi = []
                }
            }).catch(err => {
                console.log(err)
            })
        },

        // 夜间加价(修改弹窗)
        yejianjiajia (row) {
            console.log('点击行：', JSON.stringify(row))
            this.popTitleModiYj = '时间加价修改'
            this.dialogVisibleModiYj = true
            this.formDataPopYj = {
                serviceCategoryProviderId: row.id,
                priceType: 1,
                startTime: '',
                endTime: '',
                priceAmount: '',
                recordStatus: 1
            }
            this.getYjJjModi(row.id)
        },
        // 夜间加价 保存(修改弹窗)
        saveAddPriceTypeYjModi () {
            let param = {
                serviceCategoryProviderId: this.formDataPopYj.serviceCategoryProviderId,
                startTime: this.formDataPopYj.startTime,
                endTime: this.formDataPopYj.endTime,
                priceType: this.formDataPopYj.priceType,
                priceAmount: this.formDataPopYj.priceAmount,
                recordStatus: 1
            }
            if (this.formDataPopYj.hasOwnProperty('rowId')) {
                param.id = this.formDataPopYj.rowId
            }
            $http({
                url: '/scProviderTimeRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.getYjJjModi(this.formDataPopYj.serviceCategoryProviderId)
                    this.formDataPopYj = {
                        priceType: 1,
                        serviceCategoryProviderId: this.formDataPopYj.serviceCategoryProviderId
                    }
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
        // 删除夜间加价(修改弹窗)
        delYjPopModi (item) {
            let param = {
                id: item.id,
                recordStatus: 0
            }
            $http({
                url: '/scProviderTimeRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.$message({
                        message: '删除时间加价成功',
                        type: 'success'
                    })
                    this.getYjJjModi(this.formDataPopYj.serviceCategoryProviderId)
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
        xgYjPopModi (item) {
            let _temp = deepClone(item)
            let _id = _temp.id
            delete _temp.id
            this.formDataPopYj = _temp
            this.formDataPopYj.rowId = _id
        },
        // 获取夜间加价列表(修改弹窗)
        getYjJjModi (id) {
            $http({
                url: '/getScProviderTimeRuleByScpId',
                data: {
                    serviceCategoryProviderId: id
                }
            }).then(res => {
                if (res.code === 400) {
                    console.log('夜间加价列表：', res)
                    this.yjTableDataPopModi = res.data.list.filter(item => item.recordStatus)
                } else {
                    console.log(res.msg)
                    this.yjTableDataPopModi = []
                }
            }).catch(err => {
                console.log(err)
            })
        },

        // 特殊加价
        teshujiajia (row) {
            console.log('点击行：', JSON.stringify(row))
            this.popTitleModiTs = '特殊加价修改'
            this.dialogVisibleModiTs = true
            this.formDataPopTs = {
                serviceCategoryProviderId: row.id,
                priceType: 1,
                displayName: '',
                priceAmount: '',
                recordStatus: 1
            }
            this.getTsJjModi(row.id)
        },
        // 特殊加价 保存(修改弹窗)
        saveAddPriceTypeTsModi () {
            let param = {
                serviceCategoryProviderId: this.formDataPopTs.serviceCategoryProviderId,
                displayName: this.formDataPopTs.displayName,
                priceType: this.formDataPopTs.priceType,
                priceAmount: this.formDataPopTs.priceAmount,
                recordStatus: 1
            }
            if (this.formDataPopTs.hasOwnProperty('rowId')) {
                param.id = this.formDataPopTs.rowId
            }
            $http({
                url: '/scProviderSpecialRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.getTsJjModi(this.formDataPopTs.serviceCategoryProviderId)
                    this.formDataPopTs = {
                        priceType: 1,
                        serviceCategoryProviderId: this.formDataPopTs.serviceCategoryProviderId
                    }
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
        // 删除特殊加价(修改弹窗)
        delTsPopModi (item) {
            let param = {
                id: item.id,
                recordStatus: 0
            }
            $http({
                url: '/scProviderSpecialRuleUpdate',
                data: param
            }).then(res => {
                if (res.code === 400) {
                    this.$message({
                        message: '删除特殊加价成功',
                        type: 'success'
                    })
                    this.getTsJjModi(this.formDataPopTs.serviceCategoryProviderId)
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
        xgTsPopModi (item) {
            let _temp = deepClone(item)
            let _id = _temp.id
            delete _temp.id
            this.formDataPopTs = _temp
            this.formDataPopTs.rowId = _id
        },
        // 获取特殊加价列表(修改弹窗)
        getTsJjModi (id) {
            $http({
                url: '/getScProviderSpecialRuleByScpId',
                data: {
                    serviceCategoryProviderId: id
                }
            }).then(res => {
                if (res.code === 400) {
                    console.log('特殊加价列表：', res)
                    this.tsTableDataPopModi = res.data.list.filter(item => item.recordStatus)
                } else {
                    console.log(res.msg)
                    this.tsTableDataPopModi = []
                }
            }).catch(err => {
                console.log(err)
            })
        },

        // 获取地域数据列表
        getArea (ParentCode) {
            $http({
                url: '/agent/searchAreaByParentCode',
                data: {
                    ParentCode: ParentCode
                }
            }).then(res => {
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
        // 选择地域，筛选子级地域
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
            // 没找到
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
        // 最后一层设置地名
        setArea (children, options, codeArr) {
            options.forEach(function (item) {
                if (codeArr[0] === item.code) {
                    if (codeArr.length === 1) {
                        item.children = children
                    } else if (codeArr.length === 2) {
                        item.children.forEach(function (sub) {
                            if (sub.code === codeArr[1]) {
                                sub.children = children
                            }
                        })
                    }
                }
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
    .order-prompt{
        color: #048992; text-decoration: underline; cursor: pointer;
    }
</style>
