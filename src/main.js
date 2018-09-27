// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
//引入公共样式
import "@/assets/index.css";
//找到router文件夹,默认打开 index.js;可以省略不写
import router from "./router";
//引入element-ui 组件库
import ElementUI from "element-ui";
//引入 element-ui 样式;已配置 cdn 环境,不用引入
// import "element-ui/lib/theme-chalk/index.css";
//引入 axios
import axios from "axios";
//设置默认路径
axios.defaults.baseURL = "http://localhost:8888/api/private/v1";
//设置拦截器
//添加一个请求拦截器
axios.interceptors.request.use(function(config) {
  //在请求发送之前将headers放到请求头前,注意,需要在给登录页前拦截
  // console.log(config.url); //打印出来是不带baseURL的路径
  if (!config.url.endsWith("login")) {
    config.headers["Authorization"] = localStorage.getItem("token");
  }

  return config;
});

//添加一个返回拦截器
axios.interceptors.response.use(function(response) {
  //对返回的数据进行一些处理
  if (response.data.meta.status === 401) {
    router.push("/login");
  }

  return response;
});
//将axios挂载到vue原型上
Vue.prototype.$axios = axios;
Vue.use(ElementUI);
//开发的时候生产环境提示,关闭
Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  //注册app组件为当前实例的局部组件,然后,才可以在template中使用该组件
  components: { App },
  template: "<App/>"
});
