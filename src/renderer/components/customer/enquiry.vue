<template>
<div>
  <el-form ref="form" :model="enquiry" layout-width="80px">
    <el-form-item label="询盘"><el-input type="textarea" v-model="enquiry.content"></el-input></el-form-item>
    <el-form-item label="报价"><el-input type="number" v-model="enquiry.quote"></el-input></el-form-item>
  </el-form>
  <el-form ref="follow" layout-width="80px">
    <el-form-item label="跟进1"><el-input type="textarea" v-model="follow.follow0.content"></el-input></el-form-item>
    <el-form-item label="跟进2"><el-input type="textarea" v-model="follow.follow1.content"></el-input></el-form-item>
    <el-form-item label="跟进3"><el-input type="textarea" v-model="follow.follow2.content"></el-input></el-form-item>
    <el-form-item>
      <el-button type="primary" @click="onSubmit">保存</el-button>
      <el-button @click="back">返回</el-button>
    </el-form-item>
  </el-form>
</div>
</template>
<script>
export default {
  data () {
    return {
      customerId: -1,
      enquiry: {},
      follow: {
        follow0: {},
        follow1: {},
        follow2: {}
      }
    }
  },
  mounted: function () {
    this.customerId = this.$route.query.customerId
    this.getEnquiry()
  },
  methods: {
    onSubmit () {
      if (this.$util.isNull(this.enquiry.id)) {
        this.$db.insert(this.$mapper.enquiryAdd, [this.customerId, this.enquiry.content,
          this.enquiry.quote, new Date().getTime()], id => {
          this.enquiry.id = id
          this.followSubmit()
          this.$msg.succ()
          this.$router.go(-1)
        })
      } else {
        this.$db.exec(this.$mapper.enquiryEdit, [this.enquiry.content, this.enquiry.quote, this.enquiry.id], () => {
          this.followSubmit()
          this.$msg.succ()
          this.$router.go(-1)
        })
      }
    },
    followSubmit () {
      let time = new Date().getTime()
      if (this.$util.isNull(this.follow.follow0.id)) {
        if (!this.$util.isNull(this.follow.follow0.content)) {
          time++
          this.$db.insert(this.$mapper.followAdd, [this.enquiry.id, this.follow.follow0.content, time])
        }
      } else {
        this.$db.exec(this.$mapper.followEdit, [this.follow.follow0.content, this.follow.follow0.id])
      }
      if (this.$util.isNull(this.follow.follow1.id)) {
        if (!this.$util.isNull(this.follow.follow1.content)) {
          time++
          this.$db.insert(this.$mapper.followAdd, [this.enquiry.id, this.follow.follow1.content, time])
        }
      } else {
        this.$db.exec(this.$mapper.followEdit, [this.follow.follow1.content, this.follow.follow1.id])
      }
      if (this.$util.isNull(this.follow.follow2.id)) {
        if (!this.$util.isNull(this.follow.follow2.content)) {
          time++
          this.$db.insert(this.$mapper.followAdd, [this.enquiry.id, this.follow.follow2.content, time])
        }
      } else {
        this.$db.exec(this.$mapper.followEdit, [this.follow.follow2.content, this.follow.follow2.id])
      }
    },
    getEnquiry () {
      this.$db.query(this.$mapper.enquirySelectByCustomerId, this.customerId, rows => {
        if (rows.length > 0) {
          this.enquiry = rows[0]
          this.$db.query(this.$mapper.followSelectByEnquiryId, this.enquiry.id, rows2 => {
            if (rows2.length > 0) {
              this.follow.follow0 = rows2[0]
              if (this.$util.isNull(rows2[1])) {
                return
              }
              this.follow.follow1 = rows2[1]
              if (this.$util.isNull(rows2[2])) {
                return
              }
              this.follow.follow2 = rows2[2]
            }
          })
        }
      })
    },
    back () {
      this.$router.go(-1)
    }
  }
}
</script>


