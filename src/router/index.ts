import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Game Projects',
    component: () => import(/* webpackChunkName: "about" */ '../views/GameProjects.vue')
  },
  {
    path: '/resume',
    name: 'Resume',
    component: () => import(/* webpackChunkName: "about" */ '../views/Resume.vue')
  },
  {
    path: '/game-projects',
    name: 'Game Projects',
    component: () => import(/* webpackChunkName: "about" */ '../views/GameProjects.vue')
  },
  {
    path: '/other-projects',
    name: 'Other Projects',
    component: () => import(/* webpackChunkName: "about" */ '../views/OtherProjects.vue')
  },
  {
    path: '/other-stuff',
    name: 'Other Stuff',
    component: () => import(/* webpackChunkName: "about" */ '../views/OtherStuff.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import(/* webpackChunkName: "about" */ '../views/Contact.vue')
  },
  {
    path: '/one-page',
    name: 'One Page',
    component: () => import(/* webpackChunkName: "about" */ '../views/OnePage.vue')
  },
  {
    path: '/project/:id',
    name: 'Project Details',
    component: () => import(/* webpackChunkName: "about" */ '../views/ProjectDetails.vue')
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import(/* webpackChunkName: "about" */ '../views/404.vue')
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(savedPosition)
        }, 250)
      })
    }
    return { x: 0, y: 0 }
  }
})

export default router
