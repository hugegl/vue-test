export default {
  data() {
    return {
      userLists: [],
      searchUsers: "",
      usersTotal: 0,
      curPage: 1,
      pagesize: 2,
      addUserShow: false,
      updateUserShow: false,
      showAssignRoles: false,
      UserForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      updateUserForm: {
        id: -1,
        username: "",
        email: "",
        mobile: ""
      },
      AssignRolesForm: {
        id: -1,
        rid: -1,
        username: "",
        RolesOptions: []
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 7, message: "长度在 3 到 7 个字符", trigger: "blur" }
        ]
      },
      updateRules: {
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "手机号格式不正确",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getAll();
  },
  methods: {
    //所有发送请求有关的方法
    //发送请求获取所有用户列表
    getAll(pagenum = 1) {
      this.$axios
        .get("/users", {
          params: {
            pagenum,
            pagesize: this.pagesize,
            query: this.searchUsers
          }
        })
        .then(res => {
          const { data, meta } = res.data;
          if (meta.status == 200) {
            this.userLists = data.users;
            this.usersTotal = data.total;
            this.curPage = data.pagenum;
          }
        });
    },
    //表单关闭触发的事件
    closeAddUserForm() {
      // 重置表单,需要在$nextTick里面写
      this.$nextTick(() => {
        this.$refs.addUserForm.resetFields();
      });
    },
    //发送添加请求
    sendAdd() {
      this.$axios.post("/users", this.UserForm).then(res => {
        const { data, meta } = res.data;
        if (meta.status == 201) {
          //关闭模态框
          this.addUserShow = false;
          this.$message({
            type: "success",
            message: meta.msg
          });
          //重新获取数据
          this.getAll(this.curPage);
        } else {
          this.$message({
            type: "info",
            message: meta.msg
          });
        }
      });
    },
    //删除用户,完成
    sendDeleteUser(id) {
      this.$axios.delete(`/users/${id}`).then(res => {
        const { data, meta } = res.data;
        if (meta.status == 200) {
          // 提示用户删除成功
          this.$message({
            type: "success",
            message: meta.msg
          });
          //删除当前数据中的参数,实现页面也删除的效果
          const index = this.userLists.findIndex(i => i.id === id);
          this.userLists.splice(index, 1);
          //因为当前分页是按照每页2条的来分的,所以判断当前页是不是这一页的最后一条,是的话,就获取当前页的前一页
          const totalpage = Math.ceil(this.userLists.length / this.pagesize);
          if (totalpage == 0) {
            this.getAll(--this.curPage);
          }
        }
      });
    },
    //发送修改用户请求,参数错误
    async sendupdateUser() {
      const res = await this.$axios.put(
        `/users/${this.updateUserForm.id}`,
        this.updateUserForm
      );
      const { data, meta } = res.data;
      if (meta.status === 200) {
        const arr = this.userLists.find(i => i.id === data.id);
        //将用户修改过的数据渲染到页面上
        arr.email = data.email;
        arr.mobile = data.mobile;
        //关闭模态框
        this.updateUserShow = false;
      }
    },
    //添加用户列表-模态框显示
    openAddUser() {
      this.addUserShow = true;
    },
    //点击模态框的确定,添加用户列表,确定发送请求
    addUserTrue() {
      this.$refs.addUserForm.validate(valid => {
        if (valid) {
          //发送请求
          this.sendAdd();
        } else {
          console.log("添加失败");
          return false;
        }
      });
    },
    //修改用户列表,点击模态框显示
    updateUser(row) {
      //显示模态框
      this.updateUserShow = true;
      //渲染当前数据
      for (let key in this.updateUserForm) {
        this.updateUserForm[key] = row[key];
      }
    },
    //点击模态框的确定,修改用户列表,确定发送请求
    updateUserTrue() {
      this.sendupdateUser();
    },
    //删除用户列表
    deleteUser(row) {
      //弹出确认框?
      this.$confirm("您是否确认删除该用户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.sendDeleteUser(row.id);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    //分页-改变页数
    changeCurrentPage(curPage) {
      this.getAll(curPage);
    },
    //搜索用户;未完成,搜索项来了不显示第一页,而是最后一页
    searchUser() {
      //将页码改成当前页
      //发送搜索请求
      this.getAll();
      this.curPage = 1;
      this.searchUsers = "";
    },
    //改变用户状态的事件
    async changeUserStatus(row) {
      //发送请求,改变用户状态
      const res = await this.$axios.put(
        `users/${row.id}/state/${row.mg_state}`
      );
      //请求发送完成提示用户修改状态
      this.$message({
        type: "success",
        message: res.data.meta.msg
      });
    },
    //分配角色触发事件
    async assignRoles(userId) {
      this.AssignRolesForm.id = userId;
      const arr = this.userLists.find(i => i.id === userId);
      this.AssignRolesForm.username = arr.username;
      this.showAssignRoles = true;
      //获取角色列表
      const res = await this.$axios.get(`/roles`);
      const { data, meta } = res.data;
      //将获取到的角色列表动态设置给当前页面的数据
      this.AssignRolesForm.RolesOptions = data;
      this.AssignRolesForm.rid = data[0].id;
    },
    //发送分配角色的请求
    async sendAssignRoles() {
      const { id, rid } = this.AssignRolesForm;
      const res = await this.$axios.put(`/users/${id}/role`, { rid });
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.showAssignRoles = false;
        this.$message({
          type: "success",
          message: meta.msg
        });
      } else {
        this.$message({
          type: "info",
          message: meta.msg
        });
      }
    }
  }
};
