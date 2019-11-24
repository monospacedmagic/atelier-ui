const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  }, {
    path: '/playground',
    meta: {
      showDocslink: false
    },
    component: () => import('layouts/Playground.vue'),
    children: [
      { path: '', component: () => import('pages/screens/General.vue') }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
