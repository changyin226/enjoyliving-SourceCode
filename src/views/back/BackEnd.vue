<template>
  <router-view></router-view>
</template>

<script>
export default {
  mounted() {
    const bodyEl = document.body;
    bodyEl.classList.add('backend');
    bodyEl.style.lineHeight = '';
  },
};
</script>
