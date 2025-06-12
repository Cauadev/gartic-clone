import type { RouteRecordRaw } from "vue-router";
import Home from "../pages/home/Home.vue";
import Home2 from "../pages/home/Home2.vue";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path:'/Home2',
        name:'Home2',
        component: Home2
    }
]

export default routes;