import HomeView from '../views/HomeView.vue'
export default [
  {
    path: '/',
    name: 'home',
    redirect: '/home',
    component: HomeView,
    children: [{
      path: 'home',
      name: 'home',
      meta: {
        hideInMenu: true,
        title: '首页',
        icon: 'md-home'
      },
      component: () => import('@/views/engine/single-page/home/homeV')
    }]
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/timeLiness',
    name: 'timeLiness',
    component: () => import('@/views/engine/trackingAdmin/timeLiness')
  },
  {
    path: '/sync-log',
    name: 'sync-log',
    component: () => import('@/views/engine/forecastMessage/sync-log')
  },
  {
    path: '/BI-logisticsOverview',
    name: 'BI-logisticsOverview',
    component: () => import('@/views/engine/BILogisticsOverview/list.vue')
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/views/engine/login/loginV.vue')
    // component: () => import(/* webpackChunkName: "about" */ '../views/engine/login/loginV.vue')
  }
]
