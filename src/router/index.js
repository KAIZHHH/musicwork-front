import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login'
import Register from "../views/Register";
import Index from "../admin/Index";
import InfoPage from "../views/InfoPage";
import UserPage from "../admin/UserPage";
import SingerPage from "../admin/SingerPage";
import SongListPage from "../admin/SongListPage";

import Index1 from "../user/Index1";
import UserPage1 from "../user/UserPage1";
import SingerPage1 from "../user/SingerPage1";
import SongListPage1 from "../user/SongListPage1";

Vue.use(VueRouter)


const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
    return originalPush.call(this, location).catch(err => err)
}


export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: Login
        },
        {
            path: '/Login',
            component: Login
        }, {
            path: '/Register',
            component: Register
        },
        {
            path: '/Index',
            component: Index,
            children: [
                {
                    path: '/Info', //路径
                    component: InfoPage //name:InfoPage 对应 上面 import的name 对应到 所放在的前端的地址
                },
                {
                    path: '/User',
                    component: UserPage
                },
                {
                    path: '/Singer',
                    component: SingerPage
                },
                {
                    path: '/SongList',
                    component: SongListPage
                }
            ]
        },
        {
            path: '/Index1',
            component: Index1,
            children: [
                {
                    path: '/Info', //路径
                    component: InfoPage //name:InfoPage 对应 上面 import的name 对应到 所放在的前端的地址
                },
                {
                    path: '/Userr',
                    component: UserPage1
                },
                {
                    path: '/Singerr',
                    component: SingerPage1
                },
                {
                    path: '/SongListt',
                    component: SongListPage1
                }
            ]
        }
    ]
})
