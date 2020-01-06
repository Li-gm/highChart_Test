import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home/home.vue'
import VuexDome from './views/Home/vuexDome.vue'
import HighCharts from './views/Home/highCharts.vue'
import ClearFix from './views/Home/clearFix.vue'
import ArrayOperation from './views/Home/arrayOperation.vue'
import TourDome from './views/Home/tourDome.vue'
import formGenerator from './views/Home/formGenerator.vue'
import network from './views/Home/network.vue'
import echarts from './views/Home/echarts.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/home',
      name: 'home',
      component: Home
    },
    {
      path: '/VuexDome',
      name: 'VuexDome',
      component: VuexDome
    },{
      path: '/HighCharts',
      name: 'HighCharts',
      component: HighCharts
    },{
      path: '/ClearFix',
      name: 'ClearFix',
      component: ClearFix
    },{
      path: '/ArrayOperation',
      name: 'ArrayOperation',
      component: ArrayOperation
    },{
      path: '/TourDome',
      name: 'TourDome',
      component: TourDome
    },{
      path: '/formGenerator',
      name: 'formGenerator',
      component: formGenerator
    },{
      path: '/network',
      name: 'network',
      component: network
    },{
      path: '/',
      name: 'echarts',
      component: echarts
    },
  ]
})
