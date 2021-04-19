<template>
  <div class="front-end-page">
    <Navbar></Navbar>
    <Alert></Alert>
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-else></router-view>
    <Footer></Footer>
  </div>
</template>

<script>
import Navbar from '@/components/front/Navbar.vue';
import Footer from '@/components/front/Footer.vue';
import Alert from '@/components/front/Alert.vue';

export default {
  components: {
    Navbar,
    Footer,
    Alert,
  },
  mounted() {
    const bodyEl = document.body;
    bodyEl.classList.remove('backend');
    bodyEl.style.lineHeight = 1;
  },
};
</script>

<style lang="scss">
.front-end-pageP{
  position: relative;
}
</style>
