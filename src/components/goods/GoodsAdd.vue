<template>
  <div>
    <!-- 步骤条 -->
    <el-steps :active="activeStep" finish-status="success">
      <el-step title="步骤 1" description="基本信息"></el-step>
      <el-step title="步骤 2" description="商品图片"></el-step>
      <el-step title="步骤 3" description="商品内容"></el-step>
    </el-steps>
    <!-- 菜单栏 -->
    <!-- 不能使用:value单向绑定,必须用v-model做数据双向绑定,不然下一步和直接点击tab栏无法做到同步 -->
    <el-tabs tab-position="left" @tab-click="goodstabclick" v-model="currentTabs">
      <el-tab-pane label="基本信息" name="0">
        <!-- 基本信息表单 -->
        <el-form :model="basicForm" ref="basicForm" label-width="100px" class="demo-ruleForm" :rules="basicFormRole">
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="basicForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格" prop="goods_price">
            <el-input v-model="basicForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量" prop="goods_number">
            <el-input v-model="basicForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品数量" prop="goods_weight">
            <el-input v-model="basicForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-cascader :options="basicOptions" @change="optionsHandleChange" :props="propsOptions">
            </el-cascader>
          </el-form-item>
          <el-form-item label="是否促销">
            <el-radio-group v-model="basicForm.resource ">
              <el-radio label="是"></el-radio>
              <el-radio label="否"></el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary " @click="nextForm('1','1')">下一步</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品图片" name="1">
        <!-- 上传商品图片 -->
        <el-row>
          <el-upload action="http://localhost:8888/api/private/v1/upload" :headers="uploadHeaders" :on-success="success" list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-row>
        <el-row>
          <el-button type="primary " @click="nextForm('2','2')">下一步</el-button>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="商品内容" name="2">
        <!-- 商品内容,富文本编辑器 -->
        <quill-editor v-model="quillEditorContent"></quill-editor>
        <el-button type="primary " @click="addAll('3')">确定</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// require styles
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  data() {
    return {
      //当前选中的步骤条下标
      activeStep: 0,
      //基本信息表单验证
      basicForm: {
        goods_name: "",
        goods_cat: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",
        pics: [],
        //attrs未处理,不处理
        attrs: "",
        //是否促销,未处理
        is_promote: false
      },
      basicOptions: [],
      //表单验证
      basicFormRole: {
        goods_name: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "商品价格不能为空", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "商品数量不能为空", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "商品重量不能为空", trigger: "blur" }
        ],
        goods_cat: [{ required: true, message: "请选择分类", trigger: "blur" }]
      },
      propsOptions: {
        value: "cat_id",
        label: "cat_name"
      },
      //选中的tab栏index
      currentTabs: "0",
      //上传文件的地址
      pictureUploadUrl: "http://localhost:8888/api/private/v1/upload",
      //上传文件的请求头
      uploadHeaders: {
        Authorization: localStorage.getItem("token")
      },
      //富文本编辑器绑定内容
      quillEditorContent: ""
    };
  },
  created() {
    this.getbasicOptions();
  },
  methods: {
    //tab栏点击触发的事件
    goodstabclick(res) {
      //将tab栏和步骤条的对应关系关联起来
      // console.log(res.index);
      this.activeStep = +res.index;
    },
    //获取 basicOptions 选项数据
    async getbasicOptions() {
      const res = await this.$axios.get(`/categories`);
      const { data, meta } = res.data;
      if (meta.status === 200) {
        this.basicOptions = data;
      }
    },
    // basicoptions发生改变时触发的事件
    optionsHandleChange(res) {
      this.basicForm.goods_cat = res.join(",");
    },
    //基本信息下一步按钮触发的事件
    nextForm(activeStep, currentTabs) {
      this.activeStep = +activeStep;
      this.currentTabs = currentTabs;
    },
    //上传文件事件处理函数
    success(res, file, fileList) {
      if (res.meta.status === 200) {
        this.basicForm.pics.push({ pic: res.data.tmp_path });
      }
    },
    addAll(activeStep) {
      this.activeStep = +activeStep;
      //处理添加请求
      this.$refs.basicForm.validate(async valid => {
        if (valid) {
          const res = await this.$axios.post(`/goods`, this.basicForm);
          const { data, meta } = res.data;
          if (meta.status === 201) {
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
          console.log(res);
        } else {
          this.$message({
            type: "info",
            message: "表单校验失败,未上传,请检查错误"
          });
        }
      });
    }
  },
  components: {
    quillEditor
  }
};
</script>

<style scope>
.ql-container {
  height: 300px;
}
</style>
