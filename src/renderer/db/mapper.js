let mapper = {}

mapper.customerGroupAdd = 'insert into customer_group(label,parent_id) values(?,?)'
mapper.customerGroupEdit = 'update customer_group set label=? where id=?'
mapper.customerGroupDel = 'delete from customer_group where id=?'

mapper.customerSelect = 'select * from customer where group_id in (?) order by id desc'

export default mapper
