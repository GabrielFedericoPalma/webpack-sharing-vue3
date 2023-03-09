
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/login', name:'login', component: () => import('pages/login.vue'), meta: {public:true} },
      { path: '/', component: () => import('pages/IndexPage.vue') },
      { path: '/teams', name:'profiles', component: () => import('pages/IndexPage.vue') },
      { path: ':team/addFolder', component: () => import('src/pages/addFolder.vue') },
      { path: '/addTeam', component: () => import('src/pages/addTeam.vue') },
      { path: ':team/editTeam', component: () => import('src/pages/editTeam.vue') },
      { path: ':team/folders', component: () => import('src/pages/folders.vue') },
      { path: ':team/:id/addFiles', component: () => import('src/pages/addFiles.vue') },
      { path: ':team/:id', component: () => import('pages/dashboardFiles.vue'), meta: {public:true} },
      { path: ':team/:id/file/:img', component: () => import('pages/viewFile.vue'), meta: {public:true} },
      // { path: ':team/:id/file/:img/editFile', component: () => import('pages/editFile.vue') },
      { path: ':team/withPass/:fileId', component: () => import('pages/withPass.vue'), meta: {public:true} },
      // { path: '/issue-report', component: () => import('pages/issueReport.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
