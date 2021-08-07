<template>
  <div class="front-end-page">
    <loading
      :active.sync="isLoading"
      color="#00d2ff"
      :lock-scroll="true"
    />
    <Navbar />
    <Alert />
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
    <Footer />
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
  data() {
    return {
      isLoading: false,
    };
  },
  created() {
    const bodyEl = document.body;
    bodyEl.classList.remove('backend');
    bodyEl.style.lineHeight = 1;
    this.$bus.$on('update:loading', (isLoading) => {
      this.isLoading = isLoading;
    });
  },
};
</script>

<style lang="scss">
.front-end-pageP{
  position: relative;
}
</style>
