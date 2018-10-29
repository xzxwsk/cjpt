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
                        <span>注册</span>
                    </div>
                    <el-form ref="regForm" :model="form" :rules="rules" label-width="80px">
                        <el-form-item label="用户名" prop="userName">
                            <el-input v-model="form.userName" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="pass">
                            <el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item label="确认密码" prop="confirmPsw">
                            <el-input type="password" v-model="form.confirmPsw" placeholder="请再次输入密码"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">注册</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-main>
        </el-container>
    </div>
</template>

<script>
export default {
    name: 'top',
    data () {
        return {
            logo: require('../../assets/images/logo.png'),
            form: {
                userName: '',
                password: '',
                confirmPsw: ''
            },
            rules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                pass: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ],
                confirmPsw: [
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请再次输入密码'))
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
        onSubmit () {
            this.$refs['regForm'].validate((valid) => {
                if (valid) {
                    this.$router.push('/')
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
.el-main{
    display: flex; flex-direction: column; justify-content: center;
}
.box-card {
    margin: 0 auto; width: 480px;
}
</style>
