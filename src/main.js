import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI, {Message} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/main.css'
import Axios from 'axios'
import VCharts from 'v-charts'
import moment from 'moment'
import Qs from 'qs'

Vue.use(ElementUI)
Vue.use(VCharts)


//配置axios请求头中的content-type为指定类型、     post编码方式，一般的表单提交默认以此方式提交
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//阻止启动生产消息，常用作指令。
Vue.config.productionTip = false
//定义vue全局变量$http  原:axios.post=现:this.$http.post
Vue.prototype.$http = Axios

Vue.prototype.$http.defaults.baseURL = "http://localhost:8080"

Vue.filter('formatDate', function (data) {
    if (data) {
        return moment(data).format('YYYY-MM-DD')
    }
})


// 路由权限拦截
router.beforeEach((to, from, next) => {
    let token = localStorage.getItem("token"); //验证登录状态
    let role = localStorage.getItem("role"); //验证登录状态

    //如果用户信息存在则往下执行。
    if (token) {
        //管理员
        if (role == 1) {
            if (to.path == "/" || to.path == "/login") {

                next('/Index')


            } else if (to.path == "/Info" ||to.path == "/Index" || to.path == "/User" || to.path == "/Singer" || to.path == "/SongList") {
                next();

            } else {
                ElementUI.Message({
                        showClose: true,
                        Message: '你无权访问',
                        type: 'error'
                    }
                )
                next('/Index')

            }


        } else {//用户
            if (to.path == "/" || to.path == "/login") {

                next('/Index1')


            } else if (to.path == "/Info" ||to.path == "/Index1" || to.path == "/Userr" || to.path == "/Singerr" || to.path == "/SongListt") {
                next();

            } else {
                ElementUI.Message({
                        showClose: true,
                        message: '你无权访问',
                        type: 'error'
                    }
                )

                next('/Index1')

            }
        }


    } else {
        if (to.path == "/" || to.path == "/login" || to.path == "/Register") {
            next();
        } else {
            // //如果用户token不存在则跳转到login页面
            next('/login')
        }
    }
});

//
// // 路由权限拦截
// router.beforeEach((to, from, next) => {
//     let token = localStorage.getItem("token"); //验证登录状态
//     let role = localStorage.getItem("role"); //验证登录状态
//
//     //如果用户信息存在则往下执行。
//     if (token) {
//
//         if (to.path == "/" || to.path == "/login") {
//             if (role == 1) {
//                 next('/Index')
//
//             } else {
//                 next('/Index1')
//
//             }
//
//         } else if (to.path == "/Index" || to.path == "/User" || to.path == "/Singer" || to.path == "/SongList") {
//             if (role == 1) {
//
//                 next();
//
//             } else {
//                 ElementUI.Message({
//                         showClose: true,
//                         Message: '你无权访问',
//                         type: 'error'
//                     }
//                 )
//                 next('/Index')
//
//             }
//
//
//         } else if (to.path == "/Index1" || to.path == "/Userr" || to.path == "/Singerr" || to.path == "/SongListt") {
//             if (role == 2) {
//
//                 next();
//
//             } else {
//                 ElementUI.Message({
//                         showClose: true,
//                         Message: '你无权访问',
//                         type: 'error'
//                     }
//                 )
//                 next('/Index1')
//
//             }
//
//         }
//
//     } else {
//         if (to.path == "/" || to.path == "/login" || to.path == "/Register") {
//             next();
//         } else {
//             // //如果用户token不存在则跳转到login页面
//             next('/login')
//         }
//     }
// });


new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
