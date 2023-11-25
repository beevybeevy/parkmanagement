<template>
  <div class="enterprise-container">
    <el-form ref="ruleForm" label-width="70px" class="demo-ruleForm">
      <el-form-item>
        <span class="type first">一体杆名称：</span>
        <el-input v-model.trim="params.poleName" autocomplete="off" placeholder="清输入一体杆名称" style="width: 15%" />
        <span class="type">一体杆编号：</span>
        <el-input v-model.trim="params.poleNumber" autocomplete="off" placeholder="清输入一体杆编号" style="width: 15%" />
        <span class="type">运行状态：</span>
        <el-select v-model="params.poleStatus" placeholder="清选择运行状态" style="width: 15%">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button type="primary" class="queryButton" @click="doSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary">添加一体杆</el-button>
    <el-button>批量删除</el-button>
    <!-- 表格部分 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      :row-key="row=>row.id"
      class="FormList"
      :header-cell-style="{ backgroundColor: '#f4f6f8' }"
    >
      <el-table-column
        :reserve-selection="true"
        type="selection"
        width="55"
      />
      <el-table-column label="序号" type="index" />
      <el-table-column label="一体杆名称" prop="poleName" />
      <el-table-column label="一体杆编号" prop="poleNumber" />
      <el-table-column label="一体杆IP" prop="poleIp" />
      <el-table-column label="安装区域" prop="areaName" />
      <el-table-column label="一体杆类型" prop="poleType">
        <template #default="{row}">
          {{ row.poleType === 'export' ? "入口" : "出口" }}
        </template>
      </el-table-column>
      <el-table-column label="运行状态" prop="poleStatus" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="mini" type="text">编辑</el-button>
          <el-button size="mini" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="page-container">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        :current-page="params.page"
        :page-size="params.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="handleSizeChange"
        @current-change="onCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { getRodListAPI } from '@/api/rod'
export default {
  name: '',
  data() {
    return {
      loading: false,
      params: {
        page: 1,
        pageSize: 10,
        poleName: null,
        poleNumber: null,
        poleStatus: ''
      },
      options: [
        { label: '全部', value: null },
        { label: '正常', value: 0 },
        { label: '异常', value: 1 }
      ],
      tableData: [],
      total: 0
    }
  },
  created() {
    this.getRodList()
  },
  methods: {
    async getRodList() {
      this.loading = true
      const res = await getRodListAPI(this.params)
      this.loading = false
      console.log(res)
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    onCurrentChange(page) {
      this.params.page = page
      this.getRodList()
    },
    handleSizeChange(val) {
      this.params.pageSize = val
      this.getRodList()
    },
    doSearch() {}
  }
}
</script>

<style lang="scss" scoped>
.type{
  margin-left: 20px;
}

.first{
  margin-left: -65px;
}

.queryButton {
  margin-left: 30px;
}

.FormList {
  width: 100%;
  margin-top: 20px;
}

.page-container {
  padding: 4px 0px;
  text-align: right;
}

.el-form-item {
    margin-bottom: 8px;
}
</style>
