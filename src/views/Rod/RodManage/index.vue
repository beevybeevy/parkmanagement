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
    <el-button type="primary" @click="$refs.manageRod.openAddDialog()">添加一体杆</el-button>
    <el-button @click="deleteRod(ids)">批量删除</el-button>
    <!-- 表格部分 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      :row-key="row=>row.id"
      class="FormList"
      :header-cell-style="{ backgroundColor: '#f4f6f8' }"
      @selection-change="handleSelectionChange"
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
      <el-table-column label="运行状态" prop="poleStatus">
        <template #default="{row}">
          {{ row.poleStatus === 0 ? "正常" : "异常" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="mini" type="text" @click="$refs.manageRod.openEditDialog(row)">编辑</el-button>
          <el-button size="mini" type="text" @click="deleteRod([row.id])">删除</el-button>
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
    <AddRod ref="manageRod" @update="getRodList()" />
  </div>
</template>

<script>
import { getRodListAPI, deleteRoeAPI } from '@/api/rod'
import AddRod from './add-rod.vue'
export default {
  name: '',
  components: {
    AddRod
  },
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
      total: 0,
      showDialog: false
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
    doSearch() {
      this.getRodList()
    },
    deleteRod(ids = []) {
      if (ids.length === 0) {
        this.$message.warning('请选择要删除的数据')
        return
      }
      this.$confirm('此操作将永久删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
        // 1. 调接口
          // 2. 提示用户
          // 3. 重新渲染当前页（如果当前页有且只有一条数据，那么要渲染上一页）
          return deleteRoeAPI(ids)
        })
        .then(() => {
          this.$message.success('删除成功')
          if (this.tableData.length === 1 && this.params.page > 1) {
            this.params.page--
          }
          this.getRodList()
        })
        .catch(() => {})
    },
    handleSelectionChange(selection = []) {
      this.ids = selection.map(item => item.id)
      console.log(this.ids)
    }
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
