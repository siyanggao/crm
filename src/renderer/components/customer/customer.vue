<template>
<el-container>
  <el-aside style="width:150px">
    <el-tree
      :data="groupData"
      :expand-on-click-node="false"
      node-key="id"
      @node-click="selectGroupHandler"
      :default-expanded-keys="[0]">
    </el-tree>
  </el-aside>
  <el-main>
    <el-table :data="tableData" style="width:100%">
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="country" label="国家" width="180"></el-table-column>
      <el-table-column prop="addr" label="地址" width="180"></el-table-column>
    </el-table>
    <el-button @click="add">add</el-button>
  </el-main>
</el-container>
</template>
<script>
export default {
  data () {
    return {
      tableData: [],
      groupData: [{
        id: 0,
        label: '客户分组',
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
      let ids = this.getChildIds(this.selectedGroup).replace(/,$/gi, '')
      let sql = this.$mapper.customerSelect.replace(/\?/, ids)
      console.log(sql)
      this.$db.query(sql, {}, rows => {
        this.tableData = rows
        console.log(this.tableData)
      })
    },
    selectGroupHandler (data) {
      this.selectedGroup = data
      this.getData(false)
    },
    getGroupData () {
      this.$db.query('select * from customer_group', {}, rows => {
        this.convertToElTreeData(rows, this.groupData[0])
        // this.groupData = this.groupData[0].children
        // this.selectedGroup = {
        //   children: this.groupData
        // }
        this.selectedGroup = this.groupData[0]
        this.getData(false)
      })
    },
    add () {
      this.$router.push({name: 'customerAddOrEdit', query: {addOrEdit: 0}})
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
      let ids = this.$util.isNull(parent.id) ? '' : parent.id + ','
      if (!this.$util.isNull(parent.children)) {
        parent.children.forEach(item => {
          ids += this.getChildIds(item)
        })
      }
      // ids = ids.replace(/,$/gi, '')
      // console.log(ids)
      return ids
    }
  }
}
</script>


