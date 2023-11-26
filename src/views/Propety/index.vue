<template>
  <div class="building-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <div class="search-label">企业名称：</div>
      <el-input v-model="query.enterpriseName" placeholder="请输入内容" class="search-main" />
      <div class="search-label">缴费时间：</div>
      <el-date-picker v-model="time" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
      <el-button type="primary" @click="doSearch">查询</el-button>
    </div>
    <!-- 表格区域 -->
    <div class="table">
      <el-button type="primary" @click="addBill">添加账单</el-button>
      <el-table v-loading="loading" style="width: 100%" :data="list">
        <el-table-column prop="index" label="序号" type="index" />
        <el-table-column label="账单编号" width="180" prop="billNumber" />
        <el-table-column label="企业名称" prop="enterpriseName" />
        <el-table-column label="租赁楼宇" width="120" prop="buildingName" />
        <el-table-column label="物业费(元/m²)" width="120" prop="propertyFeePrice" />
        <el-table-column label="账单金额(元)" prop="paymentAmount" />
        <el-table-column label="缴费时间" prop="createTime" />
        <el-table-column label="操作">
          <template #default="{row}">
            <el-button size="mini" type="text" @click="doCheck(row.id)">查看</el-button>
            <el-button size="mini" type="text" @click="deleteBill(row.id)">删除</el-button>
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
    <!-- 添加账单的弹窗 -->
    <el-dialog title="添加账单" :visible.sync="dialogFormVisible">
      <el-form ref="form" :model="form" :rules="propetyRules">
        <el-form-item label="选择租户" label-width="200px" prop="enterpriseId">
          <el-select v-model="form.enterpriseId" placeholder="请选择租户">
            <el-option v-for="item in enterpriseOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="租赁楼宇" label-width="200px" prop="buildingId">
          <el-select v-model="form.buildingId" placeholder="请选择租赁楼宇">
            <el-option v-for="item in buidingOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <!-- 表单校验没有做完 -->
        <el-form-item label="缴费周期" label-width="200px" prop="billTime">
          <el-date-picker v-model="form.billTime" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" />
        </el-form-item>
        <el-form-item label="支付金额" label-width="200px" prop="paymentAmount">
          <el-input
            v-if="!!form.paymentAmount"
            v-model="form.paymentAmount"
            :disabled="true"
          />
          <el-input
            v-else
            v-model="form.paymentAmount"
            placeholder="请输入支付金额"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item label="支付方式" label-width="200px" prop="paymentMethod">
          <el-select v-model="form.paymentMethod" placeholder="请选择租赁楼宇">
            <el-option label="微信" :value="1" />
            <el-option label="支付宝" :value="2" />
            <el-option label="现金" :value="3" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看的弹窗 -->
    <el-dialog title="添加账单" :visible.sync="showDialog">
      <div class="wrapper">
        <div class="wrapper-item">
          <span>租户名称：</span><span>{{ billList.enterpriseName }}</span>
        </div>
        <div class="wrapper-item">
          <span>租户楼宇：</span><span>{{ billList.buildingName }}</span>
        </div>
        <div class="wrapper-item">
          <span>缴费周期：</span><span>{{ billList.startTime }}至{{ billList.endTime }}</span>
        </div>
        <div class="wrapper-item">
          <span>物业费(元/m²)：</span><span>{{ billList.propertyFeePrice }}</span>
        </div>
        <div class="wrapper-item">
          <span>账单金额(元)：</span><span>{{ billList.paymentAmount }}</span>
        </div>
        <div class="wrapper-item">
          <span>支付方式：</span><span>{{ paymentMethodText }}</span>
        </div>
        <div class="wrapper-item">
          <span>缴费时间：</span><span>{{ billList.createTime }}</span>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="showDialog = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getAllPropetyListAPI, checkAllEnterpriseAPI, checkAllBuildingAPI, calculateFeeAPI, addBillAPI, checkBillAIP, deleteBillAPI } from '@/api/propety'
