<template>
    <div class="main-box">
        <topBar></topBar>
        <div class="main-down">
            <menuBar></menuBar>
            <div class="main">
                <router-view name="main"></router-view>
            </div>
        </div>
    </div>
    <!--<el-container>-->
        <!--<el-header height="85px"><topBar></topBar></el-header>-->
        <!--<el-container>-->
            <!--<el-aside width="220px"><menuBar></menuBar></el-aside>-->
            <!--<el-main class="main"><router-view name="main"></router-view></el-main>-->
        <!--</el-container>-->
    <!--</el-container>-->
</template>

<script>
import topBar from '@/components/top'
import menuBar from '@/components/menu'

export default {
    name: 'mainBox',
    data () {
        return {}
    },
    components: {
        topBar,
        menuBar
    }
}
</script>
