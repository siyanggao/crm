let mapper = {}

mapper.customerGroupSelect = 'select * from customer_group'
mapper.customerGroupGet = 'select * from customer_group where id=?'
mapper.customerGroupAdd = 'insert into customer_group(label,parent_id) values(?,?)'
mapper.customerGroupEdit = 'update customer_group set label=? where id=?'
mapper.customerGroupDel = 'delete from customer_group where id=?'

mapper.customerSelect = 'select fields from customer ' +
  'left join dict t2 on customer.type=t2.id ' +
  'left join dict t3 on customer.level=t3.id ' +
  'where group_id in (ids) condition order by customer.id desc limit ? offset ?'
mapper.customerAdd = 'insert into customer(group_id,name,country,addr,company,phone,fox,email,postcode,type,level,website,introduce) values (?,?,?,?,?,?,?,?,?,?,?,?,?)'
mapper.customerEdit = 'update customer set group_id=?,name=?,country=?,addr=?,company=?,phone=?,fox=?,email=?,postcode=?,type=?,level=?,website=?,introduce=? where id=?'
mapper.customerDel = 'delete from customer where id=?'

mapper.dictSelect = 'select * from dict'
mapper.dictAdd = 'insert into dict(label,type,sequence) values(?,?,?)'
mapper.dictEdit = 'update dict set label=?,type=?,sequence=? where id=?'
mapper.dictDel = 'delete from dict where id=?'
mapper.dictSelectByType = 'select * from dict where type=? order by sequence'

mapper.enquirySelectByCustomerId = 'select * from enquiry where customer_id=?'
mapper.enquiryAdd = 'insert into enquiry(customer_id,content,quote,create_time) values(?,?,?,?)'
mapper.enquiryEdit = 'update enquiry set content=?,quote=? where id=?'

mapper.followSelectByEnquiryId = 'select * from follow where enquiry_id=?'
mapper.followAdd = 'insert into follow(enquiry_id,content,create_time) values(?,?,?)'
mapper.followEdit = 'update follow set content=? where id=?'

export default mapper
