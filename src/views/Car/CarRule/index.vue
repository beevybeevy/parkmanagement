<template>
  <div class="rule-container">
    <div class="create-container">
      <el-button type="primary" @click="$refs.carRulesDialog.openAddDialog()">增加停车计费规则</el-button>
      <el-button>导出Excel</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-table :data="ruleList" style="width: 100%">
        <el-table-column type="index" label="序号" />
        <el-table-column label="计费规则编号" prop="ruleNumber" />
        <el-table-column label="计费规则名称" prop="ruleName" />
        <el-table-column label="免费时长(分钟)" prop="freeDuration" />
        <el-table-column label="收费上限(元)" prop="chargeCeiling" />
        <el-table-column label="计费方式">
          <template #default="scope">
            {{ mapRulesinCN(scope.row.chargeType) }}
          </template>
        </el-table-column>
        <el-table-column label="计费规则" prop="ruleNameView" />
        <el-table-column label="操作" fixed="right" width="120">
          <template #default="{row}">
            <el-button size="mini" type="text" @click="$refs.carRulesDialog.openEditDialog(row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="deleteRule(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      layout="total, prev, pager, next"
      :total="total"
      :current-page="params.page"
      :page-size="params.pageSize"
      @current-change="onCurrentChange"
    />
    <upsert-rules ref="carRulesDialog" @update="handleUpdate" />
  </div>
</template>

<script>
import { getCarRuleListAPI, deleteRuleAPI } from '@/api/car'
import upsertRules from './upsert-rule1.vue'

export default {
  name: 'Building',
  components: {
    upsertRules
  },
  data() {
    return {
      ruleList: [],
      params: {
        page: 1,
        pageSize: 10
      },
      total: 0,
      dialogVisible: false
    }
  },
  created() {
    this.getCarRuleList()
  },
  methods: {
    async getCarRuleList() {
      const res = await getCarRuleListAPI(this.params)
      console.log(res)
      this.ruleList = res.data.rows
      this.total = res.data.total
    },
    onCurrentChange(page) {
      this.params.page = page
      // console.log(page)
      this.getCarRuleList()
    },
    async deleteRule(id) {
      this.$confirm('确认删除规则吗').then(
        async() => {
          await deleteRuleAPI(id)
          this.$message.success('删除成功')
          this.getCarRuleList()
          this.params.page = 1
        })
    },
    mapRulesinCN(chargeType) {
      const mapRules = {
        'duration': '时长收费',
        'partition': '分段收费',
        'turn': '按次收费'
      }
      return mapRules[chargeType]
    },
    handleUpdate() {
      this.getCarRuleList()
    }
  }
}
</script>

<style lang="scss" scoped>
.rule-container {
  padding: 20px;
  background-color: #fff;
}

.search-container {
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(237, 237, 237, .9);
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
