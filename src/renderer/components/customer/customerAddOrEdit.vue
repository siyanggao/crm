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
    <el-form-item label="公司"><el-input v-model="form.company"></el-input></el-form-item>
    <el-form-item label="电话传真"><el-input v-model="form.phone"></el-input></el-form-item>
    <el-form-item label="邮箱"><el-input v-model="form.email"></el-input></el-form-item>
    <el-form-item label="客户级别">
      <el-select v-model="form.level" placeholder="请选择客户级别">
        <el-option v-for="item in levelOption" :key="item.id" :value="item.id" :label="item.label"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="公司网址"><el-input v-model="form.website"></el-input></el-form-item>
    <el-form-item label="简介"><el-input type="textarea" v-model="form.introduce"></el-input></el-form-item>
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
      levelOption: [],
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
    this.getLevel()
  },
  methods: {
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.$util.isNull(this.form.id)) {
            this.$db.insert(this.$mapper.customerAdd, [
              this.form.group_id, this.form.name, this.form.country, this.form.addr, this.form.company,
              this.form.phone, this.form.email,
              this.form.level, this.form.website, this.form.introduce
            ], id => {
              this.$msg.succ()
              this.$router.go(-1)
            })
          } else {
            this.$db.exec(this.$mapper.customerEdit, [
              this.form.group_id, this.form.name, this.form.country, this.form.addr, this.form.company,
              this.form.phone, this.form.email,
              this.form.level, this.form.website, this.form.introduce, this.form.id
            ], () => {
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
    },
    getLevel () {
      this.$db.query(this.$mapper.dictSelectByType, 'customer_level', rows => {
        this.levelOption = rows
      })
    }
  },
  components: {
    CustomerGroupSelect
  }
}
</script>



