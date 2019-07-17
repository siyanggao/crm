<template>
<div>
  <el-tree
    :data="groupData"
    :expand-on-click-node="false"
    node-key="id"
    @node-click="selectGroupHandler">
  </el-tree>
</div>
</template>
<script>
export default {
  data () {
    return {
      groupData: [{
        id: 0,
        children: []
      }]
    }
  },
  mounted: function () {
    this.getGroupData()
  },
  methods: {
    selectGroupHandler (data) {
      this.$emit('select', data)
    },
    getGroupData () {
      this.$db.query('select * from customer_group', {}, rows => {
        this.convertToElTreeData(rows, this.groupData[0])
        this.groupData = this.groupData[0].children
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


