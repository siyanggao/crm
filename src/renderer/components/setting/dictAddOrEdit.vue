<template>
<div>
  <el-form ref="form" :model="form" label-width="80px" :rules="rules" class="demo-ruleForm">
    <el-form-item label="名称" prop="label">
      <el-input v-model="form.label"></el-input>
    </el-form-item>
    <el-form-item label="类型" prop="type">
      <el-input v-model="form.type"></el-input>
    </el-form-item>
    <el-form-item label="顺序" prop="sequence">
      <el-input type="number" v-model="form.sequence"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="back">返回</el-button>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
export default {
  data () {
    return {
      addOrEdit: 0,
      form: {},
      rules: {
        label: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur' }
        ],
        sequence: [
          {required: true, message: '序号不能为空'}
        ]
      }
    }
  },
  mounted: function () {
    this.addOrEdit = this.$route.query.addOrEdit
    if (this.addOrEdit === 1) {
      this.form = this.$route.query.data
    }
  },
  methods: {
    onSubmit () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.$util.isNull(this.form.id)) {
            this.$db.insert(this.$mapper.dictAdd, {
              '1': this.form.label,
              '2': this.form.type,
              '3': this.form.sequence
            }, id => {
              this.$msg.succ()
              this.$router.go(-1)
            })
          } else {
            this.$db.exec(this.$mapper.dictEdit, {
              '1': this.form.label,
              '2': this.form.type,
              '3': this.form.sequence,
              '4': this.form.id
            }, () => {
              this.$msg.succ()
              this.$router.go(-1)
            })
          }
        }
      })
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>

