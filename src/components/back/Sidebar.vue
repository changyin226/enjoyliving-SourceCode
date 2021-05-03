<template>
    <nav id="sidebarMenu" class="sidebar-component col-md-3 col-lg-2
      d-md-block bg-light sidebar collapse">
      <div class="sidebar-sticky pt-3">
        <h6 class="sidebar-heading d-flex justify-content-between align-items-center
          px-3 mt-4 mb-1 text-muted">
          <span>管理員</span>
        </h6>
        <ul class="nav flex-column mb-2">
          <li class="nav-item">
            <router-link to="/admin/products/1" class="nav-link"
              :class="{ active: active === 'Products'}">
              <i class="fa fa-archive"></i>
              產品列表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/orders/1" class="nav-link"
              :class="{ active: active === 'Orders'}">
              <i class="fa fa-list-alt"></i>
              訂單列表
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/admin/coupons/1" class="nav-link"
              :class="{ active: active === 'Coupons'}">
              <i class="fa fa-ticket"></i>
              優惠卷
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
</template>

<script>
export default {
  data() {
    return {
      active: '',
    };
  },
  methods: {
    changeActive() {
      this.active = this.$route.name;
    },
  },
  mounted() {
    this.$bus.$on('update:routerActive', this.changeActive);
  },
};
</script>

<style lang="scss">
.sidebar-component{
  ul.nav{
    a.active{
      color: #00d2ff;
    }
  }
}
</style>
