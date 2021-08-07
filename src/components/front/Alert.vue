<template>
  <div class="alert-component">
    <div
      v-for="(item, i) in messages"
      :key="i"
      class="alert alert-dismissible animate__animated animate__fadeInRight mb-1"
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
  data() {
    return {
      messages: [],
    };
  },
  mounted() {
    this.$bus.$on('message:push', (message, status = 'danger') => {
      this.updateMessage(message, status);
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
      setTimeout(() => {
        this.messages.forEach((item, i) => {
          if (item.timestamp === timestamp) {
            this.messages.splice(i, 1);
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
  top: 66px;
  right: 0;
  z-index: 10000;
  .alert{
    margin: 0;
  }
  p{
    color: inherit;
    margin: 0;
  }
}
</style>
