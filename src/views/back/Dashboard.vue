<template>
  <div class="dashboard-page">
    <Navbar/>
    <div class="container-fluid">
        <div class="row">
          <Sidebar></Sidebar>
          <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <router-view></router-view>
          </main>
        </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import Sidebar from '@/components/back/Sidebar.vue';
import Navbar from '@/components/back/Navbar.vue';

export default {
  components: {
    Sidebar,
    Navbar,
  },
  created() {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
    this.$http.defaults.headers.common.Authorization = `${token}`;
  },
  beforeRouteUpdate(to, from, next) {
    $('#sidebarMenu').collapse('hide');
    $('body').removeClass('no-scroll');
    next();
  },
};
</script>
