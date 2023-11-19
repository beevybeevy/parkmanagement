<template>
  <el-dialog
    title="计费规则"
    :visible="showDialog"
    width="50%"
    @close="closeDialog"
  >
    <!-- 表单接口 -->
    <div class="form-container">
      <el-form ref="addForm" :model="addForm" :rules="addFormRules" label-position="left" label-width="120px">
        <el-form-item label="计费规则编号" prop="ruleNumber">
          <el-input v-model="addForm.ruleNumber" placeholder="请输入计费规则编号" />
        </el-form-item>
        <el-form-item label="计费规则名称" prop="ruleName">
          <el-input v-model="addForm.ruleName" placeholder="请输入计费规则名称" />
        </el-form-item>
        <el-form-item label="计费方式" prop="chargeType">
          <el-radio-group v-model="addForm.chargeType" size="small">
            <el-radio label="duration" border>时长收费</el-radio>
            <el-radio label="turn" border>按次收费</el-radio>
            <el-radio label="partition" border>分段收费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>免费时长：
          <el-input-number v-model="addForm.freeDuration" controls-position="right" :min="1" placeholder="请输入免费时长" />
          分钟
        </el-form-item>
        <el-form-item label="收费上限">
          <el-input v-model="addForm.chargeCeiling" placeholder="请输入收费上限" />
        </el-form-item>
        <el-form-item v-if="addForm.chargeType === 'duration'" label="计费规则" prop="durationRule">
          <!-- 按时长收费区域 -->
          每<el-input-number v-model="addForm.durationTime" controls-position="right" :min="1" placeholder="请输入免费时长" />
          <el-select v-model="addForm.durationType" placeholder="请选择">
            <el-option
              label="小时"
              value="hour"
            />
            <el-option
              label="分钟"
              value="minute"
            />
          </el-select>
          <el-input v-model="addForm.durationPrice" placeholder="请输入" />元
        </el-form-item>
        <el-form-item v-if="addForm.chargeType === 'turn'" label="计费规则" prop="turnRule">
          <!-- 按次收费区域 -->
          <div class="turn">
            <span>每次</span>
            <el-input v-model="addForm.turnPrice" class="input-box" />
            <span>元</span>
          </div>
        </el-form-item>
        <el-form-item v-if="addForm.chargeType==='partition'" label="计费规则" prop="partitionRule">
          <!-- 按分段收费区域 -->
          <div class="partition">
            <div class="item">
              <el-input v-model="addForm.partitionFrameTime" class="input-box" />
              <span>小时内,每小时收费</span>
              <el-input v-model="addForm.partitionFramePrice" class="input-box" />
              <span>元</span>
            </div>
            <div class="item">
              <span>每增加</span>
              <el-input v-model="addForm.partitionIncreaseTime" class="input-box" />
              <span>小时,增加</span>
              <el-input v-model="addForm.partitionIncreasePrice" class="input-box" />
              <span>元</span>
            </div>
          </div>
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
import { addCarRuleAPI, checkCarRuleAPI, editCarRuleAPI } from '@/api/car'
export default {
  data() {
    return {
      // true: 打开（显示）弹框  false（关闭）
      showDialog: false,
      addForm: {
        ruleNumber: '', // 计费规则编号
        ruleName: '', // 计费规则名称
        chargeType: '', // 计费规则类型 duration / turn / partition
        chargeCeiling: null,
        freeDuration: null,
        // 时长计费独有字段
        durationTime: null, // 时长计费单位时间
        durationPrice: null, // 时长计费单位价格
        durationType: 'hour',
        // 按次收费独有字段
        turnPrice: null,
        // 分段计费独有字段
        partitionFrameTime: null, // 段内时间
        partitionFramePrice: null, // 段内费用
        partitionIncreaseTime: null, // 超出时间
        partitionIncreasePrice: null // 超出费为收费价钱
      },
      // 计费规则表单对象
      addFormRules: {
        ruleNumber: [
          {
            required: true,
            message: '请输入规则编号',
            trigger: 'blur'
          }
        ],
        ruleName: [
          {
            required: true,
            message: '请输入规则名称',
            trigger: 'blur'
          }
        ],
        chargeType: [
          {
            required: true,
            message: '请选择收费类型',
            trigger: 'blur'
          }
        ],
        durationRule: [
          {
            validator: (rule, value, callback) => {
              // 如果不是 时长收费 ，就直接放过，无需校验
              if (this.addForm.chargeType !== 'duration') {
                callback()
                return
              }
              if (!this.addForm.durationTime) {
                callback(new Error('计费时长不能为空'))
                return
              }
              if (!this.addForm.durationPrice) {
                callback(new Error('计费价格不能为空'))
                return
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        turnRule: [
          {
            validator: (rule, value, callback) => {
              // 如果不是 按次收费 ，就直接放过，无需校验
              if (this.addForm.chargeType !== 'turn') {
                callback()
                return
              }
              if (!this.addForm.turnPrice) {
                callback(new Error('计费金额不能为空'))
                return
              }
              callback()
            },
            trigger: 'blur'
          }
        ],
        partitionRule: [
          {
            validator: (rule, value, callback) => {
              // 如果不是 分段收费 ，就直接放过，无需校验
              if (this.addForm.chargeType !== 'partition') {
                callback()
                return
              }
              if (!this.addForm.partitionFrameTime || !this.addForm.partitionIncreaseTime) {
                callback(new Error('计费时间不能为空'))
                return
              }
              if (!this.addForm.partitionFramePrice || !this.addForm.partitionIncreasePrice) {
                callback(new Error('计费金额不能为空'))
                return
              }
              callback()
            },
            trigger: 'blur'
          }
        ]
      }
    }
  },

  watch: {
    // 当计费类型变化时，清空 三个计费规则 的校验错误
    'addForm.chargeType': function() {
      const ruleName = ['durationRule', 'turnRule', 'partitionRule']
      this.$refs.addForm.clearValidate(ruleName)
    }
  },

  methods: {
    // 这个函数关闭控制新增状态下的弹框显示
    openAddDialog() {
      this.idEdit = false
      this.showDialog = true
    },
    // 专门控制编辑状态下的弹框显示
    async openEditDialog(id) {
      this.isEdit = true
      this.id = id
      // 1. 调接口
      const res = await checkCarRuleAPI(id)
      console.log(res)
      Object.keys(this.addForm).forEach((key) => {
        this.addForm[key] = res.data[key]
      })
      // for (const [key] of Object.entries(this.addForm)) {
      //   this.addForm[key] = res.data[key]
      // }
      // 2. 显示弹框
      this.showDialog = true
    },
    // 点击确定按钮执行提交
    doSubmit() {
      // 1. 表单校验
      // 2. 调接口，发请求
      // 3. 提示用户，触发事件给父组件
      // 4. 【父组件实现】父组件收到事件以后更新列表渲染
      const fn = this.isEdit ? editCarRuleAPI : addCarRuleAPI
      this.$refs.addForm.validate()
        .then(() => {
          if (this.isEdit) {
            this.addForm.id = this.id
          }
          // console.log('校验成功')
          fn(this.addForm).then(() => {
            this.$message.success('添加规则成功')
            this.showDialog = false
            this.$emit('update')
            // 还需要清空表单
            this.$refs.addForm.resetField()
          })
        })
        .catch(() => {
          console.log('校验失败')
        })
    },
    // 关闭
    closeDialog() {
      console.log('弹框要关闭了')
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.duration, .turn, .partition .item {
  display: flex;

  span {
    white-space: nowrap;
    padding: 0 10px;
  }
}
.partition .item {
  margin-bottom: 15px;
}
</style>
