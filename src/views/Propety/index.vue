<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input placeholder="请输入内容" class="search-main" />
      <div class="search-label">缴费时间：</div>
      <el-date-picker type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" />
      <el-button type="primary">查询</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-button type="primary">添加账单</el-button>
      <el-table style="width: 100%" :data="list">
        <el-table-column prop="index" label="序号" type="index" />
        <el-table-column label="账单编号" width="180" prop="billNumber" />
        <el-table-column label="企业名称" prop="enterpriseName" />
        <el-table-column label="租赁楼宇" width="120" prop="buildingName" />
        <el-table-column label="物业费(元/m²)" width="120" prop="propertyFeePrice" />
        <el-table-column label="账单金额(元)" prop="paymentAmount" />
        <el-table-column label="缴费时间" prop="createTime" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
  </div>
</template>

<script>
import { getAllPropetyListAPI } from '@/api/propety'
export default {
  name: 'Building',
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getAllPropetyList()
  },
  methods: {
    async getAllPropetyList() {
      const res = await getAllPropetyListAPI()
      this.list = res.data.rows
    }
  }
}
</script>

<style lang="scss" scoped>
.department-container {
  padding: 10px;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
  ;
  padding-bottom: 20px;

  .search-label {
    width: 100px;
  }

  .search-main {
    width: 220px;
    margin-right: 10px;
  }
}
</style>
