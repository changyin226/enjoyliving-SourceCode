<template>
  <div>
    <Alert></Alert>
    <router-view></router-view>
  </div>
</template>

<script>
import Alert from '@/components//back/Alert.vue';

export default {
  components: {
    Alert,
  },
  mounted() {
    const bodyEl = document.body;
    bodyEl.classList.add('backend');
    bodyEl.style.lineHeight = '';
  },
};
</script>
