import Vue from "vue";
import Router from "vue-router";
import Login from "@/components/login/Login";
const Home = () => import("@/components/home/Home");
const Users = () => import("@/components/users/Users");
const Roles = () => import("@/components/roles/Roles");
const Rights = () => import("@/components/rights/Rights");
const Goods = () => import("@/components/goods/Goods");
const GoodsAdd = () => import("@/components/goods/GoodsAdd");
const Categories = () => import("@/components/categories/Categories");

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/login",
      name: "login",
      component: Login
    },
    {
      path: "/home",
      component: Home,
      children: [
        {
          path: "/users", //加`/`,路径为'/子级';如果不加`/`,路径为'/父级/子级'
          component: Users
        },
        {
          path: "/roles",
          component: Roles
        },
        {
          path: "/rights",
          component: Rights
        },
        {
          path: "/goods/:id?", //?是可以传参,也可以不传参
          component: Goods
        },
        {
          path: "/goods-add",
          component: GoodsAdd
          // meta: { keepAlive: true }
        },
        {
          path: "/categories",
          component: Categories
        }
      ]
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (to.path == "/login") {
    return next();
  }
  const token = localStorage.getItem("token");
  if (token) {
    next();
  } else {
    next("/login");
  }
});
export default router;
