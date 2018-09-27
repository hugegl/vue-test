<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="common-tittle">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索和添加-->
    <el-row :gutter="20">
      <el-col :span="6">
        <el-input placeholder="请输入内容" v-model="queryStr">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="2">
        <el-button type="success" plain @click="goodsAdd">添加分类</el-button>
      </el-col>
    </el-row>
    <!-- 角色列表主体 -->
    <el-table :data="AllGoods" style="width: 100%">
      <el-table-column label="#" width="150px" type="index">
      </el-table-column>
      <el-table-column label="商品名称" prop="goods_name">
      </el-table-column>
      <el-table-column label="商品价格" prop="goods_price">
      </el-table-column>
      <el-table-column label="商品重量" prop="goods_weight">
      </el-table-column>
      <el-table-column label="创建时间" prop="upd_time">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页栏 -->
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="pagesize" @current-change="changeCurPage" :current-page.sync="curPage">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      AllGoods: [],
      curPage: -1,
      queryStr: "",
      total: -1,
      pagesize: 10
    };
  },
  created() {
    //自己的方法,使用字符串拼接,有bug,第一页无法刷新
    // const last = location.hash.lastIndexOf("/");
    // if (last) {
    //   const page = +location.hash.slice(last + 1);
    //   this.getAllGoods(page);
    // } else {
    //   this.getAllGoods();
    // }
    //老师的方法是用$route.params.id
    this.getAllGoods(this.$route.params.id);
  },
  methods: {
    //获取当前页的数据
    async getAllGoods(pagenum = 1) {
      const res = await this.$axios.get(`/goods`, {
        params: { pagenum, pagesize: this.pagesize, query: this.queryStr }
      });
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.AllGoods = data.goods;
        this.curPage = +data.pagenum;
        this.total = data.total;
      }
    },
    changeCurPage(page) {
      // this.getAllGoods(page);
      this.curPage = page;
      this.$router.push(`/goods/${page}`);
    },
    goodsAdd() {
      this.$router.push("/goods-add");
    }
  },
  watch: {
    $route(to, from) {
      this.getAllGoods(to.params.id);
    }
  }
};
</script>

<style>
</style>
