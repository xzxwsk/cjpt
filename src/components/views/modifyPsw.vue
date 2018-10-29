<template>
    <div class="login">
        <el-container>
            <!--<el-header height="auto">-->
                <!--<div class="top">-->
                    <!--<img :src="logo" class="logo">-->
                <!--</div>-->
            <!--</el-header>-->
            <el-main>
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>修改密码</span>
                    </div>
                    <el-form ref="regForm" :model="form" :rules="rules" label-width="100px">
                        <el-form-item label="新密码" prop="password">
                            <el-input type="password" v-model="form.password" placeholder="请输入新密码" @keyup.enter.native="onSubmit"></el-input>
                        </el-form-item>
                        <el-form-item label="确认新密码" prop="confirmPsw">
                            <el-input type="password" v-model="form.confirmPsw" placeholder="请再次输入新密码" @keyup.enter.native="onSubmit"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">确定</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-main>
        </el-container>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import {$http} from '../../assets/js/utils'

export default {
    name: 'top',
    data () {
        return {
            logo: require('../../assets/images/logo.png'),
            form: {
                password: '',
                confirmPsw: ''
            },
            rules: {
                password: [
                    { required: true, message: '请输入新密码', trigger: 'blur' }
                ],
                confirmPsw: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请再次输入新密码'))
                            } else if (value !== this.form.password) {
                                callback(new Error('两次输入密码不一致!'))
                            } else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        ...mapMutations(['switchMenu']),
        onSubmit () {
            this.$refs['regForm'].validate((valid) => {
                if (valid) {
                    $http({
                        url: '/agent/editPassword',
                        data: {
                            username: localStorage.userInfo.username,
                            password: this.form.password
                        }
                    }).then(res => {
                        if (res.code === 400) {
                            this.$message({
                                message: '修改密码成功',
                                type: 'success',
                                duration: 1000
                            })
                            this.logout()
                        } else {
                            console.log(res.msg)
                            this.$message({
                                message: '修改密码失败',
                                type: 'error',
                                duration: 1000
                            })
                        }
                    }).catch(err => {
                        console.log(err)
                        this.$message({
                            message: '修改密码失败',
                            type: 'error',
                            duration: 1000
                        })
                    })
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        logout () {
            this.switchMenu('')
            $http({
                url: '/agent/memberExit'
            }).then(res => {
                localStorage.authStatus = false
                this.$router.push('/login')
            }).catch(err => {
                console.log(err)
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
.el-main{
    display: flex; flex-direction: column; justify-content: center;
}
.box-card {
    margin: 0 auto; width: 480px;
}
</style>
