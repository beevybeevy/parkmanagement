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
    <el-button type="primary" @click="operateRodMange()">添加一体杆</el-button>
    <el-button @click="delrodmange(ids)">批量删除</el-button>
    <!-- 表格区域 -->
    <el-table
      v-loading="loading"
      :data="tableData"
      class="FormList"
      :row-key="row=>row.id"
      :header-cell-style="{ backgroundColor: '#f4f6f8' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        :reserve-selection="true"
        type="selection"
        width="55"
      />
      <el-table-column label="序号" type="index" :index="count" />
      <el-table-column label="一体杆名称" prop="poleName" />
      <el-table-column label="一体杆编号" prop="poleNumber" />
      <el-table-column label="一体杆IP" prop="poleIp" />
      <el-table-column label="安装区域" prop="areaName" />
      <el-table-column label="一体杆类型" prop="poleType">
        <template slot-scope="scope">
          {{ scope.row.poleType === 'export' ? "入口" : "出口" }}
        </template>
      </el-table-column>
      <el-table-column label="运行状态" prop="poleStatus" :formatter="formtype" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button size="mini" type="text" @click="operateRodMange(row.id)">编辑</el-button>
          <el-button size="mini" type="text" @click="delrodmange([row.id])">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="page-container">
      <el-pagination
        layout="total, prev, pager, next, sizes"
        :total="total"
        :page-size="params.pageSize"
        :current-page="params.page"
        @current-change="onCurrentChange"
        @size-change="handleSizeChange"
      />
    </div>
    <!-- 封装的组件 -->
    <Operation :rodmangelist="rodmangelist" @changelist="handleChange" />
  </div>
</template>

<script>
import { getRodMange, delRodMange, putRodMange, addRodMange } from '@/api/rodmange'
import { Message } from 'element-ui'
import Operation from './operation.vue'

export default {
  name: 'Building',
  components: {
    Operation
  },
  data() {
    return {
      // 查询参数
      params: {
        page: 1,
        pageSize: 10,
        // 一体杆名称
        poleName: '',
        // 一体杆编号
        poleNumber: '',
        // 运行状态
        poleStatus: ''
      },
      total: 0,
      tableData: [],
      options: [{
        value: null,
        label: '全部'
      }, {
        value: 0,
        label: '正常'
      }, {
        value: 1,
        label: '异常'
      }],
      // 打开弹出框
      dialogVisible: false,
      labelPosition: 'top',
      // 下拉选项
      poleTypeList: [{
        value: '选项2',
        label: '入口'
      }, {
        value: '选项3',
        label: '出口'
      }],
      loading: false,
      ids: [],
      id: null,
      rodmangelist: {
        // 一体杆名称
        poleName: '',
        // 一体杆编号
        poleNumber: '',
        // 一体杆IP
        poleIp: '',
        // 关联区域id
        areaId: '',
        // 一体杆类型
        poleType: ''
      },
      // 下拉选项
      areaIdList: []
    }
  },
  created() {
    this.getgardenList()
  },
  methods: {
    formtype(row) {
      const obj = { 0: '正常', 1: '异常' }
      return obj[row.poleStatus]
    },
    // 切换页面之后序号不从1开始
    count(index) {
      return (this.params.page - 1) * this.params.pageSize + index + 1
    },
    // 一页显示多少内容
    handleSizeChange(newsize) {
      this.params.pageSize = newsize
      this.getgardenList()
    },
    // 获取列表
    async getgardenList() {
      // this.loading = true
      const res = await getRodMange(this.params)
      // this.loading = false
      this.tableData = res.data.rows
      this.total = res.data.total
    },
    // 执行搜索
    doSearch() {
      // 搜索一定要从第一页开始
      this.params.page = 1
      this.getgardenList()
    },
    // 当前页改变时回调该函数
    onCurrentChange(page) {
      // 改变当前页，然后获取新数据，渲染表格
      this.params.page = page
      this.getgardenList()
    },
    // 删除
    delrodmange(ids = []) {
      // 判断有没有点击多选框
      if (!ids.length) {
        Message.warning('请选择要删除的数据')
        return
      }
      // 提示
      this.$confirm('是否确定删除当前选中的一体杆?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调接口
        return delRodMange(ids)
      }).then(() => {
        // 重新渲染页面
        this.getgardenList()
        // 提示
        Message.success('删除成功')
        // 如果是当前页的唯一一条数据，那么页码要--，如果已经是第一页了，就不能--了
        if (this.cardList.length === 1 && this.params.page > 1) {
          this.params.page--
        }
      }).catch(() => { })
    },
    async handleChange(e) {
      const fn = this.rodmangelist.id ? putRodMange : addRodMange
      this.$refs.rodmangelist.validate().then(() => {
        return fn(this.rodmangelist)
      }).then(() => {
        Message.success('操作成功')
        this.getgardenList()
        this.dialogVisible = false
        // 移出表单校验规则
        this.$refs.rodmangelist.resetFields()
      })
    },
    // 得到多选框的数据
    handleSelectionChange(selection = []) {
      this.ids = selection.map(item => item.id)
    },
    // // 显示新增编辑一体杆弹框
    async operateRodMange(id) {
      this.id = id
      if (id) {
        // 添加id属性
        this.rodmangelist.id = id
        // 查找点击编辑后对应的对象
        const res = await getRodMange(this.params)
        const aaa = res.data.rows.filter(item => {
          if (id === item.id) {
            return item
          }
        })
        // 回显
        this.rodmangelist = aaa.find(item => item.id === id)
        delete this.rodmangelist['areaName']
        delete this.rodmangelist['poleStatus']
      } else {
        Object.keys(this.rodmangelist).forEach(key => { this.rodmangelist[key] = '' })
        delete this.rodmangelist['id']
      }
      // 移出表单校验规则
      // this.$refs.rodmangelist.resetFields()
      // 显示弹框
      this.dialogVisible = true
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
