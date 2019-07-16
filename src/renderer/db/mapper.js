let mapper = {}

mapper.customerGroupAdd = 'insert into customer_group(label,parent_id) values(?,?)'
mapper.customerGroupDel = 'delete from customer_group where id=?'

export default mapper
