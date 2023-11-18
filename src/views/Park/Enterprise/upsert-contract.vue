<template>
  <el-dialog title="添加合同" :visible="showDialog" width="580px" @close="closeDialog">
    <!-- 表单区域 -->
    <div class="form-container">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="租赁楼宇">
          <el-select v-model="form.buildingId" placeholder="请选择租赁的楼宇">
            <el-option v-for="item in option" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-date-picker
            v-model="form.rentPeriod"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          />
        </el-form-item>
        <el-form-item label="租赁合同" prop="contractId">
          <el-upload
            class="upload-demo"
            action="#"
            :limit="1"
            :http-request="uploadRequest"
            :before-upload="beforeUpload"
          >
            <el-button size="small" type="success" plain>点击上传</el-button>
            <!-- <img v-else width="300px" :src="addForm.businessLicenseUrl" alt=""> -->
            <div slot="tip" class="el-upload__tip">
              支持扩展名：.doc .docx .pdf, 文件大小不得超过5M</div>
          </el-upload>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button size="mini" @click="closeDialog">取 消</el-button>
      <el-button size="mini" type="primary" @click="doSubmit">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { getBuildingList, uploadFileAPI, addContractAPI } from '@/api/park'
export default {
  data() {
    return {
      // true: 打开（显示）弹框  false（关闭）
      showDialog: false,
      form: {
        buildingId: '',
        rentPeriod: '',
        contractId: '',
        contractUrl: '',
        enterpriseId: '',
        type: '',
        startTime: '',
        endTime: ''
      },
      option: []

    }
  },
  async created() {
    const res = await getBuildingList()
    this.option = res.data
    // console.log(this.option)
  },
  methods: {
    // 这个函数关闭控制新增状态下的弹框显示
    openAddDialog(row, type) {
      // this.idEdit = false
      this.showDialog = true
      console.log(row.id)
      this.form.type = type
      this.form.enterpriseId = row.id
      this.row = row
    },
    // 专门控制编辑状态下的弹框显示
    openEditDialog(id) {
      this.isEdit = true
      console.log('企业id', id)
      // 1. 调接口
      // 2. 显示弹框
      this.showDialog = true
    },
    // 打开
    addRent() {
      this.showDialog = true
    },
    // 关闭
    closeDialog() {
      console.log('弹框要关闭了')
      this.showDialog = false
    },
    async uploadRequest(data) {
      console.log(data)
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('type', 'contract')
      const res = await uploadFileAPI(formData)
      this.form.contractId = res.data.id
      this.form.contractUrl = res.data.url
      // 需要手动校验
      // console.log(this.$refs.ruleForm)
      //
      // this.$refs.ruleForm.validateField('businessLicenseId')
    },
    beforeUpload(file) {
      if (file.size / 1024 / 1024 > 5) {
        this.$message.error('文件大小不能超过5M')
        return false
      }
      const list = ['application/doc', 'application/docx', 'application/pdf']
      // 存储需要的格式
      if (!list.includes(file.type)) {
        this.$message.error('文件类型必须为doc,docx,pdf格式')
        return false
      }
    },
    async doSubmit() {
      this.form.startTime = this.form.rentPeriod[0]
      this.form.endTime = this.form.rentPeriod[1]
      const { rentPeriod, ...formWithoutRentPeriod } = this.form
      await addContractAPI(formWithoutRentPeriod)
      this.showDialog = false
      this.$emit('update', this.row)
    }
  }
}
</script>

