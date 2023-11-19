<template>
  <div class="add-rules">
    <div>
      <el-dialog title="添加计费规则" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="计费规则编号">
            <el-input v-model="form.ruleNumber" placeholder="请输入计费规则编号" />
          </el-form-item>
          <el-form-item label="计费规则名称">
            <el-input v-model="form.ruleName" placeholder="请输入计费规则名称" />
          </el-form-item>
          <el-form-item label="计费方式" prop="chargeType">
            <el-radio-group v-model="form.chargeType" size="small">
              <el-radio label="duration" border>时长收费</el-radio>
              <el-radio label="turn" border>按次收费</el-radio>
              <el-radio label="partition" border>分段收费</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>免费时长：
            <el-input-number v-model="form.freeDuration" controls-position="right" :min="1" placeholder="请输入免费时长" @change="handleChange" />
            分钟
          </el-form-item>
          <el-form-item label="收费上限">
            <!-- 这里占位问题还没有解决 -->
            <el-input v-model="form.chargeCeiling" placeholder="请输入收费上限" />
          </el-form-item>
          <!-- 按时长计费区域 -->
          <div v-if="form.chargeType==='duration'">
            <el-form-item>
              每<el-input-number v-model="form.durationTime" controls-position="right" :min="1" placeholder="请输入免费时长" @change="handleChange" />
              <el-select v-model="form.durationType" placeholder="请选择">
                <el-option
                  label="小时"
                  value="hour"
                />
                <el-option
                  label="分钟"
                  value="minute"
                />
              </el-select>
              <el-input v-model="form.durationPrice" placeholder="请输入" />元
            </el-form-item>
          </div>
          <div v-else-if="form.chargeType==='turn'">
            <el-form-item label="计费规则">
              每次<el-input v-model="form.turnPrice" placeholder="请输入金额" />元
            </el-form-item>
          </div>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      radio1: '1',
      dialogFormVisible: false,
      form: {
        ruleNumber: '',
        ruleName: '',
        freeDuration: '',
        chargeCeiling: '',
        chargeType: '',
        durationTime: '',
        durationPrice: '',
        durationType: '',
        turnPrice: null,
        partitionFrameTime: null,
        partitionFramePrice: null,
        partitionIncreaseTime: null,
        partitionIncreasePrice: null
      },
      num: ''
    }
  },
  methods: {
    openAddDialog() {
      this.dialogFormVisible = true
    },
    handleChange() {}
  }
}
</script>

<style>

</style>
