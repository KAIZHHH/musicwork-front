<template>
    <div class="app">
        <el-form :model="user" :rules="rules" ref="user" label-width="100px" class="register-container">

            <el-form-item label="账号" prop="username">
                <el-input v-model="user.username" placeholder="请输入账号"></el-input>
            </el-form-item>

            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="user.password" placeholder="请输入密码"></el-input>
            </el-form-item>

            <el-form-item label="性别" prop="sex">
                <el-select v-model="user.sex" @change="selectsex" placeholder="请选择性别">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>


            <!--            手机号-->
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="user.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>

            <!--            地区-->
            <el-form-item label="地区" prop="region">
                <el-select v-model="user.region " @change="selectregion" placeholder="请选择地区">
                    <el-option-group
                            v-for="group in regions"
                            :key="group.label"
                            :label="group.label">
                        <el-option
                                v-for="item in group.regions"
                                :key="item.value"
                                :value="item.value">
                            <span style="float: right">{{ item.label }}</span>
                            <span style="float: left; color: #8492a6; font-size: 13px">{{ item.value }}</span>
                        </el-option>
                    </el-option-group>
                </el-select>
            </el-form-item>

            <el-form-item label="个性签名" prop="signature">
                <el-input type="textarea" placeholder="请输入个性签名"
                          :rows="2"
                          v-model="user.signature"></el-input>
            </el-form-item>


            <el-form-item>
                <el-button type="primary" @click="submit('user')">注册</el-button>
                <el-button @click="reset('user')">重置</el-button>
                <br>
                已有账号？
                <el-link type="primary" @click="login">点我登录</el-link>
            </el-form-item>

        </el-form>
    </div>
</template>
<script>

    export default {
        name: 'Register',
        data() {
            return {
                value: '',
                //性别
                options: [{
                    value: 1,
                    label: '男性'
                }, {
                    value: 2,
                    label: '女性'
                }],
                //地区
                regions: [{
                    label: '热门城市',
                    regions: [{
                        label: 'Shanghai',
                        value: '上海'
                    }, {
                        label: 'Beijing',
                        value: '北京'
                    }]
                }, {
                    label: '城市名',
                    regions: [{
                        label: 'Chengdu',
                        value: '成都'
                    }, {
                        label: 'Shenzhen',
                        value: '深圳'
                    }, {
                        label: 'Guangzhou',
                        value: '广州'
                    }, {
                        label: 'Changsha',

                        value: '长沙'
                    }]
                }],
                user: {
                    username: '',
                    password: '',
                    sex: '',
                    signature: '',
                    region: '',
                    phone: ''
                },
                rules: {
                    username: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ],
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'change'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号', trigger: 'blur'},
                    ],
                    region: [
                        {required: true, message: '请输入地区', trigger: 'blur'},
                    ],
                    signature: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ]

                }
            };

        },
        methods: {
            selectsex(sex) {
                this.user.sex = sex
                // console.log(this.user);

            },
            selectregion(region) {
                this.user.region = region
                // alert(this.user.region);

            },
            submit(user) {

                this.$refs[user].validate((valid) => {
                    if (valid) {
                        this.$http.post("/user/register", this.user).then(res => {
                            if (res.data.result == "success") {
                                this.$notify({
                                    title: "成功",
                                    message: "注册成功！欢迎新用户" + res.data.data.username,
                                    type: "success"
                                })
                                this.$router.push("/")


                            } else if (res.data.result == "fail") {
                                this.$notify({
                                    title: "失败",
                                    message: res.data.message,
                                    type: "error"
                                })
                            }
                        })
                    }
                })
            },
            reset(user) {
                this.$refs[user].resetFields();
            },
            login() {
                this.$router.push("/")
            }
        }

    }
</script>
<style lang="less" scoped>

    .register-container {
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
