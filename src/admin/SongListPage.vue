<template>
    <div class="table">

        <div class="container">
            <div class="handle-box">
                <el-button type="danger" @click="delSome">批量删除</el-button>
                <el-input v-model="queryInfo.query" placeholder="请输入歌单名称" class="handle-input"
                          @keyup.enter.native="getData">
                    <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
                </el-input>
                <el-button type="primary" @click="centerDialogVisible = true">添加歌单</el-button>
            </div>
        </div>

        <el-table border style="width: 100%" height="680" stripe :data="songLists"
                  @selection-change="handleSelectionChange" ref="songListTable">
            <el-table-column type="selection" width="40px"></el-table-column>
            <el-table-column label="歌单图片" width="150px" align="center">
                <template slot-scope="scope">
                    <div class="songList-img">
                        <el-image :src="HOST+scope.row.pic" :preview-src-list="[HOST+scope.row.pic]"></el-image>
                    </div>
                    <el-upload :action="uploadUrl(scope.row.songListId)" :before-upload="beforeAvatorUpload"
                               :on-success="handleAvatorSuccess" accept=".jpeg,.png,.jpg" ref="uploadPic">
                        <el-button size="mini" round icon="el-icon-picture-outline">更新图片</el-button>
                    </el-upload>
                </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" width="120px" align="center"></el-table-column>
            <el-table-column prop="style" label="风格" width="120px" align="center"></el-table-column>
            <el-table-column label="简介" align="center">
                <template slot-scope="scope">
                    <p style="height: 100px;overflow: auto">{{ scope.row.introduction }}</p>
                </template>
            </el-table-column>

            <el-table-column label="操作" align="center" width="180px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" round size="small"
                               @click="handleEdit(scope.row.songListId)">
                        编辑
                    </el-button>

                    <el-popconfirm
                            icon="el-icon-info"
                            icon-color="red"
                            :title="'确定要删除[ '+scope.row.title+' ]歌单?'"
                            @confirm="handleDelete(scope.row)"
                    >
                        <el-button slot="reference" type="danger" icon="el-icon-delete" round
                                   size="small">删除
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>


        <el-dialog title="添加歌单" :visible.sync="centerDialogVisible" width="400px" center="center" @close="cancelAdd">
            <el-form :model="registerForm" :rules="registerFormRule" ref="registerFormRef" label-width="65px"
                     @keyup.enter.native="addSongList">
                <el-form-item prop="title" label="标题" size="mini">
                    <el-input v-model="registerForm.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item prop="style" label="风格" size="mini">
                    <el-select v-model="registerForm.style" placeholder="风格">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="introduction" label="简介" size="mini">
                    <el-input v-model="registerForm.introduction" placeholder="简介" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="cancelAdd">取 消</el-button>
                <el-button type="primary" @click="addSongList">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="编辑歌单" :visible.sync="editDialogVisible" width="400px" center="center">
            <el-form :model="editForm" :rules="registerFormRule" ref="editFormRef" label-width="65px"
                     @keyup.enter.native="editSongList">
                <el-form-item prop="title" label="标题" size="mini">
                    <el-input v-model="editForm.title" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item prop="style" label="风格" size="mini">
                    <el-select v-model="editForm.style" placeholder="风格">
                        <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="introduction" label="简介" size="mini">
                    <el-input v-model="editForm.introduction" placeholder="简介" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editSongList">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {me} from '../assets/js/me.js'

    export default {
        name: "SongListPage",
        data() {
            return {
                centerDialogVisible: false,
                editDialogVisible: false,
                registerForm: {
                    title: '',
                    style: '',
                    pic: '',
                    introduction: '',
                },
                editForm: {},
                options: [
                    {value: '华语', label: '华语'},
                    {value: '粤语', label: '粤语'},
                    {value: 'BGM', label: 'BGM'},
                ],
                songLists: [],
                queryInfo: {
                    query: '',
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,
                registerFormRule: {
                    title: [
                        {required: true, message: '标题为必填项', trigger: 'blur'},
                    ],
                    style: [
                        {required: true, message: '风格为必填项', trigger: 'blur'},
                    ],
                    introduction: [
                        {required: true, message: '简介为必填项', trigger: 'blur'},
                    ]
                },
                HOST: this.$http.defaults.baseURL,
                multipleSelection: [],  // 哪些选项打勾
            }
        },
        methods: {
            addSongList() {
                this.$refs.registerFormRef.validate(valid => {
                    if (valid) {
                        // let birth = this.registerForm.birth;
                        // this.registerForm.birth = birth.getFullYear()+'-'+(birth.getMonth()+1)+'-'+birth.getDate()
                        // this.registerForm.pic = '/img/songListPic/hhh.jpg'
                        this.$http.post("songList/add", this.registerForm).then(res => {
                            if (res.data.result == "success") {
                                this.$notify({
                                    title: "成功",
                                    message: res.data.message,
                                    type: "success"
                                })
                                this.getData()
                                this.$refs.registerFormRef.resetFields()
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
                    this.centerDialogVisible = false
                })
            },
            cancelAdd() {
                this.$refs.registerFormRef.resetFields()
                this.centerDialogVisible = false
            },
            getData() {
                this.$http.post("songList/get", this.queryInfo).then(res => {
                    this.songLists = res.data.list
                    this.total = res.data.total
                    this.queryInfo.pageNum = res.data.pageNum
                    if (this.songLists != null && this.songLists.length == 0 && this.queryInfo.pageNum != 1) {
                        this.queryInfo.pageNum = 1
                        this.getData()
                    }
                })
            },

            uploadUrl(id) {
                return this.HOST + '/songList/updateSongListPic/' + id;
            },
            beforeAvatorUpload(file) {
                me.methods.beforeAvatorUpload(file, this)
            },
            handleAvatorSuccess(res) {
                me.methods.handleFileSuccess(res, this)
            },

            handleEdit(id) {
                this.editDialogVisible = true
                this.$http.get("songList/getOne/" + id).then(res => {
                    if (res.data.result == "success") {
                        this.editForm = res.data.message
                    }
                })
            },
            editSongList() {
                this.$refs.editFormRef.validate(valid => {
                    if (valid) {
                        // let birth = this.editForm.birth;
                        // this.editForm.birth = birth.getFullYear()+'-'+(birth.getMonth()+1)+'-'+birth.getDate()
                        this.$http.put("songList/update", this.editForm).then(res => {
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
            handleDelete(item) {
                if (item.songCount != 0) {
                    this.$notify({
                        title: "错误",
                        message: "此歌单里有歌曲，不可删除",
                        type: "error"
                    })
                    return;
                }
                this.$http.delete("songList/delete/" + item.songListId).then(res => {
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
                        ids.push(item.songListId)
                    }
                    this.$http.post("songList/delSome", {"ids": ids}).then(res => {
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
                    name: "ListSongPage",
                    params: {id: id}
                })
            },
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

    .songList-img {
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
