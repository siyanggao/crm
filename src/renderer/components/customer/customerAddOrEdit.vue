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
      <el-button @click="selectGroupHandler" size="mini" v-if="addOrEdit!==2">选择</el-button>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit" v-if="addOrEdit!==2">保存</el-button>
      <el-button @click="back">返回</el-button>
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
      addOrEdit: 0,
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
    this.addOrEdit = this.$route.query.addOrEdit
    if (this.addOrEdit === 1) {
      this.form = this.$route.query.data
    }
    if (this.addOrEdit === 2) {
      this.form = this.$route.query.data
    }
  },
  methods: {
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.$util.isNull(this.form.id)) {
            this.$db.insert(this.$mapper.customerAdd, {
              '1': this.form.group_id,
              '2': this.form.name,
              '3': this.form.country,
              '4': this.form.addr
            }, id => {
              this.$msg.succ()
              this.$router.go(-1)
            })
          } else {
            this.$db.exec(this.$mapper.customerEdit, {
              '1': this.form.group_id,
              '2': this.form.name,
              '3': this.form.country,
              '4': this.form.addr,
              '5': this.form.id
            }, () => {
              this.$msg.succ()
              this.$router.go(-1)
            })
          }
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



