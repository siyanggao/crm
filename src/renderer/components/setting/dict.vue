<template>
<div>
  <el-table :data="data" style="width:100%">
    <el-table-column prop="label" label="名称" width="180"></el-table-column>
    <el-table-column prop="type" label="类型" width="180"></el-table-column>
    <el-table-column prop="sequence" label="序号" width="180"></el-table-column>
    <el-table-column
      label="操作"
      width="180">
      <template slot-scope="scope">
        <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
        <el-button @click="del(scope.row)" type="text" size="small" style="color:#f56c6c">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <el-button @click="add">add</el-button>
</div>
</template>
<script>
export default {
  data () {
    return {
      data: []
    }
  },
  mounted: function () {
    this.getData()
  },
  methods: {
    getData () {
      this.$db.query(this.$mapper.dictSelect, {}, rows => {
        this.data = rows
      })
    },
    add () {
      this.$router.push({name: 'setting_dictAddOrEdit', query: {addOrEdit: 0}})
    },
    edit (data) {
      this.$router.push({name: 'setting_dictAddOrEdit', query: {addOrEdit: 1, data: data}})
    },
    del (data, index) {
      this.$msg.confirmDel()
        .then(() => {
          this.$db.exec(this.$mapper.dictDel, data.id, () => {
            this.$msg.succ('删除成功')
            this.data.splice(index, 1)
          })
        })
    }
  }
}
</script>


