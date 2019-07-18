let mapper = {}

mapper.customerGroupSelect = 'select * from customer_group where id=?'
mapper.customerGroupAdd = 'insert into customer_group(label,parent_id) values(?,?)'
mapper.customerGroupEdit = 'update customer_group set label=? where id=?'
mapper.customerGroupDel = 'delete from customer_group where id=?'

mapper.customerSelect = 'select fields from customer where group_id in (ids) condition order by id desc limit ? offset ?'
mapper.customerAdd = 'insert into customer(group_id,name,country,addr) values (?,?,?,?)'
mapper.customerEdit = 'update customer set group_id=?,name=?,country=?,addr=? where id=?'
mapper.customerDel = 'delete from customer where id=?'

export default mapper
