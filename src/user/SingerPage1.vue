<template>
    <div class="table">

        <div class="container">
            <div class="handle-box">

                <el-input v-model="queryInfo.query" placeholder="请输入歌手名称" class="handle-input"
                          @keyup.enter.native="getData">
                    <el-button slot="append" icon="el-icon-search" @click="getData"></el-button>
                </el-input>

            </div>
        </div>

        <!--        表格-->
        <!-- 已经将table里的内容 绑定给users-->            <!--勾选框-->
        <el-table border style="width: 100%" height="680" stripe :data="singers"
                  ref="userTable">

            <!--         歌手图片   -->
            <el-table-column label="歌手图片" width="150px" align="center">
                <template slot-scope="scope">

                    <!-- 显示照片 -->
                    <div class="user-img">
                        <el-image :src="HOST+scope.row.pic" :preview-src-list="[HOST+scope.row.pic]"></el-image>
                    </div>

                    <!-- 更换头像 -->

                    <el-button size="mini" round icon="el-icon-picture-outline" disabled>更新头像</el-button>

                </template>
            </el-table-column>


            <el-table-column prop="name" label="歌手" width="120px" align="center"></el-table-column>

            <el-table-column label="性别" align="center" width="50px">
                <template slot-scope="scope">
                    <!--                    根据数据库存储的数字[123]回显到前端转为文字：男女组合-->
                    {{ changeSex(scope.row.sex) }}
                </template>
            </el-table-column>
            <el-table-column label="生日" width="100px" align="center">
                <template slot-scope="scope">
                    {{scope.row.birth | formatDate }}
                </template>
            </el-table-column>

            <el-table-column prop="location" label="地区" width="100px" align="center"></el-table-column>
            <el-table-column prop="location" label="地区" width="100px" align="center"></el-table-column>

            <el-table-column label="简介" align="center">
                <template slot-scope="scope">
                    <p style="height: 100px;overflow: auto">{{ scope.row.introduction }}</p>
                </template>
            </el-table-column>


            <!--            操作-->
            <el-table-column label="操作" align="center" width="170px">
                <template slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" round size="small" disabled>
                        编辑
                    </el-button>
                    <el-popconfirm
                            icon="el-icon-info"
                            icon-color="red"
                    >
                        <el-button disabled slot="reference" type="danger" icon="el-icon-delete" round size="small">删除
                        </el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>


        </el-table>


    </div>
</template>

<script>

    export default {
        name: "SingerPage1",
        data() {
            return {

                singers: [],
                queryInfo: {
                    query: '',
                    pageNum: 1,
                    pageSize: 10
                },
                total: 0,

                HOST: this.$http.defaults.baseURL,
            }
        },
        methods: {

            getData() {
                this.$http.post("/singer/get", this.queryInfo).then(res => {//res==pageInfo
                    this.singers = res.data.list
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
                if (value == 3) {
                    return '组合'
                }

            },


        },
        created() {
            this.getData()
        },
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


    .paging {
        display: flex;
        justify-content: center;
        margin-top: 15px;
    }
</style>
