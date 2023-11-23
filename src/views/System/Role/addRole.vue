<template>
  <div class="add-role">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>添加角色</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="step-container">
        <el-steps direction="vertical" :active="active">
          <el-step title="角色信息" />
          <el-step title="权限信息" />
          <el-step title="检查并完成" />
        </el-steps>
      </div>
      <div v-show="activeIndex === 1" class="form-container">
        <div class="title">角色信息</div>
        <div class="form">
          <el-form ref="roleNameForm" :model="form" :rules="rules">
            <el-form-item label="角色名称" prop="roleName">
              <el-input v-model="form.roleName" />
            </el-form-item>
            <el-form-item label="角色描述">
              <el-input v-model="form.remark" type="textarea" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div v-show="activeIndex === 2" class="form-container">
        <div class="title">权限配置</div>
        <div class="form">
          <div class="tree-wrapper">
            <div v-for="(item) in permissionList" :key="item.id" class="tree-item">
              <div class="tree-title"> {{ item.title }} </div>
              <el-tree
                ref="tree"
                :data="item.children"
                show-checkbox
                node-key="id"
                default-expand-all
                :props="{label:'title'}"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-show="activeIndex === 3" class="form-container">
        <div class="title">检查并完成</div>
        <div class="form">
          <div class="info">
            <div class="form-item">角色名称：{{ form.roleName }}</div>
            <div class="form-item">角色描述：{{ form.remark }}</div>
            <div class="form-item">角色权限：</div>
            <div class="tree-wrapper">
              <div v-for="item in diabledTree" :key="item.id" class="tree-item">
                <div class="tree-title">{{ item.title }}</div>
                <el-tree
                  ref="diabledTree"
                  :data="item.children"
                  show-checkbox
                  default-expand-all
                  node-key="id"
                  :highlight-current="false"
                  :props="{ label: 'title'}"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="prev">上一步</el-button>
        <el-button v-if="activeIndex === 3" type="primary" @click="doSubmit">确认添加</el-button>
        <el-button v-else type="primary" @click="next">下一步</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { createRequiredRule } from '@/utils/validate'
import { getAllPermissionListAPI, addRoleAPI, updateRoleAPI, getRoleDetailAPI } from '@/api/system'

export default {
  data() {
    return {
      activeIndex: 1,
      active: 1,
      form: {
        roleName: '',
        remark: '',
        perms: []
      },
      rules: {
        roleName:
        [createRequiredRule('请输入角色名称')]
        // [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
      },
      permissionList: [],
      diabledTree: []

    }
  },
  mounted() {
    const id = this.$route.query.id
    if (id) {
      this.form.roleId = Number(id)
      this.getALLPermissionList()
      this.getRoleDetail(id)
    } else {
      this.getALLPermissionList()
    }
  },
  methods: {
    prev() {
      this.activeIndex > 1 && this.activeIndex--
      this.active > 1 && this.active--
    },
    next() {
      if (this.activeIndex === 1) {
        this.$refs.roleNameForm.validate().then(() => {
          this.activeIndex++
          this.active++
        })
      }
      if (this.activeIndex === 2) {
        // 当前是权限信息状态
        this.$refs.tree.forEach(tree => {
          this.form.perms.push(tree.getCheckedKeys())
        })
        if (this.form.perms.flat().length === 0) {
          // this.$messsage.error('请至少选择一项')
          console.log('请至少选择一项')
        } else {
          this.activeIndex++
          this.active++
          this.$refs.diabledTree.forEach((tree, index) => {
            tree.setCheckedKeys(this.form.perms[index])
          })
          // console.log(this.form.perms)
        }
      }
      if (this.activeIndex === 3) return
    },
    async getALLPermissionList() {
      const res = await getAllPermissionListAPI()
      // console.log('右侧权限数据', res)
      this.permissionList = res.data
      // 深拷贝
      this.diabledTree = JSON.parse(JSON.stringify(res.data))
      this.addDisabled(this.diabledTree)
    },
    // 编辑获取当前的数据
    async getRoleDetail(id) {
      const res = await getRoleDetailAPI(id)
      this.form.roleName = res.data.roleName
      this.form.remark = res.data.remark
      console.log('Detail', res)

      this.form.perms = res.data.perms
    },
    // 禁用按钮
    addDisabled(list) {
      list.forEach(item => {
        item.disabled = true
        if (item.children && item.children.length > 0) {
          this.addDisabled(item.children)
        }
      })
    },
    async doSubmit() {
      if (this.form.roleId) {
        console.log(this.form)
        await updateRoleAPI(this.form)
      } else {
        addRoleAPI(this.form)
      }
      this.$message.success(`${this.form.roleId ? '编辑' : '新增'}角色成功`)
      this.$router.back()
    }
  }

}
</script>
<style scoped lang="scss">
.add-role {
  background-color: #f4f6f8;
  height: 100vh;

  .add-header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 64px;
    line-height: 64px;
    font-size: 16px;
    font-weight: bold;
    background-color: #fff;

    .left {
      span {
        margin-right: 4px;
      }

      .arrow {
        cursor: pointer;
      }
    }

    .right {
      text-align: right;
    }
  }

  .add-main {
    position: fixed;
    top: 64px;
    bottom: 88px;
    width: 100%;
    overflow-y: auto;
    background: #f4f6f8;
    padding: 20px 230px;
    display: flex;
    .step-container {
      height: 400px;
      width: 200px;
    }
    .form-container {
      flex:1;
      background-color: #fff;
      overflow-y: auto;
      .title {
        height: 60px;
        line-height: 60px;
        padding-left: 20px;
      }
      .form {
        margin-bottom: 20px;
        padding: 20px 65px 24px;
        .el-form {
        //   display: flex;
          flex-wrap: wrap;
        }
        .info{
          font-size:14px;
          color:#666;
          .form-item{
            margin-bottom:20px;
          }
        }
      }
      .form-box{
        width: 600px;
        display: flex;
        flex-direction: column;
      }
    }
  }

  .add-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 24px 50px;
    color: #000000d9;
    font-size: 14px;
    background: #fff;
    text-align: center;
    z-index: 10001;
  }
  .tree-wrapper {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .tree-item {
        flex: 1;
        padding: 0px 4px;
        text-align: center;
        .tree-title {
          background: #f5f7fa;
          text-align: center;
          padding: 10px 0;
          margin-bottom: 12px;
        }
      }
    }
}
</style>
