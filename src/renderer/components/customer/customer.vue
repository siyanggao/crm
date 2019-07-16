<template>
<el-container>
  <el-aside>
    <el-tree
      :data="groupData"
      :expand-on-click-node="false"
      node-key="id"
      @node-click="selectGroupHandler">
    </el-tree>
  </el-aside>
  <el-main>
    main
  </el-main>
</el-container>
</template>
<script>
export default {
  data () {
    return {
      groupData: [{
        id: 0,
        children: []
      }],
      selectedGroup: ''
    }
  },
  mounted: function () {
    this.getGroupData()
  },
  methods: {
    getData (withSearch) {
      let ids = this.getChildIds(this.selectedGroup)
      this.$db.query(this.$mapper.customerSelect, {'1': ids}, rows => {
        console.log(rows)
      })
    },
    selectGroupHandler (data) {
      this.selectedGroup = data
      this.getData(false)
    },
    getGroupData () {
      this.$db.query('select * from customer_group', {}, rows => {
        this.convertToElTreeData(rows, this.groupData[0])
        this.groupData = this.groupData[0].children
        this.getData(false)
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
    },
    getChildIds (parent) {
      if (this.$util.isNull(parent)) {
        return
      }
      let ids = parent.id + ','
      if (!this.$util.isNull(parent.children)) {
        parent.children.forEach(item => {
          ids += this.getChildIds(item)
        })
      }
      ids = ids.replace(/,$/gi, '')
      return ids
    }
  }
}
</script>


