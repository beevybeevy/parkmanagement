<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">楼宇名称：</div>
      <el-input v-model="query.name" placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="doSearch">查询</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-button type="primary" @click="$refs.Building.openDialog()">添加楼宇</el-button>
      <el-table v-loading="loading" style="width: 100%" :data="list">
        <el-table-column prop="index" label="序号" type="index" />
        <el-table-column label="楼宇名称" width="180" prop="name" />
        <el-table-column label="层数" prop="floors" />
        <el-table-column label="在管面积(m²)" width="120" prop="area" />
        <el-table-column label="物业费(元/m²)" width="120" prop="propertyFeePrice" />
        <el-table-column label="状态" prop="status">
          <template #default="{row}">
            {{ row.status === 0? '空置中':'租赁中' }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button size="mini" type="text" @click="$refs.Building.openEditDialog(row.id)">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next"
        :total="total"
        :current-page="query.page"
        :page-size="query.pageSize"
        @current-change="onCurrentChange"
      />

    </div>
    <AddBuilding ref="Building" @update="getBuildingList()" />
  </div>
</template>

<script>
import AddBuilding from './add-Building.vue'
import { getAllBuildingListAPI } from '@/api/park'
export default {
  name: 'Building',
  components: {
    AddBuilding
  },
  data() {
    return {
      loading: false,
      query: {
        name: '',
        page: 1,
        pageSize: 10
      },
      list: [],
      total: 0
    }
  },
  created() {
    this.getBuildingList()
  },
  methods: {
    onCurrentChange(page) {
      this.query.page = page
    },
    async getBuildingList() {
      this.loading = true
      const res = await getAllBuildingListAPI(this.query)
      this.loading = false
      console.log(res)
      this.list = res.data.rows
      this.total = res.data.total
    },
    async doSearch() {
      this.getBuildingList()
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

.el-input{
  width: 210px;
}

.wrapper{
  width: 380px;
  height: 274px;
  margin-left:150px
}

.wrapper-item{
  margin-bottom: 25px;
  font-size: 14px;
}
</style>
