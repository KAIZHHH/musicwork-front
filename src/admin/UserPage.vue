<template>
    <div class="table">

        <!--        批量删除 和  查询-->
        <div class="container">
            <div class="handle-box">
                <el-button type="danger" @click="delSome">批量删除</el-button>

                <el-input v-model="queryInfo.query" placeholder="请输入用户名称" class="handle-input"
                          @keyup.enter.native="getData">
                    <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
                </el-input>

            </div>
        </div>

        <!--        表格-->
        <!-- 已经将table里的内容 绑定给users-->            <!--勾选框-->
        <el-table border style="width: 100%" height="680" stripe :data="users" @selection-change="handleSelectionChange"
                  ref="userTable">
            <!--             出现一整列勾选的☑️箭头 -->
            <el-table-column type="selection" width="40px"></el-table-column>

            <!--         用户头像   -->
            <el-table-column label="用户头像" width="150px" align="center">
                <template slot-scope="scope">

                    <!-- 显示照片 -->
                    <div class="user-img">
                        <el-image :src="HOST+scope.row.pic" :preview-src-list="[HOST+scope.row.pic]"></el-image>
                    </div>

                    <!-- 更换头像 -->

                    <el-upload :action="uploadUrl(scope.row.id)" :before-upload="beforeAvatorUpload"
                               :on-success="handleAvatorSuccess" accept=".jpeg,.png,.jpg" ref="uploadPic">
                        <el-button size="mini" round icon="el-icon-picture-outline">更新头像</el-button>
                    </el-upload>

                </template>
            </el-table-column>


            <!--            用户名-->
            <el-table-column prop="username" label="用户名" width="120px" align="center"></el-table-column>
            <!--            性别-->
            <el-table-column label="性别" align="center" width="50px">
                <template slot-scope="scope">
                    <!--                    根据数据库存储的数字[0123]回显到前端转为文字：男女-->
                    {{ changeSex(scope.row.sex) }}
                </template>
            </el-table-column>


            <!--            手机号-->
            <el-table-column prop="phone" label="手机号" width="120px" align="center"></el-table-column>
            <!--            地区-->
            <el-table-column prop="region" label="地区" width="100px" align="center"></el-table-column>

            <!--            签名-->
            <el-table-column label="签名" align="center">
                <template slot-scope="scope">
                    <p style="height: 100px;overflow: auto">{{ scope.row.signature }}</p>
                </template>
            </el-table-column>


            <!--            操作-->
            <el-table-column label="操作" align="center" width="170px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" round size="small" @click="handleEdit(scope.row.id)">
                        编辑
                    </el-button>
                    <el-popconfirm
                            confirm-bgutton-text='好的'
                            cancel-button-text='不用了'
                            icon="el-icon-info"
                            icon-color="red"
                            :title="'确定要删除' +scope.row.username+'?'"
                            @confirm="handleDelete(scope.row.id)"
                    >
                        <el-button slot="reference" type="danger" icon="el-icon-delete" round size="small">删除
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>


        </el-table>


        <!--        编辑用户-->
        <el-dialog title="编辑用户" :visible.sync="editDialogVisible" width="400px" center="center">
            <el-form :model="editForm" :rules="registerFormRule" ref="editFormRef" label-width="65px"
                     @keyup.enter.native="editUser">

                <el-form-item prop="username" label="账号" size="mini">
                    <el-input v-model="editForm.username" placeholder="账号"></el-input>
                </el-form-item>

                <el-form-item prop="sex" label="性别" size="mini">
                    <el-radio-group v-model="editForm.sex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="2">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="phone" label="手机号" size="mini">
                    <el-input v-model="editForm.phone"
                              placeholder="手机号"></el-input>
                </el-form-item>


                <el-form-item prop="region" label="地区" size="mini">
                    <el-input v-model="editForm.region" placeholder="地区"></el-input>
                </el-form-item>
                <el-form-item prop="signature" label="签名" size="mini">
                    <el-input v-model="editForm.signature" placeholder="签名" type="textarea"></el-input>
                </el-form-item>
            </el-form>

            <span slot="footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>


        </el-dialog>


    </div>
</template>

