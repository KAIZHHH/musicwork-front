<template>
    <div class="index">

        <div style="text-align: center">
            <span class="name">Music管理系统</span>
        </div>


        <el-container class="index-container">


            <el-header>

        <span style="float: left">
         Welcome to the Music ManagerSystem!!!
        </span>

                <span style="float: right">

       <img src="../assets/img/user.jpg">

        <el-dropdown>
            <el-link type="primary" :underline="false">{{username}}</el-link>
            <i class="el-icon-arrow-down el-icon--right"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                  <span @click="logout">退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>

</span>
            </el-header>


            <el-container>

                <el-aside width="180px">
                    <el-menu
                            class="sidebar-el-menu"
                            background-color="#B3C0D1"
                            text-color="#000000"
                            active-text-color="#20a0ff"
                            router>

                        <ul>
                            <template>
                                <el-menu-item
                                        v-for="item in items" :index="item.path" :key="item.path"
                                        @click="saveActivePath(item.path)">
                                    <!-- 遍历items里所有item    绑定转向的路径 -->
                                    <i :class="item.icon"></i>
                                    <!-- 图标 -->
                                    <span slot="title">{{ item.title }}</span>
                                    <!--内容文字-->
                                </el-menu-item>
                            </template>
                        </ul>
                    </el-menu>
                </el-aside>


                <el-main>
                    <router-view/>
                </el-main>

            </el-container>

        </el-container>
    </div>
</template>

<script>
    export default {
        name: "Index",
        created() {
            this.username = localStorage.getItem("username")
        },
        methods: {
            // logout() {
            //     this.$confirm('确认退出?', '提示', {
            //         confirmButtonText: '确定',
            //         cancelButtonText: '取消',
            //         type: 'warning'
            //     }).then(() => {
            //         this.$message({
            //             type: 'success',
            //             message: '退出成功!'
            //         });
            //
            //         localStorage.removeItem("username");
            //         localStorage.removeItem("token");
            //         this.$router.replace("/");
            //     }).catch(() => {
            //         this.$message({
            //             type: 'info',
            //             message: '已取消退出'
            //         });
            //     });
            // },
            logout() {
                this.$confirm('确认退出?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$http.get("user/logout").then(res => {
                        if (res.data.result == "success") {
                            this.$message({
                                type: 'success',
                                message: '退出成功!'
                            })
                            localStorage.removeItem("username");
                            localStorage.removeItem("token");
                            this.$router.replace("/");
                        } else {
                            this.$message({
                                type: 'error',
                                message: '退出失败!'
                            })
                            this.$router.push("/index")
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消退出'
                    });
                });
            },

            saveActivePath(val) {
                localStorage.setItem("active", val);
                this.active = val;
            }
        },
        data() {
            return {
                items: [
                    {
                        icon: "el-icon-s-data",
                        path: "/Info",
                        title: "系统首页",
                    },
                    {
                        icon: "el-icon-s-custom",
                        path: "/User",
                        title: "用户管理",
                    },
                    {
                        icon: "el-icon-user-solid",
                        path: "/Singer",
                        title: "歌手管理",
                    },
                    {
                        icon: "el-icon-s-order",
                        path: "/SongList",
                        title: "歌单管理",
                    },
                ],
            }
        }
    }
</script>

<style lang="less" scoped>
    .name {
        color: #333;
        font: italic bold 50px arial, sans-serif;
    }

    .index {
        padding: 0px;
        margin: 0px;
        height: 100%;
    }

    .el-container {
        height: 100%;
    }

    .el-header {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
    }

    .el-menu {

        border-right: 0px;
        text-align: left;
    }


    img {
        vertical-align: middle;
        margin-top: -5px;
        width: 40px;
        height: 40px;
        border-radius: 40px;
    }


    .el-main {
        background-color: #E9EEF3;
        color: #333;
        /*text-align: center;*/
    }


    .logout {
        position: absolute;
        right: 10px;
        margin-top: 10px;
    }


</style>
