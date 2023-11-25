<template>
  <el-dialog title="添加一体杆" :visible.sync="showDialog">
    <el-form ref="form" :model="form" :rules="rodRules">
      <el-form-item label="一体杆名称" label-width="120px" prop="poleName">
        <el-input v-model="form.poleName" autocomplete="off" placeholder="请输入一体杆名称" />
      </el-form-item>
      <el-form-item label="一体杆编号" label-width="120px" prop="poleNumber">
        <el-input v-model="form.poleNumber" autocomplete="off" placeholder="请输入一体杆编号" :disabled="!!targetId" />
      </el-form-item>
      <el-form-item label="一体杆IP" label-width="120px" prop="poleIp">
        <el-input v-model="form.poleIp" autocomplete="off" placeholder="请输入一体杆IP" />
      </el-form-item>
      <el-form-item label="关联区域" label-width="120px" prop="areaId">
        <el-select v-model="form.areaId" placeholder="请选择关联区域">
          <el-option v-for="item in areaOptions" :key="item.areaId" :label="item.areaName" :value="item.areaId" />
        </el-select>
      </el-form-item>
      <el-form-item label="一体杆类型" label-width="120px" prop="poleType">
        <el-select v-model="form.poleType" placeholder="请选择一体杆类型">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClose">取 消</el-button>
      <el-button type="primary" @click="doSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getReferredAreaListAPI, addRodAPI, editRodAPI } from '@/api/rod'
import { createRequiredRule, createPatternRule } from '@/utils/validate'
export default {
  name: 'AddRod',
  props: {

  },
  data() {
    return {
      showDialog: false,
      form: {
        poleName: '',
        poleNumber: '',
        poleIp: '',
        areaId: '',
        poleType: ''
      },
      areaOptions: [],
      typeOptions: [
        { label: '入口', value: 'entrance' },
        { label: '出口', value: 'export' }
      ],
      rodRules: {
        poleName: [createRequiredRule('必填项，不能为空')],
        poleNumber: [createRequiredRule('必填项，不能为空')],
        poleIp: [createRequiredRule('必填项，不能为空'),
          createPatternRule(/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, '请输入正确的IP地址')],
        areaId: [createRequiredRule('必选项，不能为空')],
        poleType: [createRequiredRule('必填项，不能为空')]
      },
      filterForm: {},
      targetId: ''
    }
  },
  created() {
    this._form = { ...this.form }
    this.getReferredAreaList()
  },
  methods: {
    async getReferredAreaList() {
      const res = await getReferredAreaListAPI()
      //   console.log(res)
      this.areaOptions = res.data
    },
    handleClose() {
      this.form = { ...this._form }
    },
    doSubmit() {
      const fn = this.targetId ? editRodAPI : addRodAPI
      const data = this.targetId ? { ...this.form, id: this.targetId } : this.form
      //   if (this.targetId) {
      //     this.form.id = this.targetId
      //   }
      this.$refs.form.validate().then(() => {
        // console.log(this.form)
        // return fn(this.form)
        return fn(data)
      }).then(() => {
        this.$message.success('操作成功')
        this.showDialog = false
        this.$emit('update')
        this.handleDialogClose()
      }
      ).catch(() => {})
    },
    handleDialogClose() {
      this.showDialog = false
    },
    openAddDialog() {
      this.showDialog = true
    },
    openEditDialog(row) {
      this.showDialog = true
      this.targetId = row.id
      //   console.log(this.targetId)
      Object.keys(this.form).forEach(item => {
        this.form[item] = row[item]
      })
    //   this.form.id = this.targetId
    }
  }
}
</script>
