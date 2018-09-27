<template>
  <el-container class="home-warpper">
    <el-header>
      <el-row type="flex">
        <el-col :span="8">
          <div class="home-logo">
            <img src="@/assets/logo.png" alt="logo">
          </div>
        </el-col>
        <el-col :span="8">
          <div class="tittle">电商后台管理系统</div>
        </el-col>
        <el-col :span="8">
          <div class="welcome">
            <span>欢迎上海前端25期星曜会员</span>
            <a href="#" @click.prevent="logout">退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu :router='true' :unique-opened="true" :default-active="$route.path" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
          <!-- 一级菜单 -->
          <el-submenu :index="''+menu1.id" v-for="menu1 in firstList" :key="menu1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{menu1.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- 通过数据获取到的munu2.path不是以/开头的,如果不加前缀,问题1:无法跟上面的动态路径匹配 ,无法实现刷新当前页面,对应菜单展示的效果-->
            <!-- <el-menu-item-group> -->
            <el-menu-item :index="'/'+menu2.path" v-for="menu2 in menu1.children " :key="menu2.id">
              <i class="el-icon-menu"></i>
              <span>{{menu2.authName}}</span>
            </el-menu-item>
            <!-- </el-menu-item-group> -->
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      firstList: []
    };
  },
  methods: {
    logout() {
      this.$confirm("您确定退出吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$router.push("/login");
        localStorage.removeItem("token");
      });
    },
    //获取左侧菜单数据
    async getaside() {
      const res = await this.$axios.get("/menus");
      const { data } = res.data;
      this.firstList = data;
    }
  },
  created() {
    this.getaside();
  }
};
</script>

<style lang="less" scope>
.home-warpper {
  height: 100%;
  .el-header {
    background-color: #b3c1cd;
    color: #333;
    line-height: 60px;
    padding: 0;
    .home-logo {
      img {
        display: block;
      }
    }
    .tittle {
      color: #fff;
      font-size: 32px;
      font-weight: 700;
    }
    .welcome {
      text-align: right;
      padding-right: 20px;
      font-weight: 700;
      a {
        color: #b07a17;
        text-decoration: none;
        margin-left: 10px;
        font-weight: 700;
      }
    }
  }

  .el-aside {
    background-color: rgb(84, 92, 100);
    text-align: left;
    line-height: 200px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
}
</style>