import { createRequiredRule } from '@/utils/validate'
export default {
  name: 'Building',
  data() {
    return {
      dialogFormVisible: false,
      showDialog: false,
      list: [],
      query: {
        page: 1,
        pageSize: 10,
        start: null,
        end: null,
        enterpriseName: null
      },
      total: 0,
      loading: false,
      time: '',
      form: {
        enterpriseId: '',
        buildingId: '',
        paymentAmount: '',
        // 付款方式1微信2支付宝3现金
        paymentMethod: '',
        billTime: ''
      },
      enterpriseOptions: [],
      buidingOptions: [],
      billList: {},
      propetyRules: {
        enterpriseId: [createRequiredRule('必选项，不能为空')],
        buildingId: [createRequiredRule('必选项，不能为空')],
        paymentAmount: [createRequiredRule('必选项，不能为空')],
        paymentMethod: [createRequiredRule('必选项，不能为空')],
        billTime: [createRequiredRule('必选项，不能为空')]
      }
    }
  },

  computed: {
    paymentMethodText() {
      switch (this.billList.paymentMethod) {
        case 1:
          return '微信'
        case 2:
          return '支付宝'
        case 3:
          return '现金'
        default:
          return '未知支付方式'
      }
    }
  },

  watch: {
    time(newValue, oldValue) {
      // 在time数据变化时触发的逻辑 如果清空之后需要更改start和end的值
      if (newValue === null) {
        this.query.start = null
        this.query.end = null
      }
    },
    // 'form.xxx'可以监听对象中的属性，需要用单引号
    form: {
      deep: true,
      async handler(newVal, oldVal) {
        if (newVal.buildingId && newVal.billTime) {
          const res = await calculateFeeAPI(newVal.buildingId, newVal.billTime[0], newVal.billTime[1])
          // console.log(res)
          this.form.paymentAmount = res.data
        }
      }

    }
  },

  created() {
    this.getAllPropetyList()
  },

  methods: {
    async getAllPropetyList() {
      this.loading = true
      const res = await getAllPropetyListAPI(this.query)
      this.loading = false
      this.list = res.data.rows
      this.total = res.data.total
      // console.log(res, this.total)
    },
    onCurrentChange(page) {
      this.query.page = page
      this.getAllPropetyList(this.query)
    },
    // 搜索栏进行筛选查询
    doSearch() {
      if (this.time) {
        this.query.start = this.time[0]
        this.query.end = this.time[1]
      }
      this.loading = true
      this.getAllPropetyList(this.query)
      this.loading = false
      // console.log(this.query)
    },
    // 点击添加账单按钮后
    async addBill() {
      const res1 = await checkAllEnterpriseAPI()
      const res2 = await checkAllBuildingAPI()
      // console.log(res2)
      this.enterpriseOptions = res1.data
      this.buidingOptions = res2.data
      this.dialogFormVisible = true
    },
    // handleBlur() {
    //   this.form.startTime = this.billTime[0]
    //   this.form.endTime = this.billTime[1]
    //   // console.log(this.form)
    // },
    doSubmit() {
      this.$refs.form.validate().then(async() => {
        this.form.startTime = this.form.billTime[0]
        this.form.endTime = this.form.billTime[1]
        const formDataWithoutBillTime = { ...this.form }
        delete formDataWithoutBillTime.billTime
        await addBillAPI(formDataWithoutBillTime)
        this.$message.success('添加账单成功')
        this.dialogFormVisible = false
        Object.keys(this.form).forEach((item) => {
          this.form[item] = null
        })
        this.getAllPropetyList()
      })
    },
    async doCheck(id) {
      const res = await checkBillAIP(id)
      console.log(res)
      this.billList = res.data
      this.showDialog = true
    },
    deleteBill(id) {
      this.$confirm('确认删除帐单么').then(() => {
        return deleteBillAPI(id)
      }).then(() => {
        this.$message.success('删除成功')
        if (this.list.length === 1 && this.query.page > 1) {
          this.query.page--
        }
        this.getAllPropetyList()
      })
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
