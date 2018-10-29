<template>
    <div class="login">
        <el-container>
            <el-header height="auto">
                <div class="top">
                    <img :src="logo" class="logo">
                </div>
            </el-header>
            <el-main>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>登录</span>
                    </div>
                    <el-form ref="form" :model="form" :rules="rules" label-width="80px">
                        <el-form-item label="用户名" prop="userName">
                            <el-input v-model="form.userName" placeholder="请输入用户名" @keyup.enter.native="onSubmit"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input type="password" v-model="form.password" placeholder="请输入密码" @keyup.enter.native="onSubmit"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">登录</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
    name: 'top',
    data () {
        return {
            logo: require('../../assets/images/logo.png'),
            form: {
                userName: '',
                password: ''
            },
            rules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        ...mapMutations(['setUserAgentLevel']),
        onSubmit () {
            this.$refs['form'].validate(valid => {
                if (valid) {
                    this.$post.post('/agent/memberLogin', this.form) // 打包时删除/proxy
                        .then(res => {
                            if (res.data.code === 400) {
                                localStorage.authStatus = true
                                localStorage.userInfo = JSON.stringify(res.data.data)
                                if (res.data.data.level === 1) {
                                    this.setUserAgentLevel(true)
                                } else {
                                    this.setUserAgentLevel(false)
                                }
                                this.$router.push('/')
                            } else if (res.data.code === 1001) {
                                this.$message({
                                    message: '账号或者密码错误',
                                    type: 'error',
                                    duration: 1000
                                })
                            } else if (res.data.code === 800) {
                                this.$message({
                                    message: '您已登录,请勿重复登录',
                                    type: 'error',
                                    duration: 1000
                                })
                                this.$router.push('/')
                            }
                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.top{
    padding: 20px 0; background: #009e9e;
    .logo{margin: 0 0 0 20px; height: 45px; cursor: pointer;}
}
.login{
    height: 100%;
}
.el-container{
    height: 100%;
    .el-main{
        flex: 1;
    }
}
.el-header{
    padding: 0;
}
.el-main{
    display: flex; flex-direction: column; justify-content: center;
}
.box-card {
    margin: 0 auto; width: 480px;
}
</style>
