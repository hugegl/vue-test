<template>
  <el-row type="flex" class="row-bg login-wrapper" justify="center" align="middle">
    <el-col :span="6" class="login-content">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="100px" label-position="top">
        <el-form-item label="请输入用户名" prop="username">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="请输入密码" prop="password">
          <el-input v-model="loginForm.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">登录</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>

</template>
<script>
export default {
  data() {
    return {
      loginForm: {
        username: "admin",
        password: "123456"
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到7 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 7, message: "长度在 3 到 7 个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    async islogin() {
      const res = await this.$axios.post("/login", this.loginForm);
      const { data, meta } = res.data;
      if (meta.status === 200) {
        localStorage.setItem("token", data.token);
        this.$router.push("/home");
        this.$message({ type: "success", message: meta.msg, duration: 500 });
      } else {
        this.$message({ type: "info", message: meta.msg, duration: 500 });
      }
    },
    submitForm() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.islogin();
        } else {
          this.$message({ type: "info", message: "用户名密码错误" });
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs.loginForm.resetFields();
    }
  },
  watch: {
    $route(to, from) {
      console.log(to);
    }
  }
};
</script>
<style scope lang="less">
.login-wrapper {
  height: 100%;
  width: 100%;
  background-color: #2d434c;
  .login-content {
    background-color: #fff;
    padding: 35px;
    border-radius: 10px;
    min-width: 250px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    background-color: #f9fafc;
  }
}
</style>
