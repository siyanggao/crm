<template>
<div>
  <el-tree
    :data="data"
    node-key="id"
    default-expand-all
    :expand-on-click-node="false">
    <span class="custom-tree-node" slot-scope="{ node, data }" style="width:100%">
      <span style="font-size:14px">{{ node.label }}</span>
      <span style="float:right">
        <el-button type="text" size="mini" @click="() => append(data)">
          Append
        </el-button>
        <el-button type="text" size="mini" @click="() => edit(data)">
          Edit
        </el-button>
        <el-button type="text" size="mini" @click="() => remove(node, data)">
          Delete
        </el-button>
      </span>
    </span>
  </el-tree>
</div>
</template>
<script>
export default {
  data () {
    return {
      data: [{
        id: 0,
        label: '客户分组',
        children: []
      }]
    }
  },
  mounted: function () {
    this.getData()
  },
  methods: {
    getData () {
      this.$db.query('select * from customer_group', {}, rows => {
        this.convertToElTreeData(rows, this.data[0])
      })
    },
    append (data) {
      this.$prompt('请输入分组名称', '提示')
        .then(name => {
          this.$db.insert(this.$mapper.customerGroupAdd, {'1': name.value, '2': data.id}, id => {
            const newChild = { id: id, label: name.value, children: [] }
            data.children.push(newChild)
          })
        })
    },
    edit (data) {
      this.$prompt('请输入分组名称', '提示')
        .then(name => {
          this.$db.exec(this.$mapper.customerGroupEdit, {'1': name.value, '2': data.id}, () => {
            data.label = name.value
          })
        })
    },
    remove (node, data) {
      this.$msg.confirmDel()
        .then(() => {
          this.$db.exec(this.$mapper.customerGroupDel, {'1': data.id}, () => {
            const parent = node.parent
            const children = parent.data.children || parent.data
            const index = children.findIndex(d => d.id === data.id)
            children.splice(index, 1)
          })
        })
    },
    convertToElTreeData (rows, parent) {
      rows.forEach(row => {
        if (row.parent_id === parent.id) {
          parent.children = parent.children || []
          parent.children.push(row)
          this.convertToElTreeData(rows, row)
        }
      })
    }
  }
}
</script>


