<template>
  <div class="add-enterprise">
    <header class="add-header">
      <div class="left">
        <span class="arrow" @click="$router.back()"><i class="el-icon-arrow-left" />返回</span>
        <span>|</span>
        <span>查看企业</span>
      </div>
      <div class="right">
        黑马程序员
      </div>
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">企业信息</div>
        <div class="form">
          <el-form ref="ruleForm" label-width="100px" :model="addForm">
            <el-form-item label="企业名称" prop="name">
              <span>{{ addForm.name }}</span>
            </el-form-item>
            <el-form-item label="法人" prop="legalPerson">
              <span>{{ addForm.legalPerson }}</span>
            </el-form-item>
            <el-form-item label="注册地址" prop="registeredAddress">
              <span>{{ addForm.registeredAddress }}</span>
            </el-form-item>
            <el-form-item label="所在行业" prop="industryCode">
              <span>{{ addForm.industryName }}</span>
            </el-form-item>
            <el-form-item label="企业联系人" prop="contact">
              <span>{{ addForm.contact }}</span>
            </el-form-item>
            <el-form-item label="联系电话" prop="contactNumber">
              <span>{{ addForm.contactNumber }}</span>
            </el-form-item>
            <el-form-item label="营业执照" prop="businessLicenseId">
              <img width="300px" :src="addForm.businessLicenseUrl" alt="">
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
    <footer class="add-footer">
      <div class="btn-container">
        <el-button @click="reset">重置</el-button>
        <el-button type="primary" @click="doSubmit">确定</el-button>
      </div>
    </footer>
  </div>
</template>

<script>
import { getIndustryListAPI, uploadFileAPI, addEnterpriseAPI, editEnterpriseAPI, getEnterpriseDetailAPI } from '@/api/park'
export default {
  data() {
    return {
      addForm: {
        name: '', // 企业名称
        legalPerson: '', // 法人
        registeredAddress: '', // 注册地址
        industryCode: '', // 所在行业
        contact: '', // 企业联系人
        contactNumber: '', // 联系人电话
        businessLicenseUrl: '', // 营业执照url
        businessLicenseId: '' // 营业执照id
      },

      options: [],
      value: '',
      fileList: [{ name: '', url: '' }]
    }
  },
  async created() {
    this.__addForm = { ...this.addForm }
    const res = await getIndustryListAPI()
    // console.log(res)
    this.options = res.data
    // 完成数据浅拷贝
    const id = Number(this.$route.query.id)
    // console.log(id)
    this.isEdit = !!id
    if (!this.isEdit) return
    this.id = id
    const detail = await getEnterpriseDetailAPI(id)
    console.log(detail)
    this.addForm.name = detail.data.name, // 企业名称
    this.addForm.legalPerson = detail.data.legalPerson, // 法人
    this.addForm.registeredAddress = detail.data.registeredAddress, // 注册地址
    this.addForm.industryName = detail.data.industryName, // 所在行业
    this.addForm.contact = detail.data.contact, // 企业联系人
    this.addForm.contactNumber = detail.data.contactNumber, // 联系人电话
    this.addForm.businessLicenseUrl = detail.data.businessLicenseUrl, // 营业执照url
    this.addForm.businessLicenseId = detail.data.businessLicenseId// 营业执照id
  },
  methods: {
    reset() {
      // 清空表单
      this.addForm = { ...this.__addForm }
      // 清空表单校验
      this.$refs.ruleForm.clearValidate()
    },
    doSubmit() {
      const fn = this.isEdit ? editEnterpriseAPI : addEnterpriseAPI
      if (this.isEdit) {
        this.addForm.id = this.id
      }
      console.log(this.addForm)
      // 手动校验
      Promise.all([this.$refs.ruleForm.validate(), this.$refs.ruleForm.validateField('businessLicenseId')])
        .then(() => {
          // console.log(this.addForm)
          return fn(this.addForm)
        }).then(() => {
          this.$message.success('操作成功')
          this.$router.back()
        }).catch(() => {
          console.log('校验失败')
        })
    },
    async uploadRequest(data) {
      console.log(data.file)
      const formData = new FormData()
      formData.append('file', data.file)
      formData.append('type', 'businessLicense')
      const res = await uploadFileAPI(formData)
      this.addForm.businessLicenseId = res.data.id
      this.addForm.businessLicenseUrl = res.data.url
      // 需要手动校验
      console.log(this.$refs.ruleForm)
      //
      this.$refs.ruleForm.validateField('businessLicenseId')
    },
    // 上传前校验文件类型
    beforeUpload(file) {
      if (file.size / 1024 / 1024 > 1) {
        this.$message.error('文件大小不能超过1M')
        return false
      }
      const list = ['image/png', 'image/jpg', 'image/jpeg']
      // 存储需要的格式
      if (!list.includes(file.type)) {
        this.$message.error('文件类型必须为npg,jpg,jpeg格式')
        return false
      }
    }
  }
}
</script>

    <style scoped lang="scss">
    .add-enterprise {
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
          .arrow{
            cursor: pointer;
          }
        }

        .right {
          text-align: right;
        }
      }

      .add-main {
        background: #f4f6f8;
        padding: 20px 130px;

        .form-container {
          background-color: #fff;
          .title {
            height: 60px;
            line-height: 60px;
            padding-left:20px;
          }
          .form {
            margin-bottom: 20px;
            padding: 20px 65px 24px;
            .el-form{
              display: flex;
              flex-wrap: wrap;
              .el-form-item{
                width: 50%;
              }
            }
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
      }
    }
    </style>

