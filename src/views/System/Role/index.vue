<template>
  <div class="role-container">
    <div class="left-wrapper">
      <div v-for="(item,index) in roleList" :key="item.roleId" class="role-item" :class="{active:index === activeIndex}" @click="changeRole(index,item.roleId)">
        <div class="role-info">
          <svg-icon :icon-class="index === activeIndex ? 'user-active' : 'user'" class="icon" />
          {{ item.roleName }}
        </div>
        <div class="more">
          <svg-icon icon-class="more" />
        </div>
      </div>
      <el-button class="addBtn" size="mini" @click="$router.push('/addRole')">添加角色</el-button>
    </div>
    <div v-loading="isLoading" class="right-wrapper">
      <div class="tree-wrapper">
        <div v-for="(item,index) in permissionList" :key="item.id" class="tree-item">
          <div class="tree-title"> {{ item.title }} </div>
          <el-tree
            ref="tree"
            :data="item.children"
            show-checkbox
            node-key="id"
            default-expand-all
            :default-checked-keys="perms[index]"
            :props="{label:'title'}"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllRoleListAPI, getAllPermissionListAPI, checkRolePermissionAPI } from '@/api/system'
export default {
  name: 'Role',
  data() {
    return {
      roleList: [],
      activeIndex: 0,
      permissionList: [],
      id: '',
      perms: [],
      isLoading: false
    }
  },
  created() {
    this.getAllRoleList()
  },
  mounted() {
    this.getALLPermissionList()
  },
  methods: {
    async getAllRoleList() {
      const res = await getAllRoleListAPI()
      // console.log('左侧数据', res)
      this.roleList = res.data
    },
    async getALLPermissionList() {
      const res = await getAllPermissionListAPI()
      // console.log('右侧权限数据', res)
      this.permissionList = res.data
    },
    async changeRole(index, id) {
      this.activeIndex = index
      this.id = id
      this.isLoading = true
      const res = await checkRolePermissionAPI(id)
      this.perms = res.data.perms
      // console.log('根据左侧id查询出来角色的权限点', this.perms)
      // console.log(this.$refs.tree)
      this.getALLPermissionList()
      this.isLoading = false
    }
  }
}
</script>

<style scoped lang="scss">
.role-container {
  display: flex;
  font-size: 14px;
  background-color: #fff;
  padding:20px;
  .left-wrapper {
    width: 200px;
    border-right: 1px solid #e4e7ec;
    padding: 4px;
    text-align: center;

    .role-item {
      position: relative;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;

      &.active {
        background: #edf5ff;
        color: #4770ff;
      }
    }

    .role-info {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
      }
    }

    .more {
      display: flex;
      align-items: center;
    }
    .addBtn{
      width: 100%;
      margin-top: 20px;
    }
  }

  .right-wrapper {
    flex: 1;

    .tree-wrapper {
      display: flex;
      justify-content: space-between;

      .tree-item {
        flex: 1;
        border-right: 1px solid #e4e7ec;
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

    ::v-deep .el-tabs__nav-wrap {
      padding-left: 20px;
    }

    .user-wrapper{
      padding:20px;
    }
  }
}
</style>
