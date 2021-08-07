<template>
  <div class="alert-component">
    <div
      v-for="(item, i) in messages"
      :key="i"
      class="alert alert-dismissible"
      :class="'alert-' + item.status"
    >
      <p>{{ item.message }}</p>
      <button
        type="button"
        class="close"
        @click="removeMessage(i)"
      >
        <span>&times;</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Alert',
  data() {
    return {
      messages: [],
    };
  },
  created() {
    const vm = this;
    vm.$bus.$on('message:push', (message, status = 'danger') => {
      vm.updateMessage(message, status);
    });
  },
  methods: {
    updateMessage(message, status) {
      const timestamp = Math.floor(new Date() / 1000);
      this.messages.push({
        message,
        status,
        timestamp,
      });
      this.removeMessageWithTiming(timestamp);
    },
    removeMessage(num) {
      this.messages.splice(num, 1);
    },
    removeMessageWithTiming(timestamp) {
      const vm = this;
      setTimeout(() => {
        vm.messages.forEach((item, i) => {
          if (item.timestamp === timestamp) {
            vm.messages.splice(i, 1);
          }
        });
      }, 5000);
    },
  },
};
</script>

<style lang="scss">
.alert-component {
  position: fixed;
  max-width: 50%;
  top: 56px;
  right: 0;
  z-index: 1100;
  p{
    font-size: 16px;
    font-weight: 400;
    line-height: 1.5;
    margin-bottom: 0;
  }
}
</style>
