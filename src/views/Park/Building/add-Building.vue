<template>
  <el-dialog title="添加楼宇" :visible.sync="showDialog">
    <el-form ref="form" :model="form" :rules="BuildingRules">
      <el-form-item label="楼宇名称" label-width="120px" prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入楼宇名称" />
      </el-form-item>
      <el-form-item label="楼宇层数" label-width="120px" prop="floors">
        <el-input v-model="form.floors" autocomplete="off" placeholder="请输入楼宇层数" />
      </el-form-item>
      <el-form-item label="在管面积" label-width="120px" prop="area">
        <el-input v-model="form.area" autocomplete="off" placeholder="请输入在管面积" />m²
      </el-form-item>
      <el-form-item label="物业费" label-width="120px" prop="propertyFeePrice">
        <el-input v-model="form.propertyFeePrice" autocomplete="off" placeholder="请输入物业费" />元/m²
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleDialogClose">取 消</el-button>
      <el-button type="primary" @click="doSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { createRequiredRule } from '@/utils/validate'
import { addBuidingAPI, checkBuildingAPI, editBuildingAPI } from '@/api/park'
export default {
  name: 'AddBuilding',
  data() {
    return {
      form: {
        name: '',
        floors: '',
        area: '',
        propertyFeePrice: ''
      },
      showDialog: false,
      BuildingRules: {
        name: [createRequiredRule('必填项，不能为空')],
        floors: [createRequiredRule('必填项，不能为空')],
        area: [createRequiredRule('必填项，不能为空')],
        propertyFeePrice: [createRequiredRule('必填项，不能为空')]
      }
    }
  },
  created() {
    this._form = { ...this.form }
  },
  methods: {
    openDialog() {
      this.showDialog = true
    },
    async openEditDialog(id) {
      this.showDialog = true
      const res = await checkBuildingAPI(id)
      console.log(res)
      Object.keys(this.form).forEach((item) => {
        this.form[item] = res.data[item]
      })
      this.form.id = id
    },
    handleDialogClose() {
      this.showDialog = false
      this.form = { ...this._form }
    },
    doSubmit() {
      const fn = this.form.id ? editBuildingAPI : addBuidingAPI
      this.$refs.form.validate().then(() => {
        fn(this.form)
      }).then(() => {
        this.$message.success('添加楼宇成功')
        this.$emit('update')
        this.handleDialogClose()
      })
    }
  }

}
</script>

<style>

</style>
