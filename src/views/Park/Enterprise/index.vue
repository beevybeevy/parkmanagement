<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="query.name" clearable placeholder="请输入内容" class="search-main" />
      <el-button type="primary" @click="doSeach">查询</el-button>
    </div>
    <div class="create-container">
      <el-button type="primary" @click="$router.push('/enterpriseAdd')">添加企业</el-button>
    </div>
    <!-- 表格区域 -->
    <div v-loading="isLoading" class="table">
      <el-table style="width: 100%" :data="list">
        <el-table-column type="index" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column
          label="联系电话"
          prop="contactNumber"
        />
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button size="mini" type="text">添加合同</el-button>
            <el-button size="mini" type="text">查看</el-button>
            <el-button size="mini" type="text" @click="$router.push('/enterpriseAdd?id='+row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteEnterprise(row.id)">删除</el-button>
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
  </div>
</template>

<script>
import { getEnterpriseListAPI, deleteEnterpriseAPI } from '@/api/park'
export default {
  data() {
    return {
      isLoading: false,
      list: [],
      query: {
        page: 1,
        pageSize: 5,
        name: null
      },
      total: ''
    }
  },
  created() {
    this.getEnterpriseListAPI()
  },
  methods: {
    onCurrentChange(page) {
      this.query.page = page
      // console.log(page)
      this.getEnterpriseListAPI()
    },
    async getEnterpriseListAPI() {
      this.isLoading = true
      const res = await getEnterpriseListAPI(this.query)
      this.isLoading = false
      this.list = res.data.rows
      this.total = res.data.total
      // console.log(this.total)
    },
    doSeach() {
      this.query.page = 1
      this.getEnterpriseListAPI()
    },
    deleteEnterprise(id) {
      this.$confirm('确定删除吗').then(async() => { await deleteEnterpriseAPI(id), this.getEnterpriseListAPI() })
      // this.$confirm('确定删除吗')
      //   .then(() => { return deleteEnterpriseAPI(id) })
      //   .then(() => { this.getEnterpriseListAPI() })
      //   .catch(() => {})
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
.create-container{
  margin: 10px 0px;
}
.page-container{
  padding:4px 0px;
  text-align: right;
}
.form-container{
  padding:0px 80px;
}
</style>
