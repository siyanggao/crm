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
        <el-button
          type="text"
          size="mini"
          @click="() => append(data)">
          Append
        </el-button>
        <el-button
          type="text"
          size="mini"
          @click="() => remove(node, data)">
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
        console.log(rows)
      })
    },
    append (data) {
      const newChild = { id: 1, label: 'testtest', children: [] }
      data.children.push(newChild)
    },
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    }
  }
}
</script>


