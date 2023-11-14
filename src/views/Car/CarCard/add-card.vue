<template>
  <div v-loading="isLoading" class="add-card">
    <header class="add-header">
      <el-page-header content="增加月卡" @back="$router.back()" />
    </header>
    <main class="add-main">
      <div class="form-container">
        <div class="title">车辆信息</div>
        <div class="form">
          <el-form ref="carForm" label-width="100px" :model="carInfoForm" :rules="carInfoRules">
            <el-form-item label="车主姓名" prop="personName">
              <el-input v-model="carInfoForm.personName" />
            </el-form-item>
            <el-form-item label="联系方式" prop="phoneNumber">
              <el-input v-model="carInfoForm.phoneNumber" />
            </el-form-item>
            <el-form-item label="车辆号码" prop="carNumber">
              <el-input v-model="carInfoForm.carNumber" />
            </el-form-item>
            <el-form-item label="车辆品牌" prop="carBrand">
              <el-input v-model="carInfoForm.carBrand" />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="form-container">
        <div class="title">最新一次月卡缴费信息</div>
        <div class="form">
          <el-form ref="feeForm" label-width="100px" :rules="feeFormRules" :model="feeForm">
            <el-form-item label="有效日期" prop="payTime">
              <el-date-picker
                v-model="feeForm.payTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </el-form-item>
            <el-form-item label="支付金额" prop="paymentAmount">
              <el-input v-model="feeForm.paymentAmount" />
            </el-form-item>
            <el-form-item label="支付方式" prop="paymentMethod">
              <el-select v-model="feeForm.paymentMethod">
                <el-option
                  v-for="item in payMethodList"
                  :key="item.id"
                  :value="item.id"
                  :label="item.name"
                />
              </el-select>
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
import { createRequiredRule, createPatternRule } from '@/utils/validate'
import { addCarCardAPI, getCarCardDetailAPI } from '@/api/car'
export default {
  data() {
    return {
      isLoading: false,
      carInfoForm: {
        personName: '', // 车主姓名
        phoneNumber: '', // 联系方式
        carNumber: '', // 车牌号码
        carBrand: '' // 车辆品牌
      },
      feeForm: {
        payTime: '', // 支付时间
        paymentAmount: null, // 支付金额
        paymentMethod: ''// 支付方
      },
      carInfoRules: {
        personName: [
          createRequiredRule('请输入车主姓名')
        ],
        phoneNumber: [
          createRequiredRule('请输入联系方式')
        ],
        carNumber: [
          createRequiredRule('请输入车辆号码'),
          createPatternRule(/^[\u4E00-\u9FA5][\da-zA-Z]{7}$/, '请输入正确的车牌号')
        ],
        carBrand: [
          createRequiredRule('请输入车辆品牌')
        ]
      },
      feeFormRules: {
        payTime: [
          createRequiredRule('请选择支付时间')
        ],
        paymentAmount: [
          createRequiredRule('请输入支付金额')
        ],
        paymentMethod: [
          createRequiredRule('请选择支付方式')
        ]
      },
      payMethodList: [
        {
          id: 'Alipay',
          name: '支付宝'
        },
        {
          id: 'WeChat',
          name: '微信'
        },
        {
          id: 'Cash',
          name: '线下'
        }
      ]
    }
  },
  async created() {
    this.isLoading = true
    // 这里使用的是浅拷贝,不能直接写this.__carInfoForm = this.carInfoForm是因为这样就直接赋值了，不是拷贝
    this.__carInfoForm = { ...this.carInfoForm }
    this.__feeForm = { ...this.feeForm }
    const id = this.$route.query.id
    // console.log(id)

    const res = await getCarCardDetailAPI(id)
    this.isLoading = false
    console.log(res)
    this.carInfoForm = {
      personName: res.data.personName,
      phoneNumber: res.data.phoneNumber,
      carNumber: res.data.carNumber,
      carBrand: res.data.carBrand
    },
    this.feeForm = {
      payTime: [
        res.data.cardStartDate,
        res.data.cardEndDate
      ],
      paymentAmount: res.data.paymentAmount, // 支付金额
      paymentMethod: res.data.paymentMethod// 支付方
    }
  },
  methods: {
    doSubmit() {
      Promise.all([
        this.$refs.carForm.validate(),
        this.$refs.feeForm.validate()
      ])
        .then(() => {
          // console.log('校验成功')
          return addCarCardAPI({
            ...this.carInfoForm,
            cardStartDate: this.feeForm.payTime[0],
            cardEndDate: this.feeForm.payTime[1],
            paymentAmount: this.feeForm.paymentAmount,
            paymentMethod: this.feeForm.paymentAmount
          })
        }).then(() => {
          this.$message.success('添加月卡成功')
          // 这里使用直接跳回更好一些
          this.$router.back()
        })
        .catch(() => {
          console.log('校验失败')
        })
    },
    reset() {
      this.carInfoForm = { ...this.__carInfoForm }
      // 这里还需要重置一下校验信息，使用elementUI中的方法
      // 如果只有重置表单信息的话，就会出现表单数据清空但是校验提示信息不清空的情况
      this.$refs.carForm.clearValidate()
      this.feeForm = { ...this.__feeForm }
      this.$refs.feeForm.clearValidate()
    }
  }
}

</script>

    <style scoped lang="scss">
    .add-card {
      background-color: #f4f6f8;
      height: 100vh;

      .add-header {
        display: flex;
        align-items: center;
        padding: 0 20px;
        height: 64px;
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
            padding-left: 20px;
          }

          .form {
            margin-bottom: 20px;
            padding: 20px 65px 24px;

            .el-form {
              display: flex;
              flex-wrap: wrap;

              .el-form-item {
                width: 50%;
              }
            }
          }
        }
        .preview{
          img{
            width: 100px;
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

