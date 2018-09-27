<template>
  <div class="roles-warpper">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="common-tittle">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 角色列表主体 -->
    <el-table :data="getAllRolesList" style="width: 100%">
      <el-table-column type="expand">
        <!-- 展开列表的插槽 -->
        <template slot-scope="props">
          <!-- 判断是否有权限,如果没有展示无权限页面 -->
          <el-row v-if="props.row.children.length===0">
            <el-col>暂无权限，请分配</el-col>
          </el-row>
          <!-- 如果有,展示有权限的页面 -->
          <!-- 一级菜单 -->
          <el-row v-else type="flex" class="roles-desh" v-for="tag1 in props.row.children" :key="tag1.id">
            <el-col :span="4">
              <el-tag closable @close="close(props.row.id,tag1.id)">
                {{tag1.authName}}
              </el-tag>
            </el-col>
            <!-- 二级菜单 -->
            <el-col :span="20">
              <!-- 二级菜单每个为一行 -->
              <el-row v-for="tag2 in tag1.children" :key="tag2.id">
                <el-col :span="4">
                  <el-tag closable type="success" @close="close(props.row.id,tag2.id)">
                    {{tag2.authName}}
                  </el-tag>
                </el-col>
                <!-- 三级菜单 -->
                <el-col :span="20" class="roles-waring">
                  <el-tag closable type="warning" v-for="tag3 in tag2.children" :key="tag3.id" @close="close(props.row.id,tag3.id)">
                    {{tag3.authName}}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column label="#" width="150px" type="index">
      </el-table-column>
      <el-table-column label="角色名称" prop="roleName">
      </el-table-column>
      <el-table-column label="描述" prop="roleDesc">
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" plain size="mini" @click="updateRoles(scope.row.id)"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini" @click="deleteRoles(scope.row.id)"></el-button>
          <el-button type="success" icon="el-icon-check" plain size="mini" @click="updateRightsTree(scope.row.id)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑弹出的对话框 -->
    <el-dialog title="收货地址" :visible.sync="showUpdateRolesForm">
      <el-form :model="updateRolesForm">
        <el-form-item label="角色名称" label-width="200px">
          <el-input v-model="updateRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" label-width="200px">
          <el-input v-model="updateRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showUpdateRolesForm = false">取 消</el-button>
        <el-button type="primary" @click="sendUpdateRoles">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色弹出的对话框 -->
    <el-dialog title="分配权限" :visible.sync="showRightsTree">
      <el-tree :data="AllRightsTree" show-checkbox node-key="id" :props="AllRightsTreeProps" :default-expand-all="true" ref="RightsTree">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showRightsTree = false">取 消</el-button>
        <el-button type="primary" @click="SureupdateRightsTree">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //全部的角色数据
      getAllRolesList: [],
      //编辑弹出层是否显示
      showUpdateRolesForm: false,
      //编辑弹出层的表格角色数据
      updateRolesForm: {
        roleName: "",
        roleDesc: "",
        id: -1
      },
      //所有权限列表显示框是否显示
      showRightsTree: false,
      //所有权限列表数据
      AllRightsTree: [],
      //树形图对应的字段设置数据
      AllRightsTreeProps: {
        children: "children",
        label: "authName"
      },
      //将修改角色的id存起来
      updateRightsTreeId: -1
    };
  },
  created() {
    this.getAllRoles();
    this.getAllRights();
  },
  methods: {
    //获取所有权限列表
    async getAllRights() {
      const res = await this.$axios.get(`rights/tree`);
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.AllRightsTree = data;
      }
    },
    //获取所有角色列表
    async getAllRoles() {
      const res = await this.$axios.get("/roles");
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.getAllRolesList = data;
      }
    },
    //点击关闭按钮触发事件,获取id,发送数据给后台,删除对应的角色和权限
    async close(roleId, rightId) {
      const res = await this.$axios.delete(
        `/roles/${roleId}/rights/${rightId}`
      );
      const { data, meta } = res.data;
      if (meta.status === 200) {
        const index = this.getAllRolesList.findIndex(
          item => item.id === roleId
        );
        this.getAllRolesList[index].children = data;
      }
    },
    //点击删除按钮触发的事件
    deleteRoles(id) {
      //弹出对话框,确认是否删除
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        //点击确认删除,发送请求,删除对应id的角色
        .then(async () => {
          const res = await this.$axios.delete(`/roles/${id}`);
          const { meta } = res.data;
          if (meta.status === 200) {
            //删除页面中的数据
            const index = this.getAllRolesList.findIndex(i => i.id === id);
            this.getAllRolesList.splice(index, 1);
            //弹出删除成功提示
            this.$message({
              type: "success",
              message: "删除成功!"
            });
          }
        })
        //点击取消,弹出提示
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //点击修改按钮触发的事件
    updateRoles(id) {
      //显示编辑对话框
      this.showUpdateRolesForm = true;
      //将当前的id存到数据中
      this.updateRolesForm.id = id;
      //根据当前id,查询现有的数据,将当前id的值渲染到弹出的对话框中
      const arr = this.getAllRolesList.find(i => i.id === id);
      this.updateRolesForm.roleDesc = arr.roleDesc;
      this.updateRolesForm.roleName = arr.roleName;
    },
    //点击确认,发送修改数据触发事件
    async sendUpdateRoles() {
      //发送修改的数据给服务端,修改数据库的数据
      const res = await this.$axios.put(
        `/roles/${this.updateRolesForm.id}`,
        this.updateRolesForm
      );
      const { data, meta } = res.data;
      //根据修改状态,关闭对话框
      if (meta.status === 200) {
        this.showUpdateRolesForm = false;
        //根据当前id,查询现有的数据,把当前id对应的数据改掉
        const index = this.getAllRolesList.findIndex(
          i => i.id === this.updateRolesForm.id
        );
        this.getAllRolesList[index].roleDesc = data.roleDesc;
        this.getAllRolesList[index].roleName = data.roleName;
      }
    },
    //点击分配角色权限触发的事件
    updateRightsTree(id) {
      //将确认修改的id存起来
      this.updateRightsTreeId = id;
      this.showRightsTree = true;
      //根据id获取当前角色的权限,让权限树中对应的权限展示
      //根据id,获取到所有三级菜单权限的id值,存在数组中
      const item = this.getAllRolesList.find(i => i.id === id);
      const arrIds = [];
      item.children.forEach(item1 => {
        item1.children.forEach(item2 => {
          item2.children.forEach(item3 => {
            arrIds.push(item3.id);
          });
        });
      });
      this.$nextTick(() => {
        this.$refs.RightsTree.setCheckedKeys(arrIds);
      });
    },
    //点击分配角色权限,确认修改事件
    SureupdateRightsTree() {
      this.showRightsTree = false;
      // this.updateRightsTreeId;修改的角色的id
      //获取到需要修改的id值
      this.$nextTick(async () => {
        const updateIds1 = this.$refs.RightsTree.getCheckedKeys();
        const updateIds2 = this.$refs.RightsTree.getHalfCheckedKeys();
        const updateIds = [...updateIds1, ...updateIds2].join(",");
        //发送修改请求
        const res = await this.$axios.post(
          `/roles/${this.updateRightsTreeId}/rights`,
          { rids: updateIds }
        );
        const { meta } = res.data;
        if (meta.status === 200) {
          this.getAllRoles();
        }
      });
    }
  }
};
</script>

<style scope>
.roles-desh {
  padding: 10px;
  border-bottom: 1px dashed #ccc;
}
</style>
