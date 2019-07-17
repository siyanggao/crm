import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: require('@/components/home').default,
      children: [
        {
          path: '',
          name: 'customer',
          component: require('@/components/customer/customer').default
        },
        {
          path: 'customerAddOrEdit',
          name: 'customerAddOrEdit',
          component: require('@/components/customer/customerAddOrEdit').default
        },
        {
          path: 'setting/customer_group',
          name: 'setting_customer_group',
          component: require('@/components/setting/customer_group').default
        }
      ]
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
