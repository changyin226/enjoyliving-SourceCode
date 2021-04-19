import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import VueWaypoint from 'vue-waypoint';
import animated from 'animate.css';
import 'bootstrap';
import { ValidationObserver, ValidationProvider, extend, localize, configure } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import tw from 'vee-validate/dist/locale/zh_TW.json';
import App from '@/App.vue';
import router from '@/router';
import '@/bus';
import currencyFilter from '@/filters/currency';
import timestampFilter from '@/filters/timestamp';

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);
Vue.use(VueWaypoint);
Vue.use(animated);

Vue.filter('currency', currencyFilter);
Vue.filter('timestamp', timestampFilter);

Vue.component('Loading', Loading);

Object.keys(rules).forEach((rule) => {
  extend(rule, rules[rule]);
});
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
localize('zh_TW', tw);
configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
  },
});

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const api = `${process.env.VUE_APP_APIPATH}/api/user/check`;
    axios.post(api).then((response) => {
      if (response.data.success) {
        next();
      } else {
        next({
          path: '/login',
        });
      }
    });
  } else {
    next();
  }
});
