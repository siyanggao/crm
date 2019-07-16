let util = {}

util.indexOf = function (arr, obj, field) {
  let i = arr.length
  while (i--) {
    if (field !== null && typeof (field) !== 'undefined') {
      if (arr[i][field] === obj) return i
    } else {
      if (arr[i] === obj) return i
    }
  }
  return -1
}

util.shallowCopy = function (src, dst, config) {
  dst = dst || {}
  if (util.isNull(config)) {
    config = {}
  }
  if (util.isNull(config.ignoreNullField)) {
    config.ignoreNullField = false
  }
  for (let prop in src) {
    if (src.hasOwnProperty(prop)) {
      if (config.ignoreNullField && (src[prop] === null || src[prop] === '')) {
        continue
      }
      dst[prop] = src[prop]
    }
  }
  return dst
}

util.deepCopy = function (src, dst) {
  dst = dst || {}
  for (let i in src) {
    let prop = src[i]
    if (!prop) {
      continue
    }
    if (prop === dst) { // 避免相互引用对象导致死循环，如initalObj.a = initalObj的情况
      continue
    }
    if (typeof prop === 'object') {
      dst[i] = (prop.constructor === Array) ? [] : {}
      util.deepCopy(prop, dst[i])
    } else {
      dst[i] = prop
    }
  }
  return dst
}

util.isNull = function (obj) {
  if (typeof (obj) === 'undefined') {
    return true
  }
  if (obj === null) {
    return true
  }
  if (obj === '') {
    return true
  }
  return false
}

util.dateFormat = function (date, fmt) {
  if (util.isNull(fmt)) {
    fmt = 'yyyy-MM-dd hh:mm:ss'
  }
  var o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}

// 表格内单元格数字格式化
util.cellNumFmt = function (row, column, cellValue, index) {
  if (!cellValue) {
    return cellValue
  }
  if (typeof (cellValue) !== 'number') {
    cellValue = parseFloat(cellValue)
  }
  if (cellValue) {
    return cellValue.toFixed(2)
  } else {
    return cellValue
  }
}

export default util
