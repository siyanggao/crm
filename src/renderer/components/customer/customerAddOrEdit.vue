<template>
<div>
  <el-form ref="form" :model="form" label-width="80px" :rules="rules" class="demo-ruleForm">
    <el-form-item label="客户名称" prop="name">
      <el-input v-model="form.name"></el-input>
    </el-form-item>
    <el-form-item label="国家">
      <el-input v-model="form.country"></el-input>
    </el-form-item>
    <el-form-item label="地址">
      <el-input v-model="form.addr"></el-input>
    </el-form-item>
    <el-form-item label="分组" required>
      <el-input v-model="form.group_id" v-show="false"></el-input>
      <el-form-item prop="group_label">
        <el-input v-model="form.group_label" :disabled="true"></el-input>
      </el-form-item>
      <el-button @click="selectGroupHandler" size="mini">选择</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
      <el-button @click="back">取消</el-button>
    </el-form-item>
  </el-form>
  <el-dialog title="选择分组" :visible.sync="dialogVisiable">
    <CustomerGroupSelect @select="selectGroup"></CustomerGroupSelect>
  </el-dialog>
</div>
</template>
<script>
import CustomerGroupSelect from '../customer_group_select'
export default {
  data () {
    return {
      form: {},
      dialogVisiable: false,
      rules: {
        name: [
          { required: true, message: '请输入客户名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        group_label: [
          { required: true, message: '请选择客户分组', trigger: 'blur' }
        ]
      }
    }
  },
  mounted: function () {
  },
  methods: {
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$db.insert(this.$mapper.customerAdd, {
            '1': this.form.group_id,
            '2': this.form.name,
            '3': this.form.country,
            '4': this.form.addr
          }, id => {
            this.$msg.succ()
            this.$router.go(-1)
          })
        }
      })
    },
    selectGroup (data) {
      this.form.group_label = data.label
      this.form.group_id = data.id
      this.dialogVisiable = false
    },
    selectGroupHandler () {
      this.dialogVisiable = true
    },
    back () {
      this.$router.go(-1)
    }
  },
  components: {
    CustomerGroupSelect
  }
}
</script>



