<template>
    <div class="app">
        <el-form :model="user" :rules="rules" ref="user" label-width="100px" class="login-container">
            <el-form-item label="账号" prop="username">
                <el-input v-model="user.username" prefix-icon="el-icon-user-solid" placeholder="请输入账号"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="user.password" type="password" prefix-icon="el-icon-lock"
                          placeholder="请输入密码"></el-input>
            </el-form-item>

            <el-form-item label="验证码" prop="code">
                <el-input v-model="user.code" prefix-icon="el-icon-warning"
                          placeholder="请输入验证码"></el-input>
                <el-link :underline="false" style="float: right" type="primary" @click="resetForm('user')">点我重置
                </el-link>
            </el-form-item>

            <div style="margin-left:60px">

                <img id="num" :src="url" @click="getSrc"/>
                <br>

                <div style="margin-top: 10px">
                    <el-button type="primary" @click="submitForm('user')">点我登录</el-button>
                </div>
            </div>
            <br>

            <el-checkbox style="float: left;margin-left: 100px" v-model="checked">记住我</el-checkbox>
            <el-link :underline="false" style="float: right;margin-right: 50px" type="primary" @click="register">点我注册
            </el-link>


        </el-form>

    </div>

</template>

<script>
    export default {
        name: "Login",
//页面加载调用获取cookie值

        data() {
            return {
                user: {
                    username: '',
                    password: '',
                    code: '',

                },
                url: '',
                checked: false,
                rules: {
                    username: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        {min: 1, max: 30, message: '请输入账号', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {min: 1, max: 30, message: '请输入密码', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入验证码', trigger: 'blur'}
                    ]
                }


            }
        },
        created() {
            //获取验证码
            this.getSrc();

            // 在页面加载时从cookie获取登录信息
            let username = this.getCookie("username")
            let password = this.getCookie("password")
            // 如果存在赋值给表单，并且将记住密码勾选
            if (username) {
                this.user.username = username
                this.user.password = password
                this.checked = true
            }
        },
        methods: {

            //获取验证码的
            getSrc() {
                var _this = this;
                this.$http.get("/user/getImage?time=" + Math.random()).then(res => {
                    _this.url = res.data;

                });
            },

            submitForm(user) {

                this.$refs[user].validate((valid) => {
                    if (valid) {
                        const _this = this
                        this.$http.post("/user/login?code=" + this.user.code, this.user).then(res => {
                            if (res.data.result == "success") {
                                this.$message({
                                    title: "成功",
                                    message: "登录成功！欢迎" + res.data.data.username,
                                    type: "success"
                                })


                                // 前端localStorage存放JWT_TOKEN、username
                                window.localStorage.setItem("token", res.data.data.token)
                                window.localStorage.setItem("username", res.data.data.username)
                                window.localStorage.setItem("role", res.data.data.role)

                                // 储存登录信息
                                this.setUserInfo()

                                let role = localStorage.getItem("role")
                                //管理员身份
                                if (role == 2) {
                                    this.$router.push("/Index1")


                                } else {//用户
                                    this.$router.push("/Index")

                                }

                            } else if (res.data.result == "fail") {
                                this.$message({
                                    title: "失败",
                                    message: res.data.message,
                                    type: "error"
                                })
                            }
                        });
                    } else {
                        return null;
                    }
                })
            },
            // 储存表单信息
            setUserInfo: function () {
                // 判断用户是否勾选记住密码，如果勾选，向cookie中储存登录信息，
                // 如果没有勾选，储存的信息为空
                if (this.checked) {
                    this.setCookie("username", this.user.username, 7)
                    this.setCookie("password", this.user.password, 7)
                } else {
                    this.setCookie("username", "", 0)
                    this.setCookie("password", "", 0)
                }
            },
            // 获取cookie
            getCookie: function (key) {
                if (document.cookie.length > 0) {
                    var start = document.cookie.indexOf(key + '=')
                    if (start !== -1) {
                        start = start + key.length + 1
                        var end = document.cookie.indexOf(';', start)
                        if (end === -1) end = document.cookie.length
                        return unescape(document.cookie.substring(start, end))
                    }
                }
                return ''
            },
            // 保存cookie
            setCookie: function (cName, value, expiredays) {
                var exdate = new Date()
                exdate.setDate(exdate.getDate() + expiredays)
                document.cookie = cName + '=' + decodeURIComponent(value) +
                    ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString())
            },


            //重置
            resetForm(user) {
                this.$refs[user].resetFields();

                this.user.username = null
                this.user.password = null
                this.checked = false
            },

            //注册
            register() {
                this.$router.push("/Register")
            }
        }
    }
</script>
<style lang="less" scoped>

    .login-container {
        padding-top: 200px;
        width: 400px;
        margin: 0 auto;
        text-align: center;
    }

    .app {
        position: relative;
        background: url("../assets/img/background.jpg");
        background-attachment: fixed;
        background-position: center;
        background-size: cover;
        width: 100%;
        height: 100%;
    }

    .role {
        width: 300px;
    }
</style>
