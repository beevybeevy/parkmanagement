<template>
  <el-dialog
    title="添加合同"
    :visible="showDialog"
    width="580px"
    @close="closeDialog"
  >
    <!-- 表单区域 -->
    <div class="form-container">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="活动区域">
          <el-select v-model="form.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button size="mini" @click="closeDialog">取 消</el-button>
      <el-button size="mini" type="primary">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      // true: 打开（显示）弹框  false（关闭）
      showDialog: false
    }
  },

  methods: {
    // 这个函数关闭控制新增状态下的弹框显示
    openAddDialog() {
      this.idEdit = false
      this.showDialog = true
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
    }
  }
}
</script>

