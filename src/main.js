import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import store from './store'
import router from './router'
import './plugins/iview.js'
import VueTour from 'vue-tour'
import Highcharts from 'highcharts/highstock';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsDrilldown from 'highcharts/modules/drilldown';
import Highcharts3D from 'highcharts/highcharts-3d';
import cytoscape from 'cytoscape';
import cola from 'cytoscape-cola';
import echarts from 'echarts'

Vue.prototype.$echarts = echarts
HighchartsMore(Highcharts)
HighchartsDrilldown(Highcharts);
Highcharts3D(Highcharts);
require('highcharts/modules/map')(Highcharts);
require('vue-tour/dist/vue-tour.css');
cytoscape.use( cola );
import VueFormGenerator from "vue-form-generator";
import "vue-form-generator/dist/vfg.css";

Vue.use(VueTour);
Vue.use(VueFormGenerator);
require('swiper/dist/css/swiper.css');

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
