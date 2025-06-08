import type { RouteRecordRaw } from "vue-router";
import Home from "../pages/home/Home.vue";

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
]

export default routes;