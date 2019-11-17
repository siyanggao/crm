<template>
<el-container>
  <el-header>
    <el-image
      style="width: 15rem; height: 100%; margin-right: 2rem"
      src="static/logo.png"></el-image>
    <el-menu :default-active="$route.path" class="el-menu-demo" mode="horizontal" :router="true"
      style="display:inline-block"
      active-text-color="#409EFF">
      <el-menu-item index="/">客户管理</el-menu-item>
      <el-submenu index="setting">
        <template slot="title">设  置</template>
        <el-menu-item index="/setting/customer_group">客户分组</el-menu-item>
        <el-menu-item index="/setting/dict">字典</el-menu-item>
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
