<template>
  <div class="login_body">
    <div class="bg" />
    <div class="box">
      <div class="title">智慧园区-登录</div>
      <el-form ref="form" :model="formData" :rules="rules">
        <el-form-item
          label="账号"
          prop="username"
        >
          <el-input v-model="formData.username" placeholder="请输入用户名" />
        </el-form-item>

        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="formData.password" placeholder="请输入密码" type="password" />
        </el-form-item>

        <el-form-item prop="remember">
          <el-checkbox v-model="rememberMe">记住我</el-checkbox>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" class="login_btn" @click="doLogin(formData)">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  data: function() {
    return {
      formData: {
        username: '',
        password: ''
      },
      rememberMe: false,
      rules: {
        username: [
          { required: true, message: '用户名不能为空' }
        ],
        password: [
          { message: '密码不能为空', min: 4, max: 10, trigger: 'blur' }// 这里定义了最少和最多的位数，所以可以不用写required
        ]
      }
    }
  },
  created() {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'))
    if (userInfo) {
      this.formData.username = userInfo.username
      this.formData.password = userInfo.password
      this.rememberMe = true
    }
  },
  methods: {
    doLogin() {
      this.$refs.form.validate()
        .then(() => {
          // 数据持久化
          return this.$store.dispatch('user/userLoginAction', this.formData)
        })
        .then(() => {
          this.rememberMe
            ? localStorage.setItem('userInfo', JSON.stringify(this.formData)) : localStorage.removeItem('userInfo')
          this.$router.push('/workbench')
        })
        .catch(() => {})
    }
  }

}

</script>

<style scoped lang="scss">
  .login_body {
    display: flex;
  }
  .bg {
    width: 60vw;
    height: 100vh;
    background: url('~@/assets/login-bg.svg') no-repeat;
    background-position: right top;
    background-size: cover;
  }
  .box {
    margin: 200px 10% 0;
    flex: 1;
    .title {
      padding-bottom: 76px;
      font-size: 26px;
      font-weight: 500;
      color: #1e2023;
    }
    ::v-deep() {
      .ant-form-item {
        display: flex;
        margin-bottom: 62px;
        flex-direction: column;
      }
      .ant-form-item-label label {
        font-size: 16px;
        color: #8b929d;
      }
      .ant-input,
      .ant-input-password {
        border-radius: 8px;
      }
    }
  }
  .login_btn{
    width: 100%;
  }
</style>
