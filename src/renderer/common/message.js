import Vue from 'vue'

let message = {}

message.succ = function (msg) {
  msg = msg || '保存成功'
  Vue.prototype.$message({
    message: msg,
    type: 'success'
  })
}

message.confirmDel = function () {
  let p = new Promise(function (resolve, reject) {
    Vue.prototype.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      resolve()
    }).catch(() => {
    })
  })
  return p
}

message.confirm = function (msg) {
  let p = new Promise(function (resolve, reject) {
    Vue.prototype.$confirm(msg, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(() => {
      resolve()
    }).catch(() => {
    })
  })
  return p
}

message.warning = function (msg) {
  let p = new Promise(function (resolve, reject) {
    Vue.prototype.$message({
      message: msg,
      type: 'warning'
    })
  })
  return p
}

export default message
