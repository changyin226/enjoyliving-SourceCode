<template>
  <nav class="navbar-compontent navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
    <h1 class="navbar-brand col-md-3 col-lg-2 mr-0 mb-0 px-3">
      <router-link to="/">
        享住EnjoyLiving
      </router-link>
    </h1>
    <button
      type="button"
      class="navbar-toggler position-absolute d-md-none collapsed"
      data-toggle="collapse"
      data-target="#sidebarMenu"
      @click="toggleBodyNoScroll"
    >
      <span class="navbar-toggler-icon" />
    </button>
    <input
      class="form-control form-control-dark w-100"
      type="text"
      name="收尋"
      placeholder="Search"
      aria-label="Search"
    >
    <ul class="navbar-nav px-3">
      <li class="nav-item text-nowrap">
        <a
          class="nav-link"
          href="#"
          @click.prevent="signout"
        >Sign out</a>
      </li>
    </ul>
  </nav>
</template>

<script>
import $ from 'jquery';

export default {
  methods: {
    toggleBodyNoScroll() {
      $('body').toggleClass('no-scroll');
    },
    signout() {
      const api = `${process.env.VUE_APP_APIPATH}/logout`;
      this.$http.post(api).then((response) => {
        if (response.data.success) {
          this.$bus.$emit('message:push', response.data.message);
          this.$router.push('/login');
        }
      });
    },
  },
};
</script>
