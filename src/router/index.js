import Vue from 'vue';
import Router from 'vue-router';
import axios from 'axios';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import(/* webpackChunkName: "FrontEnd" */ '@/views/front/FrontEnd.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import(/* webpackChunkName: "FrontEnd" */ '@/views/front/Home.vue'),
          meta: {
            keepAlive: true,
          },
        },
        {
          path: 'productlist/:category/:page(\\d+)',
          name: 'ProductList',
          component: () => import(/* webpackChunkName: "FrontEnd" */ '@/views/front/ProductList.vue'),
          meta: {
            keepAlive: true,
          },
        },
        {
          path: 'product/:id',
          name: 'Product',
          component: () => import(/* webpackChunkName: "FrontEnd" */ '@/views/front/Product.vue'),
        },
        {
          path: 'favorites/:page(\\d+)',
          name: 'Favorites',
          component: () => import(/* webpackChunkName: "FrontEnd" */ '@/views/front/Favorites.vue'),
          meta: {
            keepAlive: true,
          },
        },
        {
          path: 'about',
          name: 'About',
          component: () => import(/* webpackChunkName: "FrontEnd" */ '@/views/front/About.vue'),
        },
        {
          path: 'contact',
          name: 'Contact',
          component: () => import(/* webpackChunkName: "FrontEnd" */ '@/views/front/Contact.vue'),
        },
        {
          path: 'cart',
          name: 'Cart',
          component: () => import(/* webpackChunkName: "FrontEnd" */ '@/views/front/Cart.vue'),
        },
        {
          path: 'checkout',
          component: () => import(/* webpackChunkName: "FrontEnd-CheckOut" */ '@/views/front/CheckOut.vue'),
          children: [
            {
              path: '',
              name: 'CheckOrder',
              component: () => import(/* webpackChunkName: "FrontEnd-CheckOut" */ '@/views/front/CheckOrder.vue'),
            },
            {
              path: ':order_id',
              name: 'Order',
              component: () => import(/* webpackChunkName: "FrontEnd-CheckOut" */ '@/views/front/Order.vue'),
              children: [
                {
                  path: 'finish',
                  name: 'Finish',
                  component: () => import(/* webpackChunkName: "FrontEnd-CheckOut" */ '@/views/front/Finish.vue'),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      component: () => import(/* webpackChunkName: "BackEnd" */ '@/views/back/BackEnd.vue'),
      children: [
        {
          path: '',
          name: 'Login',
          component: () => import(/* webpackChunkName: "BackEnd" */ '@/views/back/Login.vue'),
        },
        {
          path: '/admin',
          name: 'Dashboard',
          component: () => import(/* webpackChunkName: "BackEnd-Dashboard" */ '@/views/back/Dashboard.vue'),
          children: [
            {
              path: 'products/:page(\\d+)',
              name: 'Products',
              component: () => import(/* webpackChunkName: "BackEnd-Dashboard" */ '@/views/back/Products.vue'),
            },
            {
              path: 'orders/:page(\\d+)',
              name: 'Orders',
              component: () => import(/* webpackChunkName: "BackEnd-Dashboard" */ '@/views/back/Orders.vue'),
            },
            {
              path: 'coupons/:page(\\d+)',
              name: 'Coupons',
              component: () => import(/* webpackChunkName: "BackEnd-Dashboard" */ '@/views/back/Coupons.vue'),
            },
          ],
          beforeEnter: (to, from, next) => {
            const api = `${process.env.VUE_APP_APIPATH}/api/user/check`;
            axios.post(api).then((response) => {
              if (response.data.success) next();
              else next({ path: '/login' });
            });
          },
        },
      ],
    },
    {
      path: '*',
      redirect: '/',
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (to.name === 'ProductList' && from.name === 'ProductList') return { x: 0, y: 666 };
    if (to.name === 'Favorites' && from.name === 'Favorites') return { x: 0, y: 666 };
    if (savedPosition && to.meta.keepAlive && from.name === 'Product') return savedPosition;
    return { x: 0, y: 0 };
  },
});
