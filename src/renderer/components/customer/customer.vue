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
      <el-form-item label="客户名称"><el-input v-model="search.name"></el-input></el-form-item>
      <el-form-item label="国家"><el-input v-model="search.country"></el-input></el-form-item>
      <el-form-item label="邮箱"><el-input v-model="search.email"></el-input></el-form-item>
      <el-form-item label="客户级别">
        <el-select v-model="search.level" placeholder="请选择客户级别" clearable>
          <el-option v-for="item in levelOption" :key="item.id" :value="item.id" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="withSearch=true;getData()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" style="width:100%">
      <el-table-column type="index" label="序号" min-width="50"></el-table-column>
      <el-table-column prop="level_label" label="客户级别" min-width="100"></el-table-column>
      <el-table-column prop="name" label="名称" width="180"></el-table-column>
      <el-table-column prop="country" label="国家" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="addr" label="地址" width="180"></el-table-column>
      <el-table-column prop="company" label="公司" width="180"></el-table-column>
      <el-table-column prop="phone" label="电话传真" width="180"></el-table-column>
      <el-table-column prop="website" label="公司网址" width="180"></el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button @click="detail(scope.row)" type="text" size="small">查看</el-button>
          <el-button @click="enquiry(scope.row)" type="text" size="small">询盘</el-button>
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
      withSearch: false,
      levelOption: []
    }
  },
  mounted: function () {
    this.dbIsInit()
      .then(() => {
        this.getGroupData()
        this.getLevel()
      })
  },
  methods: {
    getData () {
      let ids = this.getChildIds(this.selectedGroup).replace(/,$/gi, '')
      let sql = this.$mapper.customerSelect.replace(/ids/, ids)
      let condition = ''
      if (this.withSearch) {
        if (!this.$util.isNull(this.search.name)) {
          condition += 'and name like "%' + this.search.name + '%" '
        }
        if (!this.$util.isNull(this.search.country)) {
          condition += 'and country like "%' + this.search.country + '%" '
        }
        if (!this.$util.isNull(this.search.email)) {
          condition += 'and email like "%' + this.search.email + '%" '
        }
        if (!this.$util.isNull(this.search.level)) {
          condition += 'and level =' + this.search.level + ' '
        }
      }
      sql = sql.replace(/condition/, condition)
      this.$db.query(sql.replace(/fields/, 'count(*) as count'), [1000000, 0], rows => {
        this.totalLength = rows[0].count
      })
      this.$db.query(sql.replace(/fields/, 'customer.*,t3.label as level_label'), [this.limit, this.page * this.limit], rows => {
        this.tableData = rows
      })
    },
    enquiry (data) {
      this.$router.push({name: 'enquiry', query: {customerId: data.id}})
    },
    selectGroupHandler (data) {
      this.selectedGroup = data
      this.withSearch = false
      this.getData(false)
    },
    getGroupData () {
      this.$db.query(this.$mapper.customerGroupSelect, {}, rows => {
        this.convertToElTreeData(rows, this.groupData[0])
        this.selectedGroup = this.groupData[0]
        this.getData()
      })
    },
    add () {
      this.$router.push({name: 'customerAddOrEdit', query: {addOrEdit: 0}})
    },
    edit (data) {
      this.$db.query(this.$mapper.customerGroupGet, data.group_id, rows => {
        data.group_label = rows[0].label
        this.$router.push({name: 'customerAddOrEdit', query: {addOrEdit: 1, data: data}})
      })
    },
    detail (data) {
      this.$db.query(this.$mapper.customerGroupGet, data.group_id, rows => {
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
    },
    dbIsInit () {
      let p = new Promise((resolve, reject) => {
        let id = setInterval(() => {
          if (this.$db.hasInit) {
            clearInterval(id)
            resolve()
          }
        }, 10)
      })
      return p
    },
    getLevel () {
      this.$db.query(this.$mapper.dictSelectByType, 'customer_level', rows => {
        this.levelOption = rows
      })
    }
  }
}
</script>


