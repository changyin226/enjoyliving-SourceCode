<template>
  <div>
    <loading
      :active.sync="isLoading"
      color="#00d2ff"
      background-color="#000"
      :lock-scroll="true"
    />
    <Alert />
    <router-view />
  </div>
</template>

<script>
import Alert from '@/components//back/Alert.vue';

export default {
  components: {
    Alert,
  },
  data() {
    return {
      isLoading: false,
    };
  },
  created() {
    const bodyEl = document.body;
    bodyEl.classList.add('backend');
    bodyEl.style.lineHeight = '';
    this.$bus.$on('update:loading', (isLoading) => {
      this.isLoading = isLoading;
    });
  },
};
</script>
