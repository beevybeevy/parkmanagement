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
      <el-table style="width: 100%" :data="list" @expand-change="onExpandChange">
        <el-table-column type="expand">
          <template #default="{row}">
            <el-table :data="row.rentList">
              <el-table-column label="租赁楼宇" width="320" prop="buildingName" />
              <el-table-column label="租赁起始时间" width="320" prop="startTime" />
              <el-table-column label="合同状态" width="320" prop="status">
                <template #default="{row:childRow}">
                  <el-tag :type="getStatusInfo(childRow.status).type">{{ getStatusInfo(childRow.status).text }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="320">
                <template #default="{row:childRow}">
                  <el-button size="mini" type="text" :disabled="childRow.renewFlag===0||childRow.exitFlag===0" @click="$refs.contractDialog.openEditDialog(childRow,row,1)">续租</el-button>
                  <el-button size="mini" type="text" :disabled="[3].includes(childRow.status)" @click="cancelContract(row,childRow.id)">退租</el-button>
                  <el-button size="mini" type="text" :disabled="[0, 1].includes(childRow.status)" @click="deleteContract(row,childRow.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" />
        <el-table-column label="企业名称" width="320" prop="name" />
        <el-table-column label="联系人" prop="contact" />
        <el-table-column label="联系电话" prop="contactNumber" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button size="mini" type="text" @click="$refs.contractDialog.openAddDialog(row,0)">添加合同</el-button>
            <el-button size="mini" type="text" @click="$router.push('/enterpriseCheck?id='+row.id)">查看</el-button>
            <el-button size="mini" type="text" @click="$router.push('/enterpriseAdd?id=' + row.id)">编辑</el-button>
            <el-button size="mini" type="text" :disabled="row.existContractFlag===1" @click="deleteEnterprise(row.id)">删除</el-button>
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
    <upsertContract ref="contractDialog" @update="update" />
  </div>
</template>

<script>
import { getEnterpriseListAPI, deleteEnterpriseAPI, getContractAPI, deleteContractAPI, cancelContractAPI } from '@/api/park'
import upsertContract from '@/views/Park/Enterprise/upsert-contract.vue'
export default {
  components: {
    upsertContract
  },
  data() {
    return {
      isLoading: false,
      list: [],
      query: {
        page: 1,
        pageSize: 5,
        name: null
      },
      total: 0
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
      res.data.rows.forEach(item => {
        item.rentList = []
        item.isLoading = false
      }
      )
      this.list = res.data.rows
      this.total = res.data.total
      // console.log(this.total)
    },
    doSeach() {
      this.query.page = 1
      this.getEnterpriseListAPI()
    },
    deleteEnterprise(id) {
      this.$confirm('确定删除吗').then(
        async() => {
          await deleteEnterpriseAPI(id)
          this.getEnterpriseListAPI()
        })
      // this.$confirm('确定删除吗')
      //   .then(() => { return deleteEnterpriseAPI(id) })
      //   .then(() => { this.getEnterpriseListAPI() })
      //   .catch(() => {})
    },
    async onExpandChange(row, expandedRows = []) {
      // console.log(row, expandedRows)
      // 判断当前是展开还是合上
      if (!expandedRows.includes(row)) { return }
      const res = await getContractAPI(row.id)
      // 对数据进行渲染
      row.rentList = res.data
    },
    getStatusInfo(statusVal = 0) {
      const mapStaus = {
        0: { type: 'primary', text: '待生效' },
        1: { type: 'success', text: '生效中' },
        2: { type: 'warning', text: '已过期' },
        3: { type: 'info', text: '已退租' }
      }
      return mapStaus[statusVal]
    },
    async update(row) {
      const res = await getContractAPI(row.id)
      // console.log('列表结果', response)
      // 对数据进行渲染
      row.rentList = res.data
    },
    deleteContract(row, id) {
      this.$confirm('操作不可逆，确定退租').then(
        async() => {
          await deleteContractAPI(id)
          this.$message.success('删除成功')
          // console.log(id, childRow)
          const res = await getContractAPI(row.id)
          row.rentList = res.data
        }
      )
    },
    cancelContract(row, id) {
      this.$confirm('操作不可逆，确定退租吗').then(
        async() => {
          await cancelContractAPI(id)
          this.$message.success('退租成功')
          // console.log(id, childRow)
          const res = await getContractAPI(row.id)
          row.rentList = res.data
        }
      )
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

.create-container {
  margin: 10px 0px;
}

.page-container {
  padding: 4px 0px;
  text-align: right;
}

.form-container {
  padding: 0px 80px;
}
</style>
