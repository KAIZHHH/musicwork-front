<template>
    <div>
        <el-row :gutter="20" class="mgb20">
            <el-col :span="6">
                <el-card>
                    <div class="grid-content">
                        <div class="grid-cont-center">
                            <div class="grid-num" style="color: #87cefa">{{userCount}}</div>
                            <div>用户总数</div>
                        </div>
                    </div>
                </el-card>
            </el-col>


            <el-col :span="6">
                <el-card>
                    <div class="grid-content">
                        <div class="grid-cont-center">
                            <div class="grid-num" style="color: #ffc0cb">{{songCount}}</div>
                            <div>歌曲总数</div>
                        </div>
                    </div>
                </el-card>
            </el-col>


            <el-col :span="6">
                <el-card>
                    <div class="grid-content">
                        <div class="grid-cont-center">
                            <div class="grid-num" style="color: #90ee90">{{singerCount}}</div>
                            <div>歌手数量</div>
                        </div>
                    </div>
                </el-card>
            </el-col>


            <el-col :span="6">
                <el-card>
                    <div class="grid-content">
                        <div class="grid-cont-center">
                            <div class="grid-num" style="color: #ffc66d">{{songListCount}}</div>
                            <div>歌单总数</div>
                        </div>
                    </div>
                </el-card>
            </el-col>


        </el-row>


        <el-row :gutter="20" class="mgb20">

            <el-col :span="12">
                <el-card>

                    <div slot="header" class="clearfix">
                        <span style="font-size: 18px; color: darkgray">用户性别比例</span>
                    </div>

                    <!-- 饼状图 -->
                    <ve-pie :data="userSex" :theme="options"></ve-pie>
                    <!--             userSex: {                              options: {
                                     columns: ['性别','总数'],                color: ['#87cefa','#ffc0cb']
                                     rows: [
                                         {'性别': '男','总数': 0},
                                         {'性别': '女','总数': 0},
                                     ]
                                 }, -->

                </el-card>
            </el-col>

            <el-col :span="12">
                <el-card>

                    <div slot="header" class="clearfix">
                        <span style="font-size: 18px; color: darkgray">歌曲类型分布</span>
                    </div>
                    <!-- 树状图 -->
                    <ve-histogram :data="songStyle"></ve-histogram>

                </el-card>
            </el-col>
        </el-row>
        <el-row class="mgb20">
            <el-col :span="24">
                <el-card>
                    <div slot="header" class="clearfix">
                        <span style="font-size: 18px; color: darkgray">歌手性别比例</span>
                    </div>
                    <!-- 饼状图 -->
                    <ve-pie :data="singerSex"></ve-pie>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "infoPage",
        data() {
            return {
                userCount: '', //用户总数
                songCount: '', //歌曲总数
                singerCount: '', //歌手数量
                songListCount: '',//歌单数量

                // 用户性别的数据
                userSex: {
                    columns: ['性别', '总数'],
                    rows: [
                        {'性别': '男', '总数': 0},
                        {'性别': '女', '总数': 0},
                    ]
                },
                // 歌曲类型的数据
                songStyle: {
                    columns: ['风格', '总数'],
                    rows: [
                        {'风格': '华语', '总数': 0},
                        {'风格': '粤语', '总数': 0},
                        {'风格': 'BGM', '总数': 0},
                    ]
                },
                // 歌手性别比例的数据
                singerSex: {
                    columns: ['性别', '总数'],
                    rows: [
                        {'性别': '女', '总数': ''},
                        {'性别': '男', '总数': ''},
                        {'性别': '组合', '总数': ''},
                    ]
                },
                options: {
                    color: ['#87cefa', '#ffc0cb']
                }
            }
        },
        created() {
            this.getAllCount();
        },

        methods: {
            getAllCount() {
                this.$http.get("/info/getAllCount").then(res => {
                    this.userCount = res.data.message.userCount;
                    this.songCount = res.data.message.songCount;
                    this.singerCount = res.data.message.singerCount;
                    this.songListCount = res.data.message.songListCount;

                    this.userSex.rows[0]["总数"] = res.data.message.boysCount;
                    this.userSex.rows[1]["总数"] = res.data.message.girlsCount;

                    this.songStyle.rows[0]["总数"] = res.data.message.style.huayu;
                    this.songStyle.rows[1]["总数"] = res.data.message.style.yueyu;
                    this.songStyle.rows[2]["总数"] = res.data.message.style.BGM;

                    this.singerSex.rows[0]["总数"] = res.data.message.singerSex.women;
                    this.singerSex.rows[1]["总数"] = res.data.message.singerSex.men;
                    this.singerSex.rows[2]["总数"] = res.data.message.singerSex.team;
                })
            }
        }
    }
</script>
<style lang="less" scoped>

    .grid-content {
        display: flex;
        align-items: center;
        height: 50px;
    }

    .grid-cont-center {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: darkgray;
    }

    .grid-num {
        font-size: 26px;
        font-width: bold;
    }
</style>
