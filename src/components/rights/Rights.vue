<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="common-tittle">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表主体 -->
    <el-table :data="AllRights" style="width: 100%">
      <el-table-column label="#" width="150px" type="index">
      </el-table-column>
      <el-table-column label="角色名称" prop="authName">
      </el-table-column>
      <el-table-column label="描述" prop="path">
      </el-table-column>
      <el-table-column label="层级">
        <template slot-scope="props">
          <p v-show="props.row.level==='0'">一级</p>
          <p v-show="props.row.level==='1'">二级</p>
          <p v-show="props.row.level==='2'">三级</p>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      AllRights: []
    };
  },
  created() {
    this.getAllRights();
  },
  methods: {
    async getAllRights() {
      const res = await this.$axios.get(`/rights/list `);
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.AllRights = data;
      }
    }
  }
};
</script>

<style>
</style>
