<template>
<el-container>
  <el-header >
    <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" :router="true">
      <el-menu-item index="/">客户管理</el-menu-item>
      <el-submenu index="setting">
        <template slot="title">设置</template>
        <el-menu-item index="/setting/customer_group">客户分组</el-menu-item>
      </el-submenu>
    </el-menu>
  </el-header>
  <el-main>
    <router-view/>
  </el-main>
</el-container>
</template>
<script>
export default {
  data () {
    return {
    }
  }
}
</script>
