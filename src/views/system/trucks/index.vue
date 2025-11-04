<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="车牌号" prop="licensePlate">
        <el-input v-model="queryParams.licensePlate" placeholder="请输入车牌号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="型号" prop="model">
        <el-input v-model="queryParams.model" placeholder="请输入型号" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="载重" prop="loadCapacity">
        <el-input v-model="queryParams.loadCapacity" placeholder="请输入载重" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="所属部门" prop="department">
        <el-input v-model="queryParams.department" placeholder="请输入所属部门" clearable @keyup.enter.native="handleQuery" />
      </el-form-item>
      <el-form-item label="保险截至" prop="insuranceExpiry">
        <el-date-picker clearable v-model="queryParams.insuranceExpiry" type="date" value-format="yyyy-MM-dd"
          placeholder="请选择保险有效期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd"
          v-hasPermi="['system:trucks:add']">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="el-icon-edit" size="mini" :disabled="single" @click="handleUpdate"
          v-hasPermi="['system:trucks:edit']">修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete"
          v-hasPermi="['system:trucks:remove']">删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport"
          v-hasPermi="['system:trucks:export']">导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="trucksList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="货车id" align="center" prop="truckId" />
      <el-table-column label="车牌号" align="center" prop="licensePlate" />
      <el-table-column label="型号" align="center" prop="model" />
      <el-table-column label="载重" align="center" prop="loadCapacity" />
      <el-table-column label="所属部门" align="center" prop="department" />
      <el-table-column label="保险有效期" align="center" prop="insuranceExpiry" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.insuranceExpiry, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="货车状态" align="center" prop="status" />
      <el-table-column label="车辆实时位置" align="center" prop="currentLocation" />


      <el-table-column label="车辆实时位置" align="center" width="180">
        <template #default="scope">
          <span class="location-link" @click="handleLocationClick(scope.row.currentLocation)"
            :title="scope.row.currentLocation">
            {{ formatLocation(scope.row.currentLocation) }}
            <i class="el-icon-map"></i>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="mini" type="text" icon="el-icon-edit" @click="handleUpdate(scope.row)"
            v-hasPermi="['system:trucks:edit']">修改</el-button>
          <el-button size="mini" type="text" icon="el-icon-delete" @click="handleDelete(scope.row)"
            v-hasPermi="['system:trucks:remove']">删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <el-dialog
  :visible.sync="dialogVisible"
  title="车辆位置地图"
  width="1000px"
  class="map-dialog"
  @close="handleClose">
  <!-- 修改这里：替换iframe为地图容器 -->
  <div ref="mapContainer" style="width: 100%; height: 600px;"></div>
  <template #footer>
    <el-button @click="dialogVisible = false">关闭</el-button>
  </template>
</el-dialog>

    <!-- 添加或修改货车信息对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="车牌号" prop="licensePlate">
          <el-input v-model="form.licensePlate" placeholder="请输入车牌号" />
        </el-form-item>
        <el-form-item label="型号" prop="model">
          <el-input v-model="form.model" placeholder="请输入型号" />
        </el-form-item>
        <el-form-item label="载重" prop="loadCapacity">
          <el-input v-model="form.loadCapacity" placeholder="请输入载重" />
        </el-form-item>
        <el-form-item label="所属部门" prop="department">
          <el-input v-model="form.department" placeholder="请输入所属部门" />
        </el-form-item>
        <el-form-item label="保险有效期" prop="insuranceExpiry">
          <el-date-picker clearable v-model="form.insuranceExpiry" type="date" value-format="yyyy-MM-dd"
            placeholder="请选择保险有效期">
          </el-date-picker>
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
import { listTrucks, getTrucks, delTrucks, addTrucks, updateTrucks } from "@/api/system/trucks";

export default {
  name: "Trucks",
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
      // 货车信息表格数据
      trucksList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      dialogVisible: false,
      mapInstance: null,
      currentLng: 0,
      currentLat: 0,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        licensePlate: null,
        model: null,
        loadCapacity: null,
        department: null,
        insuranceExpiry: null,
        status: null,
        currentLocation: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        licensePlate: [
          { required: true, message: "车牌号不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "货车状态不能为空", trigger: "change" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    // 注入安全密钥
    window._AMapSecurityConfig = {
      securityJsCode: "xx600deac630f02b00342f998f35caca78",
    };
    // 加载高德地图 API
    this.loadMap();
  },
  methods: {
    loadMap() {
      const script = document.createElement('script');
      script.src = 'https://webapi.amap.com/loader.js';
      script.async = true;
      script.onload = () => {
        window.AMapLoader.load({
          key: "f6632281f3851aa6718e183571fce82b",
          version: "2.0"
        })
          .then((AMap) => {
            this.AMap = AMap;
          })
          .catch((e) => {
            console.error(e);
          });
      };
      document.head.appendChild(script);
    },
    handleLocationClick(locationStr) {
      if (!locationStr) return;
      const [lat, lng] = locationStr.split(',').map(Number);
      const coords = this.adjustCoordinateOrder(lat, lng);
      
      this.dialogVisible = true;
      
      // 使用 nextTick 确保 DOM 更新完成
      this.$nextTick(() => {
        // 创建地图实例（带缩放控件）
        const map = new this.AMap.Map(this.$refs.mapContainer, {
          center: [coords.lng, coords.lat],
          zoom: 15,
          features: ['bg', 'road', 'building'], // 显示3D建筑
          viewMode: "3D" // 使用3D视图
        });
        
        // 添加标记（带信息窗样式）
        new this.AMap.Marker({
          position: [coords.lng, coords.lat],
          map: map,
          content: '<div class="custom-marker">🚚</div>', // 自定义标记样式
          offset: new this.AMap.Pixel(-13, -30)
        });

        // 添加缩放控件
        map.addControl(new this.AMap.ZoomControl());
        
        // 保存地图实例以便后续操作
        this.mapInstance = map;
      });
    },

    handleClose() {
      this.dialogVisible = false;
      // 销毁地图实例
      if (this.mapInstance) {
        this.mapInstance.destroy();
        this.mapInstance = null;
      }
    },
    adjustCoordinateOrder(lat, lng) {
      return { lng, lat };
    },
    formatLocation(str) {
      return str.replace(',', '°, ').concat('°');
    },
    
    /** 查询货车信息列表 */
    getList() {
      this.loading = true;
      listTrucks(this.queryParams).then(response => {
        this.trucksList = response.rows;
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
        truckId: null,
        licensePlate: null,
        model: null,
        loadCapacity: null,
        department: null,
        insuranceExpiry: null,
        status: null,
        currentLocation: null
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
      this.ids = selection.map(item => item.truckId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加货车信息";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const truckId = row.truckId || this.ids
      getTrucks(truckId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改货车信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.truckId != null) {
            updateTrucks(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addTrucks(this.form).then(response => {
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
      const truckIds = row.truckId || this.ids;
      this.$modal.confirm('是否确认删除货车信息编号为"' + truckIds + '"的数据项？').then(function () {
        return delTrucks(truckIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => { });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/trucks/export', {
        ...this.queryParams
      }, `trucks_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

<style scoped>
.location-link {
  color: #409EFF;
  cursor: pointer;
  text-decoration: underline;
}

.location-link:hover {
  opacity: 0.8;
}
/* 新增自定义标记样式 */
.custom-marker {
  font-size: 24px;
  filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.2));
}
</style>   