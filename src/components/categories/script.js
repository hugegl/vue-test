import ElTreeGrid from "element-tree-grid";
export default {
  data() {
    return {
      //搜索框绑定的数据
      searchCategories: "",
      //分页器数据-总页数
      categoriesTotal: 0,
      //每页条数
      pagesize: 10,
      //当前页
      curPage: 1,
      //所有商品分类数据
      categoriesLists: [],
      //表格加载效果数据
      loading: true,
      //添加分类对话框是否显示数据
      AddCategoriesDialog: false,
      //添加分类from数据
      AddCategoriesForm: {
        //名称
        cat_name: "",
        //父级的id
        cat_pid: [],
        //自己的级别
        cat_level: ""
      },
      //级联菜单的数据
      AddCategoriesFormOptions: []
    };
  },
  created() {
    this.getAllcategoriesLists();
  },
  methods: {
    //获取所有列表
    async getAllcategoriesLists(pagenum = 1) {
      this.loading = true;
      const res = await this.$axios.get("/categories", {
        params: {
          pagenum,
          pagesize: this.pagesize,
          query: this.searchCategories
        }
      });
      const { data, meta } = res.data;
      if (meta.status == 200) {
        this.loading = false;
        this.pagenum = data.pagenum;
        this.pagesize = data.pagesize;
        this.categoriesTotal = data.total;
        this.categoriesLists = data.result;
      }
    },
    //分页器点击触发的事件
    changeCurrentPage(page) {
      this.curPage = page;
      this.getAllcategoriesLists(page);
    },
    //添加分类,显示模态框
    showAddCategories() {
      this.AddCategoriesDialog = true;
    },
    //级联菜单发生改变时触发的函数
    handleChange(res) {
      this.AddCategoriesForm.cat_level = res.length;
      this.AddCategoriesForm.cat_pid = res.join(",");
    },
    //点击确定,发送添加请求
    async sendAddCategoriesDialog() {
      const res = await this.$axios.post(`/categories`, this.AddCategoriesForm);
      const { data, meta } = res.data;
      if (meta.status === 201) {
        this.AddCategoriesDialog = false;
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
    }
  },
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  }
};
