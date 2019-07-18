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
    <el-form :inline="true" :model="search" ref="form" :hide-required-asterisk="true" class="demo-form-inline">
      <el-form-item label="客户名称">
        <el-input v-model="search.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="withSearch=true;getData()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width:100%">
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="country" label="国家" width="180"></el-table-column>
      <el-table-column prop="addr" label="地址" width="180"></el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button @click="detail(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="edit(scope.row)" type="text" size="small">编辑</el-button>
          <el-button @click="del(scope.row)" type="text" size="small" style="color:#f56c6c">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next"
      @current-change="pageChange"
      :total="totalLength">
    </el-pagination>
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
      selectedGroup: '',
      page: 0,
      limit: 10,
      totalLength: 0,
      search: {},
      withSearch: false
    }
  },
  mounted: function () {
    this.getGroupData()
  },
  methods: {
    getData () {
      let ids = this.getChildIds(this.selectedGroup).replace(/,$/gi, '')
      let sql = this.$mapper.customerSelect.replace(/ids/, ids)
      let condition = ''
      if (this.withSearch) {
        if (!this.$util.isNull(this.search.name)) {
          condition += 'name like "%' + this.search.name + '%" '
        }
        if (!this.$util.isNull(condition)) {
          condition = 'and ' + condition
        }
      }
      sql = sql.replace(/condition/, condition)
      this.$db.query(sql.replace(/fields/, 'count(*) as count'), [1000000, 0], rows => {
        this.totalLength = rows[0].count
      })
      this.$db.query(sql.replace(/fields/, '*'), [this.limit, this.page * this.limit], rows => {
        this.tableData = rows
      })
    },
    selectGroupHandler (data) {
      this.selectedGroup = data
      this.withSearch = false
      this.getData(false)
    },
    getGroupData () {
      this.$db.query('select * from customer_group', {}, rows => {
        this.convertToElTreeData(rows, this.groupData[0])
        this.selectedGroup = this.groupData[0]
        this.getData()
      })
    },
    add () {
      this.$router.push({name: 'customerAddOrEdit', query: {addOrEdit: 0}})
    },
    edit (data) {
      this.$db.query(this.$mapper.customerGroupSelect, data.group_id, rows => {
        data.group_label = rows[0].label
        this.$router.push({name: 'customerAddOrEdit', query: {addOrEdit: 1, data: data}})
      })
    },
    detail (data) {
      this.$db.query(this.$mapper.customerGroupSelect, data.group_id, rows => {
        data.group_label = rows[0].label
        this.$router.push({name: 'customerAddOrEdit', query: {addOrEdit: 2, data: data}})
      })
    },
    del (data, index) {
      this.$msg.confirmDel()
        .then(() => {
          this.$db.exec(this.$mapper.customerDel, data.id, () => {
            this.$msg.succ('删除成功')
            this.tableData.splice(index, 1)
          })
        })
    },
    pageChange (page) {
      this.page = page - 1
      this.getData()
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


