<template>
  <div class="fillContainer">
    <div>
      <el-form :inline="true">
        <!-- // 时间筛选 -->
        <el-form-item label="时间选择：">
          <el-date-picker
            v-model="serach_data"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="view" @click="timeSelect()">筛选</el-button>
        </el-form-item>
        <el-form-item class="btnRight" v-if="user.identity == 'manager'">
          <el-button type="primary" size="small" icon="view" @click="onAddMoney()">添加</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table_container">
      <el-table
        v-if="tableData.length > 0"
        max-height="430"
        border
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
        <el-table-column prop="date" label="创建日期" width="220">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ scope.row.date }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="收支类型" align="center" width="100"></el-table-column>
        <el-table-column prop="describe" label="收支描述" align="center" width="180"></el-table-column>
        <el-table-column prop="income" label="收入" align="center" width="100">
          <template slot-scope="scope">
            <span style="color:#00d053">{{ scope.row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="expend" label="支出" align="center" width="100">
          <template slot-scope="scope">
            <span style="color:#f56767">{{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cash" label="账户现金" align="center" width="100">
          <template slot-scope="scope">
            <span style="color:#4db3ff">{{ scope.row.expend }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" width="200"></el-table-column>
        <el-table-column prop="operation" align="center" fixed="right" label="操作" width="200" v-if="user.identity == 'manager'">
          <template slot-scope="scope">
            <el-button type="warnig" size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row>
        <el-col class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="paginations.page_index"
            :page-sizes="paginations.page_sizes"
            :page-size="paginations.page_size"
            :layout="paginations.layout"
            :total="paginations.total"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
    <Dialog :dialog="dialog" :form="form" @update="getProfiles"></Dialog>
  </div>
</template>

<script>
import Dialog from "../components/Dialog";
export default {
  data() {
    return {
      serach_data: "",
      paginations: {
        page_index: 1, // 当前位于那页
        page_size: 5,  // 一页显示多少条
        page_sizes: [5, 10, 15, 20], // 每页显示多少
        layout: "total, sizes, prev, pager, next, jumper", // 翻页属性
        total: 0
      },
      tableData: [],
      allTableData: [],
      filterTableData: [],
      dialog: {
        show: false,
        title: "",
        option: "edit"
      },
      form: {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      }
    };
  },
  created() {
    this.getProfiles();
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  },
  components: {
    Dialog
  },
  methods: {
    getProfiles() {
      this.$axios
        .get("/api/profiles")
        .then(res => {
          this.allTableData = res.data;
          this.filterTableData = res.data;
          this.setPaginations()
        })
        .catch(err => {
          console.log(err);
        });
    },
    setPaginations() {
      // 默认属性设置
      this.paginations.page_index = 1
      this.paginations.page_size = 5
      this.paginations.total = this.allTableData.length
      // 设置默认分页数据
      this.tableData = this.allTableData.filter((item, index) => {
        return index < this.paginations.page_size
      })
    },
    handleEdit(index, row) {
      this.dialog = {
        show: true,
        title: "修改资金信息",
        option: "edit"
      };
      this.form = {
        type: row.type,
        describe: row.describe,
        income: row.income,
        expend: row.expend,
        cash: row.cash,
        remark: row.remark,
        id: row._id
      };
    },
    handleDelete(index, row) {
      this.$axios.post(`/api/profiles/delete/${row._id}`).then(res => {
        this.$message("成功");
        this.getProfiles();
      });
    },
    onAddMoney() {
      this.dialog = {
        show: true,
        title: "增加资金信息",
        option: "add"
      };
      this.form = {
        type: "",
        describe: "",
        income: "",
        expend: "",
        cash: "",
        remark: "",
        id: ""
      };
    },
    handleSizeChange(page_size) {
      // 切换size
      this.paginations.page_index = 1
      this.paginations.page_size = page_size
      this.tableData = this.allTableData.filter((item, index) => {
        return index < page_size
      })
    },
    handleCurrentChange(page) {
      // 当前页
      let sortnum = this.paginations.page_size * (page - 1)
      let table = this.allTableData.filter((item, index) => {
        return index >= sortnum
      })
      // 设置默认分页数据
      this.tableData = table.filter((item, index) => {
        return index < this.paginations.page_size;
      });
    },
    timeSelect() {
      if (!this.serach_data) {
        this.$message({
          type: "warning",
          message: "请选择时间区间"
        });
        this.getProfiles()
        return;
      }

      const sTime = this.serach_data[0].getTime()
      const eTime = this.serach_data[1].getTime()

      this.allTableData = this.filterTableData.filter(item => {
        let date = new Date(item.date);
        let time = date.getTime();
        return time >= sTime && time <= eTime; 
      })

      this.setPaginations()
    }
  }
};
</script>

<style scoped>
.fillContainer {
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
}
.btnRight {
  float: right;
}
.pagination {
  text-align: right;
  margin-top: 10px;
}
</style>