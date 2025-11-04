<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="司机ID" prop="driverId">
        <el-input
          v-model="queryParams.driverId"
          placeholder="请输入司机ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="评议日期" prop="evaluationDate">
        <el-date-picker clearable
          v-model="queryParams.evaluationDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择评议日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="违规次数" prop="violationCount">
        <el-input
          v-model="queryParams.violationCount"
          placeholder="请输入违规次数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务完成率" prop="taskCompletionRate">
        <el-input
          v-model="queryParams.taskCompletionRate"
          placeholder="请输入任务完成率"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="综合评分" prop="overallScore">
        <el-input
          v-model="queryParams.overallScore"
          placeholder="请输入综合评分"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['system:evaluations:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['system:evaluations:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['system:evaluations:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['system:evaluations:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="evaluationsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="评议ID" align="center" prop="id" />
      <el-table-column label="司机ID" align="center" prop="driverId" />
      <el-table-column label="评议日期" align="center" prop="evaluationDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.evaluationDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="违规次数" align="center" prop="violationCount" />
      <el-table-column label="任务完成率" align="center" prop="taskCompletionRate" />
      <el-table-column label="客户反馈" align="center" prop="customerFeedback" />
      <el-table-column label="评语" align="center" prop="managerComment" />
      <el-table-column label="综合评分" align="center" prop="overallScore" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['system:evaluations:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['system:evaluations:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改司机评议报告对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="司机ID" prop="driverId">
          <el-input v-model="form.driverId" placeholder="请输入司机ID" />
        </el-form-item>
        <el-form-item label="评议日期" prop="evaluationDate">
          <el-date-picker clearable
            v-model="form.evaluationDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择评议日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="违规次数" prop="violationCount">
          <el-input v-model="form.violationCount" placeholder="请输入违规次数" />
        </el-form-item>
        <el-form-item label="任务完成率" prop="taskCompletionRate">
          <el-input v-model="form.taskCompletionRate" placeholder="请输入任务完成率" />
        </el-form-item>
        <el-form-item label="客户反馈" prop="customerFeedback">
          <el-input v-model="form.customerFeedback" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="评语" prop="managerComment">
          <el-input v-model="form.managerComment" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="综合评分" prop="overallScore">
          <el-input v-model="form.overallScore" placeholder="请输入综合评分" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listEvaluations, getEvaluations, delEvaluations, addEvaluations, updateEvaluations } from "@/api/system/evaluations";

export default {
  name: "Evaluations",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 司机评议报告表格数据
      evaluationsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        driverId: null,
        evaluationDate: null,
        violationCount: null,
        taskCompletionRate: null,
        customerFeedback: null,
        managerComment: null,
        overallScore: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询司机评议报告列表 */
    getList() {
      this.loading = true;
      listEvaluations(this.queryParams).then(response => {
        this.evaluationsList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: null,
        driverId: null,
        evaluationDate: null,
        violationCount: null,
        taskCompletionRate: null,
        customerFeedback: null,
        managerComment: null,
        overallScore: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加司机评议报告";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getEvaluations(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改司机评议报告";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateEvaluations(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addEvaluations(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除司机评议报告编号为"' + ids + '"的数据项？').then(function() {
        return delEvaluations(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/evaluations/export', {
        ...this.queryParams
      }, `evaluations_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