<script>
    import {me} from '../assets/js/me.js'

    export default {
        name: "UserPage",
        data() {
            return {
                centerDialogVisible: false,
                editDialogVisible: false,
                registerForm: {
                    username: '',
                    sex: '',
                    phoneNum: '',
                    pic: '',
                    region: '',
                    signature: '',
                },
                editForm: {},
                users: [],
                queryInfo: {
                    query: '',
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                registerFormRule: {
                    username: [
                        {required: true, message: '账户为必填项', trigger: 'blur'},
                    ],
                    password: [
                        {required: true, message: '密码为必填项', trigger: 'blur'},
                    ],
                    sex: [
                        {required: true, message: '性别为必填项', trigger: 'blur'},
                    ],
                    phone: [
                        {required: true, message: '手机为必填项', trigger: 'blur'},
                    ],
                    region: [
                        {required: true, message: '地区为必填项', trigger: 'blur'},
                    ],
                    signature: [
                        {required: true, message: '个性签名为必填项', trigger: 'blur'},
                    ]
                },

                HOST: this.$http.defaults.baseURL,
                multipleSelection: [],  // 哪些选项打勾
            }
        },
        methods: {

            getData() {
                this.$http.post("/user/get", this.queryInfo).then(res => {//res==pageInfo
                    this.users = res.data.list
                    this.total = res.data.total
                    this.queryInfo.pageNum = res.data.pageNum
                    if (this.users != null && this.users.length === 0 && this.queryInfo.pageNum !== 1) {
                        this.queryInfo.pageNum = 1
                        this.getData()
                    }
                })
            },
            changeSex(value) {
                if (value == 1) {
                    return '男'
                }
                if (value == 2) {
                    return '女'
                }

            },
            uploadUrl(id) {
                return this.HOST + '/user/updateUserAvator/' + id;
            },
            beforeAvatorUpload(file) {
                me.methods.beforeAvatorUpload(file, this)
            },
            handleAvatorSuccess(res) {
                me.methods.handleFileSuccess(res, this)
            },
            // 改变最大显示数触发动作
            handleSizeChange(newPageSize) {
                this.queryInfo.pageSize = newPageSize;
                this.getData();
            },
            // 当前页触发动作
            handleCurrentChange(newPageNum) {
                this.queryInfo.pageNum = newPageNum;
                this.getData();
            },
            handleEdit(id) {
                this.editDialogVisible = true
                this.$http.get("user/getOne/" + id).then(res => {
                    if (res.data.result == "success") {
                        this.editForm = res.data.message
                    }
                })
            },
            editUser() {
                this.$refs.editFormRef.validate(valid => {
                    if (valid) {
                        this.$http.put("user/update", this.editForm).then(res => {
                            if (res.data.result == "success") {
                                this.$notify({
                                    title: "成功",
                                    message: res.data.message,
                                    type: "success"
                                })
                                this.getData()
                            } else {
                                this.$notify({
                                    title: "错误",
                                    message: res.data.message,
                                    type: "error"
                                })
                            }
                        })
                    } else {
                        return;
                    }
                    this.editDialogVisible = false
                })
            },
            handleDelete(id) {
                this.$http.delete("user/delete/" + id).then(res => {
                    if (res.data.result == "success") {
                        this.$notify({
                            title: "成功",
                            message: res.data.message,
                            type: "success"
                        })
                        this.getData()
                    } else {
                        this.$notify({
                            title: "错误",
                            message: res.data.message,
                            type: "error"
                        })
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delSome() {
                if (this.multipleSelection.length == 0) {
                    this.$alert("请选择要批量删除的选项", "提示", {
                        type: "info ",
                        confirmButtonText: "确定"
                    })
                    return;
                }
                this.$confirm('确定要批量删除吗？', {
                    type: "warning"
                }).then(ok => {
                    let ids = []
                    for (let item of this.multipleSelection) {
                        ids.push(item.id)
                    }                        //传了个map键值对 键:ids 值:ids【把上面放进去】
                    this.$http.post("user/delSome", {"ids": ids}).then(res => {
                        if (res.data.result == "success") {
                            this.$notify({
                                title: "成功",
                                message: res.data.message,
                                type: "success"
                            })
                            this.getData()
                        } else {
                            this.$notify({
                                title: "错误",
                                message: res.data.message,
                                type: "error"
                            })
                        }
                    })
                    this.multipleSelection = []
                }).catch(no => {

                })
            },
            songEdit(id) {
                this.$router.push({
                    name: "SongPage",
                    params: {id: id}
                })
            },
            checkHaveSong(item) {
                if (item.songCount != 0) {
                    return true
                } else {
                    return false
                }
            },
            canSelect(row) {
                let flag = !this.checkHaveSong(row);
                return flag
            }
        },
        created() {
            this.getData()
        },
        watch: {}
    }
</script>

<style scoped lang="less">
    .handle-box {
        margin-bottom: 20px;
    }

    .user-img {
        width: 100%;
        height: 87px;
        border-radius: 5px;
        margin-bottom: 5px;
        overflow: hidden;

        .el-image {
            width: 100%;
            height: 100%;
        }
    }

    .handle-input {
        width: 500px;
        margin-right: 20px;
        margin-left: 20px;
    }


</style>
