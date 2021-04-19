import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: () => import('@/views/front/FrontEnd.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('@/views/front/Home.vue'),
          meta: {
            keepAlive: true,
          },
        },
        {
          path: '/productlist/:category/:page(\\d+)',
          name: 'ProductList',
          component: () => import('@/views/front/ProductList.vue'),
          meta: {
            keepAlive: true,
          },
        },
        {
          path: '/product/:id',
          name: 'Product',
          component: () => import('@/views/front/Product.vue'),
        },
        {
          path: '/favorites/:page(\\d+)',
          name: 'Favorites',
          component: () => import('@/views/front/Favorites.vue'),
          meta: {
            keepAlive: true,
          },
        },
        {
          path: '/about',
          name: 'About',
          component: () => import('@/views/front/About.vue'),
        },
        {
          path: '/contact',
          name: 'Contact',
          component: () => import('@/views/front/Contact.vue'),
        },
        {
          path: '/cart',
          name: 'Cart',
          component: () => import('@/views/front/Cart.vue'),
        },
        {
          path: '/checkout',
          component: () => import('@/views/front/CheckOut.vue'),
          children: [
            {
              path: '',
              name: 'CheckOrder',
              component: () => import('@/views/front/CheckOrder.vue'),
            },
            {
              path: ':order_id',
              name: 'Order',
              component: () => import('@/views/front/Order.vue'),
              children: [
                {
                  path: 'finish',
                  name: 'Finish',
                  component: () => import('@/views/front/Finish.vue'),
                },
              ],
            },
          ],
        },
      ],
    },
    {
      path: '/login',
      component: () => import('@/views/back/BackEnd.vue'),
      children: [
        {
          path: '',
          name: 'Login',
          component: () => import('@/views/back/Login.vue'),
        },
        {
          path: '/admin',
          name: 'Dashboard',
          component: () => import('@/views/back/Dashboard.vue'),
          children: [
            {
              path: 'products/:page(\\d+)',
              name: 'Products',
              component: () => import('@/views/back/Products.vue'),
              meta: {
                requiresAuth: true,
              },
            },
            {
              path: 'orders/:page(\\d+)',
              name: 'Orders',
              component: () => import('@/views/back/Orders.vue'),
              meta: {
                requiresAuth: true,
              },
            },
            {
              path: 'coupons/:page(\\d+)',
              name: 'Coupons',
              component: () => import('@/views/back/Coupons.vue'),
              meta: {
                requiresAuth: true,
              },
            },
          ],
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
